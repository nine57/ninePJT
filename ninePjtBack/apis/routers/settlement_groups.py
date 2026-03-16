from decimal import Decimal

from django.db import transaction
from ninja import Router

from apis.auth import JWTAuth
from apis.schemas.base import ErrorSchema, MessageSchema
from apis.schemas.requests.settlements import (
    SettlementConfirmRequest,
    SettlementGroupCreateRequest,
    SettlementGroupUpdateRequest,
)
from apis.schemas.responses.settlements import (
    MemberBalanceResponse,
    MemberExpenseResponse,
    SettlementCalculationResponse,
    SettlementDetailResponse,
    SettlementGroupDetailResponse,
    SettlementGroupResponse,
    SettlementHistoryResponse,
    SettlementItemResponse,
    SettlementTransferResponse,
)
from repositories import (
    ExpenseRepository,
    ExpenseShareRepository,
    OrganizationRepository,
    SettlementExpenseRepository,
    SettlementGroupRepository,
    SettlementRepository,
    SettlementTransferRepository,
)

router = Router(tags=["Settlement Groups"])


def _compute_settlement(
    unsettled_expenses: list,
    shares_map: dict,
    display_names: dict[int, str],
) -> dict:
    """미정산 지출 목록으로 정산 데이터를 계산한다.

    Returns:
        total_amount, member_count, per_person, member_paid, member_owed, balances, transfers
        - transfers: [{"from_user_id", "from_username", "to_user_id", "to_username", "amount": str}]
    """
    member_paid: dict[int, dict] = {}
    member_owed: dict[int, float] = {}
    total_amount = 0.0

    for expense in unsettled_expenses:
        payer_id = expense.payer_id
        amount = float(expense.amount)
        total_amount += amount

        if payer_id not in member_paid:
            member_paid[payer_id] = {
                "user_id": payer_id,
                "username": display_names.get(payer_id, expense.payer.username),
                "total_paid": 0.0,
            }
        member_paid[payer_id]["total_paid"] += amount

        shares = shares_map.get(expense.id, [])
        if shares:
            if expense.split_type == "CUSTOM":
                for share in shares:
                    uid = share.user_id
                    share_amount = float(share.amount) if share.amount else 0.0
                    member_owed.setdefault(uid, 0.0)
                    member_owed[uid] += share_amount
                    if uid not in member_paid:
                        member_paid[uid] = {
                            "user_id": uid,
                            "username": display_names.get(uid, share.user.username),
                            "total_paid": 0.0,
                        }
            else:
                per_share = amount / len(shares)
                for share in shares:
                    uid = share.user_id
                    member_owed.setdefault(uid, 0.0)
                    member_owed[uid] += per_share
                    if uid not in member_paid:
                        member_paid[uid] = {
                            "user_id": uid,
                            "username": display_names.get(uid, share.user.username),
                            "total_paid": 0.0,
                        }

    # 하위호환: share가 없는 expense는 모든 payer 대상 균등분할
    expenses_without_shares = [e for e in unsettled_expenses if e.id not in shares_map]
    if expenses_without_shares:
        member_count_for_legacy = len(member_paid)
        if member_count_for_legacy > 0:
            for expense in expenses_without_shares:
                per_person_share = float(expense.amount) / member_count_for_legacy
                for uid in member_paid:
                    member_owed.setdefault(uid, 0.0)
                    member_owed[uid] += per_person_share

    member_count = len(member_paid)
    per_person = total_amount / member_count if member_count > 0 else 0.0

    balances = [
        {
            "user_id": uid,
            "username": data["username"],
            "balance": data["total_paid"] - member_owed.get(uid, 0.0),
        }
        for uid, data in member_paid.items()
    ]

    # 그리디 알고리즘으로 송금 시퀀스 생성
    creditors = sorted([b for b in balances if b["balance"] > 0.01], key=lambda x: -x["balance"])
    debtors = sorted([b for b in balances if b["balance"] < -0.01], key=lambda x: x["balance"])

    transfers = []
    i, j = 0, 0
    while i < len(debtors) and j < len(creditors):
        debtor = debtors[i]
        creditor = creditors[j]
        transfer = min(abs(debtor["balance"]), creditor["balance"])

        if transfer > 0.01:
            transfers.append({
                "from_user_id": debtor["user_id"],
                "from_username": debtor["username"],
                "to_user_id": creditor["user_id"],
                "to_username": creditor["username"],
                "amount": str(round(transfer, 2)),
            })

        debtor["balance"] += transfer
        creditor["balance"] -= transfer

        if abs(debtor["balance"]) < 0.01:
            i += 1
        if creditor["balance"] < 0.01:
            j += 1

    return {
        "total_amount": total_amount,
        "member_count": member_count,
        "per_person": per_person,
        "member_paid": member_paid,
        "member_owed": member_owed,
        "balances": balances,
        "transfers": transfers,
    }


def _build_display_name_map(org_id: int) -> dict[int, str]:
    """조직 멤버의 user_id → display_name 매핑 구성"""
    organization = OrganizationRepository.get_by_id(org_id)
    if not organization:
        return {}
    members = OrganizationRepository.get_members(organization)
    name_map = {}
    for m in members:
        if m.profile and not m.profile.is_deleted and m.profile.nickname:
            name_map[m.user_id] = m.profile.nickname
        elif m.user.first_name:
            name_map[m.user_id] = m.user.first_name
        else:
            name_map[m.user_id] = m.user.username
    return name_map


@router.get(
    "/{org_id}/settlement-groups",
    auth=JWTAuth(),
    response=list[SettlementGroupResponse],
)
def list_settlement_groups(request, org_id: int):
    """조직의 정산 그룹 목록 조회"""
    return SettlementGroupRepository.get_by_organization(org_id)


@router.post(
    "/{org_id}/settlement-groups",
    auth=JWTAuth(),
    response={201: SettlementGroupDetailResponse, 400: ErrorSchema, 404: ErrorSchema},
)
def create_settlement_group(request, org_id: int, payload: SettlementGroupCreateRequest):
    """정산 그룹 생성"""
    organization = OrganizationRepository.get_by_id(org_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    name = (payload.name or "").strip()
    if not name:
        return 400, {"detail": "그룹 이름은 필수입니다."}

    group = SettlementGroupRepository.create(
        organization=organization,
        name=name,
        description=payload.description or "",
    )
    return 201, group


@router.get(
    "/{org_id}/settlement-groups/{group_id}",
    auth=JWTAuth(),
    response={200: SettlementGroupDetailResponse, 404: ErrorSchema},
)
def get_settlement_group(request, org_id: int, group_id: int):
    """정산 그룹 상세 조회"""
    group = SettlementGroupRepository.get_by_id(group_id)
    if not group or group.organization_id != org_id:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}
    return 200, group


@router.patch(
    "/{org_id}/settlement-groups/{group_id}",
    auth=JWTAuth(),
    response={200: SettlementGroupDetailResponse, 404: ErrorSchema},
)
def update_settlement_group(
    request, org_id: int, group_id: int, payload: SettlementGroupUpdateRequest
):
    """정산 그룹 수정"""
    group = SettlementGroupRepository.get_by_id(group_id)
    if not group or group.organization_id != org_id:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    group = SettlementGroupRepository.update(
        group=group,
        name=payload.name,
        description=payload.description,
    )
    return 200, group


@router.delete(
    "/{org_id}/settlement-groups/{group_id}",
    auth=JWTAuth(),
    response={200: MessageSchema, 404: ErrorSchema},
)
def delete_settlement_group(request, org_id: int, group_id: int):
    """정산 그룹 삭제"""
    group = SettlementGroupRepository.get_by_id(group_id)
    if not group or group.organization_id != org_id:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    SettlementGroupRepository.soft_delete(group)
    return 200, {"message": "정산 그룹이 삭제되었습니다."}


@router.get(
    "/{org_id}/settlement-groups/{group_id}/calculate",
    auth=JWTAuth(),
    response={200: SettlementCalculationResponse, 404: ErrorSchema},
)
def calculate_settlement(request, org_id: int, group_id: int):
    """정산 계산 (ExpenseShare 기반)"""
    group = SettlementGroupRepository.get_by_id(group_id)
    if not group or group.organization_id != org_id:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    expenses = ExpenseRepository.get_list(group_id=group_id)
    unsettled_expenses = [e for e in expenses if not e.is_settled]

    if not unsettled_expenses:
        return 200, SettlementCalculationResponse(
            group_id=group.id,
            group_name=group.name,
            total_amount="0",
            member_count=0,
            per_person="0",
            member_expenses=[],
            member_balances=[],
            settlements=[],
        )

    display_names = _build_display_name_map(org_id)
    expense_ids = [e.id for e in unsettled_expenses]
    shares_map = ExpenseShareRepository.get_by_expense_ids(expense_ids)

    calc = _compute_settlement(unsettled_expenses, shares_map, display_names)
    member_paid = calc["member_paid"]
    member_owed = calc["member_owed"]

    member_balances_list = [
        MemberBalanceResponse(
            user_id=uid,
            username=data["username"],
            total_paid=str(round(data["total_paid"], 2)),
            total_owed=str(round(member_owed.get(uid, 0.0), 2)),
            balance=str(round(data["total_paid"] - member_owed.get(uid, 0.0), 2)),
        )
        for uid, data in member_paid.items()
    ]
    member_expenses = [
        MemberExpenseResponse(
            user_id=data["user_id"],
            username=data["username"],
            total_paid=str(round(data["total_paid"], 2)),
        )
        for data in member_paid.values()
    ]
    settlement_items = [SettlementItemResponse(**t) for t in calc["transfers"]]

    return 200, SettlementCalculationResponse(
        group_id=group.id,
        group_name=group.name,
        total_amount=str(round(calc["total_amount"], 2)),
        member_count=calc["member_count"],
        per_person=str(round(calc["per_person"], 2)),
        member_expenses=member_expenses,
        member_balances=member_balances_list,
        settlements=settlement_items,
    )


@router.post(
    "/{org_id}/settlement-groups/{group_id}/confirm",
    auth=JWTAuth(),
    response={201: SettlementDetailResponse, 400: ErrorSchema, 404: ErrorSchema},
)
def confirm_settlement(request, org_id: int, group_id: int, payload: SettlementConfirmRequest):
    """정산 확정"""
    group = SettlementGroupRepository.get_by_id(group_id)
    if not group or group.organization_id != org_id:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    user = request.auth
    expenses = ExpenseRepository.get_list(group_id=group_id)
    unsettled_expenses = [e for e in expenses if not e.is_settled]

    if not unsettled_expenses:
        return 400, {"detail": "정산할 미정산 지출이 없습니다."}

    display_names = _build_display_name_map(org_id)
    expense_ids = [e.id for e in unsettled_expenses]
    shares_map = ExpenseShareRepository.get_by_expense_ids(expense_ids)

    calc = _compute_settlement(unsettled_expenses, shares_map, display_names)
    transfers_data = [
        {
            "from_user_id": t["from_user_id"],
            "to_user_id": t["to_user_id"],
            "amount": Decimal(t["amount"]),
        }
        for t in calc["transfers"]
    ]

    # 트랜잭션으로 확정
    with transaction.atomic():
        settlement = SettlementRepository.create(
            group=group,
            confirmed_by=user,
            total_amount=Decimal(str(round(calc["total_amount"], 2))),
            member_count=calc["member_count"],
            memo=payload.memo,
        )
        SettlementTransferRepository.bulk_create(settlement, transfers_data)
        SettlementExpenseRepository.bulk_create(settlement, expense_ids)
        ExpenseRepository.mark_settled_bulk(expense_ids)

    # 응답용 데이터 조회
    settlement = SettlementRepository.get_by_id(settlement.id)
    transfers = SettlementTransferRepository.get_by_settlement(settlement.id)

    return 201, SettlementDetailResponse(
        id=settlement.id,
        group_id=settlement.group_id,
        group_name=settlement.group.name,
        confirmed_by_username=display_names.get(settlement.confirmed_by_id, settlement.confirmed_by.username),
        total_amount=str(settlement.total_amount),
        member_count=settlement.member_count,
        confirmed_at=settlement.confirmed_at.isoformat(),
        memo=settlement.memo or "",
        transfers=[
            SettlementTransferResponse(
                id=t.id,
                from_user_id=t.from_user_id,
                from_username=display_names.get(t.from_user_id, t.from_user.username),
                to_user_id=t.to_user_id,
                to_username=display_names.get(t.to_user_id, t.to_user.username),
                amount=str(t.amount),
                is_paid=t.is_paid,
                paid_at=t.paid_at.isoformat() if t.paid_at else None,
            )
            for t in transfers
        ],
    )


@router.get(
    "/{org_id}/settlement-groups/{group_id}/history",
    auth=JWTAuth(),
    response={200: list[SettlementHistoryResponse], 404: ErrorSchema},
)
def list_settlement_history(request, org_id: int, group_id: int):
    """정산 이력 목록"""
    group = SettlementGroupRepository.get_by_id(group_id)
    if not group or group.organization_id != org_id:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    return 200, SettlementRepository.get_by_group(group_id)


@router.get(
    "/{org_id}/settlement-groups/{group_id}/history/{settlement_id}",
    auth=JWTAuth(),
    response={200: SettlementDetailResponse, 404: ErrorSchema},
)
def get_settlement_history_detail(request, org_id: int, group_id: int, settlement_id: int):
    """정산 이력 상세"""
    group = SettlementGroupRepository.get_by_id(group_id)
    if not group or group.organization_id != org_id:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    settlement = SettlementRepository.get_by_id(settlement_id)
    if not settlement or settlement.group_id != group_id:
        return 404, {"detail": "정산 이력을 찾을 수 없습니다."}

    transfers = SettlementTransferRepository.get_by_settlement(settlement_id)

    return 200, SettlementDetailResponse(
        id=settlement.id,
        group_id=settlement.group_id,
        group_name=settlement.group.name,
        confirmed_by_username=settlement.confirmed_by.username,
        total_amount=str(settlement.total_amount),
        member_count=settlement.member_count,
        confirmed_at=settlement.confirmed_at.isoformat(),
        memo=settlement.memo or "",
        transfers=[
            SettlementTransferResponse(
                id=t.id,
                from_user_id=t.from_user_id,
                from_username=t.from_user.username,
                to_user_id=t.to_user_id,
                to_username=t.to_user.username,
                amount=str(t.amount),
                is_paid=t.is_paid,
                paid_at=t.paid_at.isoformat() if t.paid_at else None,
            )
            for t in transfers
        ],
    )


@router.patch(
    "/{org_id}/settlement-groups/{group_id}/transfers/{transfer_id}/pay",
    auth=JWTAuth(),
    response={200: SettlementTransferResponse, 404: ErrorSchema},
)
def mark_transfer_paid(request, org_id: int, group_id: int, transfer_id: int):
    """송금 완료 표시"""
    group = SettlementGroupRepository.get_by_id(group_id)
    if not group or group.organization_id != org_id:
        return 404, {"detail": "정산 그룹을 찾을 수 없습니다."}

    transfer = SettlementTransferRepository.get_by_id(transfer_id)
    if not transfer or transfer.settlement.group_id != group_id:
        return 404, {"detail": "송금 내역을 찾을 수 없습니다."}

    transfer = SettlementTransferRepository.mark_paid(transfer)

    return 200, SettlementTransferResponse(
        id=transfer.id,
        from_user_id=transfer.from_user_id,
        from_username=transfer.from_user.username,
        to_user_id=transfer.to_user_id,
        to_username=transfer.to_user.username,
        amount=str(transfer.amount),
        is_paid=transfer.is_paid,
        paid_at=transfer.paid_at.isoformat() if transfer.paid_at else None,
    )
