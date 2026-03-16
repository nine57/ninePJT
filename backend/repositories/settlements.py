from datetime import datetime
from decimal import Decimal
from typing import Optional

from django.db import models
from django.db.models import Count, Prefetch, Sum
from django.utils import timezone

from apps.organizations.models import Organization
from apps.settlements.models import (
    Expense,
    ExpenseAttachment,
    ExpenseItem,
    ExpenseShare,
    Settlement,
    SettlementExpense,
    SettlementGroup,
    SettlementTransfer,
)


class SettlementGroupRepository:
    @staticmethod
    def get_by_id(pk: int) -> Optional[SettlementGroup]:
        try:
            return SettlementGroup.objects.get(pk=pk, is_deleted=False)
        except SettlementGroup.DoesNotExist:
            return None

    @staticmethod
    def get_by_organization(organization_id: int) -> list[SettlementGroup]:
        return list(
            SettlementGroup.objects.filter(
                organization_id=organization_id, is_deleted=False
            )
            .annotate(
                expense_count=Count("expenses", filter=models.Q(expenses__is_deleted=False)),
                total_amount=Sum("expenses__amount", filter=models.Q(expenses__is_deleted=False)),
            )
            .order_by("-created_at")
        )

    @staticmethod
    def create(
        organization: Organization,
        name: str,
        description: str = "",
    ) -> SettlementGroup:
        return SettlementGroup.objects.create(
            organization=organization,
            name=name,
            description=description,
        )

    @staticmethod
    def update(
        group: SettlementGroup,
        name: Optional[str] = None,
        description: Optional[str] = None,
    ) -> SettlementGroup:
        if name is not None:
            group.name = name
        if description is not None:
            group.description = description
        group.save()
        return group

    @staticmethod
    def soft_delete(group: SettlementGroup) -> SettlementGroup:
        group.is_deleted = True
        group.deleted_at = timezone.now()
        group.save()
        return group


class ExpenseRepository:
    @staticmethod
    def get_list(
        user=None,
        organization_id: Optional[int] = None,
        group_id: Optional[int] = None,
        payer_id: Optional[int] = None,
    ) -> list[Expense]:
        qs = Expense.objects.select_related("group", "payer").prefetch_related(
            Prefetch("shares", queryset=ExpenseShare.objects.filter(is_deleted=False).select_related("user"))
        ).filter(is_deleted=False)

        if organization_id:
            qs = qs.filter(group__organization_id=organization_id)
        if group_id:
            qs = qs.filter(group_id=group_id)
        if payer_id:
            qs = qs.filter(payer_id=payer_id)
        elif user:
            qs = qs.filter(payer=user)

        return list(qs.order_by("-created_at"))

    @staticmethod
    def get_by_id(pk: int) -> Optional[Expense]:
        try:
            return Expense.objects.select_related("group", "payer").prefetch_related(
                Prefetch("shares", queryset=ExpenseShare.objects.filter(is_deleted=False).select_related("user"))
            ).get(pk=pk, is_deleted=False)
        except Expense.DoesNotExist:
            return None

    @staticmethod
    def create(
        group: SettlementGroup,
        payer,
        amount: Decimal,
        paid_at: Optional[datetime] = None,
        merchant_name: str = "",
        currency: str = "",
        payment_method: str = "",
        memo: str = "",
    ) -> Expense:
        return Expense.objects.create(
            group=group,
            payer=payer,
            amount=amount,
            paid_at=paid_at,
            merchant_name=merchant_name,
            currency=currency,
            payment_method=payment_method,
            memo=memo,
        )

    @staticmethod
    def update(
        expense: Expense,
        amount: Optional[Decimal] = None,
        title: Optional[str] = None,
        note: Optional[str] = None,
        paid_at: Optional[datetime] = None,
        merchant_name: Optional[str] = None,
        memo: Optional[str] = None,
        split_type: Optional[str] = None,
    ) -> Expense:
        if amount is not None:
            expense.amount = amount
        if title is not None:
            expense.title = title
        if note is not None:
            expense.note = note
        if paid_at is not None:
            expense.paid_at = paid_at
        if merchant_name is not None:
            expense.merchant_name = merchant_name
        if memo is not None:
            expense.memo = memo
        if split_type is not None:
            expense.split_type = split_type
        expense.save()
        return expense

    @staticmethod
    def soft_delete(expense: Expense) -> Expense:
        expense.is_deleted = True
        expense.deleted_at = timezone.now()
        expense.save()
        return expense

    @staticmethod
    def mark_settled(expense: Expense, settled: bool = True) -> Expense:
        expense.is_settled = settled
        expense.save()
        return expense

    @staticmethod
    def mark_settled_bulk(expense_ids: list[int]) -> int:
        return Expense.objects.filter(
            pk__in=expense_ids, is_deleted=False
        ).update(is_settled=True)


class ExpenseItemRepository:
    @staticmethod
    def create(
        expense: Expense,
        name: str = "",
        quantity: Optional[int] = None,
        unit_price: Optional[Decimal] = None,
        total_price: Optional[Decimal] = None,
    ) -> ExpenseItem:
        return ExpenseItem.objects.create(
            expense=expense,
            name=name,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
        )


class ExpenseAttachmentRepository:
    @staticmethod
    def create(
        expense: Expense,
        file_path: str,
        caption: str = "",
    ) -> ExpenseAttachment:
        return ExpenseAttachment.objects.create(
            expense=expense,
            file_path=file_path,
            caption=caption,
        )


class ExpenseShareRepository:
    @staticmethod
    def delete_by_expense(expense: Expense) -> None:
        """특정 지출의 모든 분담 기록을 하드 삭제 (unique_together 제약으로 소프트 삭제 불가)"""
        ExpenseShare.objects.filter(expense=expense).delete()

    @staticmethod
    def bulk_create(
        expense: Expense, shares: list[dict]
    ) -> list[ExpenseShare]:
        objs = [
            ExpenseShare(
                expense=expense,
                user_id=s["user_id"],
                amount=s.get("amount"),
            )
            for s in shares
        ]
        return ExpenseShare.objects.bulk_create(objs)

    @staticmethod
    def get_by_expense(expense_id: int) -> list[ExpenseShare]:
        return list(
            ExpenseShare.objects.select_related("user")
            .filter(expense_id=expense_id, is_deleted=False)
        )

    @staticmethod
    def get_by_expense_ids(expense_ids: list[int]) -> dict[int, list[ExpenseShare]]:
        shares = list(
            ExpenseShare.objects.select_related("user")
            .filter(expense_id__in=expense_ids, is_deleted=False)
        )
        result: dict[int, list[ExpenseShare]] = {}
        for share in shares:
            result.setdefault(share.expense_id, []).append(share)
        return result


class SettlementRepository:
    @staticmethod
    def create(
        group: SettlementGroup,
        confirmed_by,
        total_amount: Decimal,
        member_count: int,
        memo: str = "",
    ) -> Settlement:
        return Settlement.objects.create(
            group=group,
            confirmed_by=confirmed_by,
            total_amount=total_amount,
            member_count=member_count,
            memo=memo,
        )

    @staticmethod
    def get_by_id(pk: int) -> Optional[Settlement]:
        try:
            return Settlement.objects.select_related(
                "group", "confirmed_by"
            ).get(pk=pk, is_deleted=False)
        except Settlement.DoesNotExist:
            return None

    @staticmethod
    def get_by_group(group_id: int) -> list[Settlement]:
        return list(
            Settlement.objects.select_related("confirmed_by")
            .filter(group_id=group_id, is_deleted=False)
            .annotate(
                transfer_count=Count("transfers", filter=models.Q(transfers__is_deleted=False)),
                paid_count=Count(
                    "transfers",
                    filter=models.Q(transfers__is_deleted=False, transfers__is_paid=True),
                ),
            )
            .order_by("-confirmed_at")
        )


class SettlementTransferRepository:
    @staticmethod
    def bulk_create(
        settlement: Settlement, transfers: list[dict]
    ) -> list[SettlementTransfer]:
        objs = [
            SettlementTransfer(
                settlement=settlement,
                from_user_id=t["from_user_id"],
                to_user_id=t["to_user_id"],
                amount=t["amount"],
            )
            for t in transfers
        ]
        return SettlementTransfer.objects.bulk_create(objs)

    @staticmethod
    def get_by_settlement(settlement_id: int) -> list[SettlementTransfer]:
        return list(
            SettlementTransfer.objects.select_related("from_user", "to_user")
            .filter(settlement_id=settlement_id, is_deleted=False)
        )

    @staticmethod
    def get_by_id(pk: int) -> Optional[SettlementTransfer]:
        try:
            return SettlementTransfer.objects.select_related(
                "from_user", "to_user", "settlement"
            ).get(pk=pk, is_deleted=False)
        except SettlementTransfer.DoesNotExist:
            return None

    @staticmethod
    def mark_paid(transfer: SettlementTransfer) -> SettlementTransfer:
        transfer.is_paid = True
        transfer.paid_at = timezone.now()
        transfer.save()
        return transfer


class SettlementExpenseRepository:
    @staticmethod
    def bulk_create(
        settlement: Settlement, expense_ids: list[int]
    ) -> list[SettlementExpense]:
        objs = [
            SettlementExpense(settlement=settlement, expense_id=eid)
            for eid in expense_ids
        ]
        return SettlementExpense.objects.bulk_create(objs)
