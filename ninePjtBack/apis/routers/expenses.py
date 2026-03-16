import logging
import os
import uuid
from decimal import Decimal
from io import BytesIO
from typing import Optional

from django.conf import settings
from django.db import transaction as db_transaction
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from ninja import File, Router, UploadedFile

from apis.auth import JWTAuth
from apis.schemas.base import ErrorSchema
from apis.schemas.requests.settlements import ExpenseCreateRequest, ExpenseUpdateRequest
from apis.schemas.responses.settlements import (
    ExpenseImageUploadResponse,
    ExpenseResponse,
)
from integrations.ai.image_recognition import analyze_payment_image_to_json
from repositories import (
    ExpenseAttachmentRepository,
    ExpenseItemRepository,
    ExpenseRepository,
    ExpenseShareRepository,
    SettlementGroupRepository,
)

router = Router(tags=["Expenses"])
logger = logging.getLogger(__name__)


@router.get("", auth=JWTAuth(), response=list[ExpenseResponse])
def list_expenses(
    request,
    organization: Optional[int] = None,
    group: Optional[int] = None,
    payer: Optional[int] = None,
):
    user = request.auth
    return ExpenseRepository.get_list(
        user=user,
        organization_id=organization,
        group_id=group,
        payer_id=payer,
    )


@router.post("", auth=JWTAuth(), response={201: ExpenseResponse, 400: ErrorSchema})
def create_expense(request, payload: ExpenseCreateRequest):
    user = request.auth
    group_id = payload.group
    merchant_name = (payload.title or "").strip()
    amount_str = payload.amount
    memo = (payload.note or "").strip()
    paid_at_str = payload.paid_at
    split_type = payload.split_type if payload.split_type in ("EQUAL", "CUSTOM") else "EQUAL"

    if not group_id or not merchant_name or not amount_str:
        return 400, {"detail": "group, title, amount는 필수입니다."}

    try:
        amount = Decimal(str(amount_str))
    except (ValueError, TypeError):
        return 400, {"detail": "amount는 유효한 숫자여야 합니다."}

    group = SettlementGroupRepository.get_by_id(group_id)
    if not group:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    # CUSTOM 분할 시 participants 합계 검증
    if split_type == "CUSTOM" and payload.participants:
        try:
            participant_total = sum(
                Decimal(str(p.amount)) for p in payload.participants if p.amount
            )
        except (ValueError, TypeError):
            return 400, {"detail": "참여자 금액은 유효한 숫자여야 합니다."}
        if abs(participant_total - amount) > Decimal("0.01"):
            return 400, {"detail": "참여자 금액 합계가 총 금액과 일치하지 않습니다."}

    paid_at = None
    if paid_at_str:
        try:
            paid_at = parse_datetime(paid_at_str) or timezone.now()
        except Exception:
            paid_at = timezone.now()

    expense = ExpenseRepository.create(
        group=group,
        payer=user,
        amount=amount,
        merchant_name=merchant_name,
        memo=memo,
        paid_at=paid_at,
    )
    # split_type 저장
    if split_type != "EQUAL":
        expense.split_type = split_type
        expense.save()

    # 참여자 정보 저장
    if payload.participants:
        from django.contrib.auth import get_user_model

        User = get_user_model()
        user_ids = [p.user_id for p in payload.participants]
        existing_users = set(
            User.objects.filter(pk__in=user_ids).values_list("pk", flat=True)
        )
        invalid_ids = [uid for uid in user_ids if uid not in existing_users]
        if invalid_ids:
            expense.is_deleted = True
            expense.save()
            return 400, {"detail": f"존재하지 않는 사용자 ID: {invalid_ids}"}

        shares = []
        for p in payload.participants:
            share = {"user_id": p.user_id}
            if p.amount:
                share["amount"] = Decimal(str(p.amount))
            shares.append(share)
        ExpenseShareRepository.bulk_create(expense, shares)

    return 201, expense


@router.get("/{pk}", auth=JWTAuth(), response={200: ExpenseResponse, 404: ErrorSchema})
def get_expense(request, pk: int):
    expense = ExpenseRepository.get_by_id(pk)
    if not expense:
        return 404, {"detail": "지출을 찾을 수 없습니다."}
    return 200, expense


@router.patch("/{pk}", auth=JWTAuth(), response={200: ExpenseResponse, 400: ErrorSchema, 404: ErrorSchema})
@db_transaction.atomic
def update_expense(request, pk: int, payload: ExpenseUpdateRequest):
    expense = ExpenseRepository.get_by_id(pk)
    if not expense:
        return 404, {"detail": "지출을 찾을 수 없습니다."}

    amount = None
    if payload.amount is not None:
        try:
            amount = Decimal(str(payload.amount))
        except (ValueError, TypeError):
            return 400, {"detail": "amount는 유효한 숫자여야 합니다."}

    split_type = payload.split_type
    if split_type is not None and split_type not in ("EQUAL", "CUSTOM"):
        return 400, {"detail": "split_type은 EQUAL 또는 CUSTOM이어야 합니다."}

    # CUSTOM이면서 participants 있으면 합계 검증
    if split_type == "CUSTOM" and payload.participants:
        effective_amount = amount if amount is not None else expense.amount
        try:
            participant_total = sum(
                Decimal(str(p.amount)) for p in payload.participants if p.amount
            )
        except (ValueError, TypeError):
            return 400, {"detail": "참여자 금액은 유효한 숫자여야 합니다."}
        if abs(participant_total - effective_amount) > Decimal("0.01"):
            return 400, {"detail": "참여자 금액 합계가 총 금액과 일치하지 않습니다."}

    paid_at = None
    if payload.paid_at is not None and payload.paid_at:
        try:
            paid_at = parse_datetime(payload.paid_at) or timezone.now()
        except Exception:
            paid_at = None

    expense = ExpenseRepository.update(
        expense=expense,
        amount=amount,
        title=payload.title,
        note=payload.note,
        paid_at=paid_at,
        merchant_name=payload.merchant_name,
        memo=payload.memo,
        split_type=split_type,
    )

    # participants 변경 시 기존 분담 기록 삭제 후 재생성
    if payload.participants is not None or split_type is not None:
        ExpenseShareRepository.delete_by_expense(expense)
        if payload.participants:
            from django.contrib.auth import get_user_model

            User = get_user_model()
            user_ids = [p.user_id for p in payload.participants]
            existing_users = set(
                User.objects.filter(pk__in=user_ids).values_list("pk", flat=True)
            )
            invalid_ids = [uid for uid in user_ids if uid not in existing_users]
            if invalid_ids:
                return 400, {"detail": f"존재하지 않는 사용자 ID: {invalid_ids}"}

            shares = []
            for p in payload.participants:
                share = {"user_id": p.user_id}
                if p.amount:
                    share["amount"] = Decimal(str(p.amount))
                shares.append(share)
            ExpenseShareRepository.bulk_create(expense, shares)

    return 200, expense


@router.delete("/{pk}", auth=JWTAuth(), response={200: dict, 404: ErrorSchema})
def delete_expense(request, pk: int):
    expense = ExpenseRepository.get_by_id(pk)
    if not expense:
        return 404, {"detail": "지출을 찾을 수 없습니다."}

    ExpenseRepository.soft_delete(expense)
    return 200, {"message": "지출이 삭제되었습니다."}


@router.patch("/{pk}/settle", auth=JWTAuth(), response={200: ExpenseResponse, 404: ErrorSchema})
def settle_expense(request, pk: int):
    expense = ExpenseRepository.get_by_id(pk)
    if not expense:
        return 404, {"detail": "지출을 찾을 수 없습니다."}

    expense = ExpenseRepository.mark_settled(expense, True)
    return 200, expense


@router.post(
    "/analyze-image",
    auth=JWTAuth(),
    response={201: ExpenseImageUploadResponse, 400: ErrorSchema},
)
def upload_expense_image(
    request,
    group: int,
    image: UploadedFile = File(...),
):
    user = request.auth

    if not image:
        return 400, {"detail": "image 파일이 필요합니다."}

    if not group:
        return 400, {"detail": "group은 필수입니다."}

    settlement_group = SettlementGroupRepository.get_by_id(group)
    if not settlement_group:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    file_ext = os.path.splitext(image.name)[1] or ".jpg"
    mime_type_map = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }

    mime_type = image.content_type
    if not mime_type:
        mime_type = mime_type_map.get(file_ext.lower(), "image/jpeg")

    try:
        image_bytes = image.read()
        image.seek(0)
    except Exception as e:
        return 400, {"detail": f"파일 읽기 실패: {str(e)}"}

    try:
        from PIL import Image

        img = Image.open(BytesIO(image_bytes))
        img_format = img.format
        img.verify()

        max_size = 20 * 1024 * 1024
        if len(image_bytes) > max_size:
            return 400, {"detail": "이미지 크기가 너무 큽니다. 최대 20MB까지 지원됩니다."}

        if img_format not in ["JPEG", "PNG", "GIF", "WEBP"]:
            return 400, {"detail": f"지원하지 않는 이미지 형식입니다: {img_format}"}
    except ImportError:
        logger.warning("Pillow가 설치되지 않아 이미지 유효성 검증을 건너뜁니다.")
    except Exception as e:
        return 400, {"detail": f"유효하지 않은 이미지 파일입니다: {str(e)}"}

    file_name = f"{uuid.uuid4()}{file_ext}"
    upload_dir = os.path.join(settings.BASE_DIR, "media", "expenses")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file_name)

    try:
        with open(file_path, "wb") as f:
            for chunk in image.chunks():
                f.write(chunk)
    except Exception as e:
        return 400, {"detail": f"파일 저장 실패: {str(e)}"}

    relative_file_path = f"expenses/{file_name}"

    analysis_result = {}
    try:
        analysis_result = analyze_payment_image_to_json(
            image_bytes=image_bytes, mime_type=mime_type
        )
    except Exception as e:
        logger.error(f"이미지 분석 실패: {type(e).__name__}: {str(e)}", exc_info=True)
        analysis_result = {}

    merchant_name = analysis_result.get("merchant_name") or ""
    amount_str = analysis_result.get("amount") or "0"
    currency = analysis_result.get("currency") or ""
    paid_at_str = analysis_result.get("paid_at")
    payment_method = analysis_result.get("payment_method") or ""
    memo = analysis_result.get("memo") or ""

    try:
        amount = Decimal(str(amount_str))
    except (ValueError, TypeError):
        amount = Decimal("0")

    paid_at = None
    if paid_at_str:
        try:
            paid_at = parse_datetime(paid_at_str)
        except Exception:
            pass

    expense = ExpenseRepository.create(
        group=settlement_group,
        payer=user,
        amount=amount,
        merchant_name=merchant_name,
        currency=currency,
        paid_at=paid_at,
        payment_method=payment_method,
        memo=memo,
    )

    items_data = analysis_result.get("items", [])
    if isinstance(items_data, list):
        for item_data in items_data:
            if not isinstance(item_data, dict):
                continue

            item_name = item_data.get("name") or ""
            item_quantity = item_data.get("quantity")
            unit_price_str = item_data.get("unit_price")
            total_price_str = item_data.get("total_price")

            try:
                quantity = int(item_quantity) if item_quantity is not None else None
            except (ValueError, TypeError):
                quantity = None

            unit_price = None
            if unit_price_str:
                try:
                    unit_price = Decimal(str(unit_price_str))
                except (ValueError, TypeError):
                    unit_price = None

            total_price = None
            if total_price_str:
                try:
                    total_price = Decimal(str(total_price_str))
                except (ValueError, TypeError):
                    total_price = None

            ExpenseItemRepository.create(
                expense=expense,
                name=item_name,
                quantity=quantity,
                unit_price=unit_price,
                total_price=total_price,
            )

    attachment = ExpenseAttachmentRepository.create(
        expense=expense,
        file_path=relative_file_path,
        caption="",
    )

    return 201, {
        "expense": expense,
        "attachment": attachment,
        "analysis": analysis_result,
    }
