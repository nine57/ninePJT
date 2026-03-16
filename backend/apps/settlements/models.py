from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.base import AbstractBaseModel
from apps.organizations.models import Organization

User = get_user_model()


class SettlementGroup(AbstractBaseModel):
    name = models.CharField(max_length=120, verbose_name=_("이름"))
    description = models.TextField(blank=True, verbose_name=_("설명"))
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="settlement_groups",
        verbose_name=_("조직"),
    )
    is_active = models.BooleanField(default=True, verbose_name=_("활성화 여부"))

    class Meta:
        verbose_name = _("정산 그룹")
        verbose_name_plural = _("정산 그룹")


class Expense(AbstractBaseModel):
    group = models.ForeignKey(
        SettlementGroup,
        on_delete=models.CASCADE,
        related_name="expenses",
        verbose_name=_("그룹"),
    )
    merchant_name = models.CharField(
        max_length=200,
        verbose_name=_("결제처/가맹점명"),
        blank=True,
    )
    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        verbose_name=_("금액"),
    )
    currency = models.CharField(
        max_length=8,
        verbose_name=_("통화 코드"),
        blank=True,
        help_text=_("예: KRW, USD. 비어 있으면 기본 통화를 의미."),
    )
    payer = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="paid_expenses",
        verbose_name=_("지출자"),
    )
    paid_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("지출 시각"),
    )
    payment_method = models.CharField(
        max_length=32,
        verbose_name=_("결제 수단"),
        blank=True,
        help_text=_("예: CREDIT_CARD, CASH, TRANSFER 등"),
    )
    memo = models.TextField(
        blank=True,
        verbose_name=_("메모"),
        help_text=_("추가로 유의미한 정보(카드사명, 승인번호 등)"),
    )
    split_type = models.CharField(
        max_length=16,
        choices=[("EQUAL", _("균등분할")), ("CUSTOM", _("직접지정"))],
        default="EQUAL",
        verbose_name=_("분할 방식"),
    )
    is_settled = models.BooleanField(default=False, verbose_name=_("정산 완료 여부"))

    class Meta:
        verbose_name = _("지출 내역")
        verbose_name_plural = _("지출 내역")


class ExpenseItem(AbstractBaseModel):
    expense = models.ForeignKey(
        Expense,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name=_("지출 내역"),
    )
    name = models.CharField(
        max_length=200,
        verbose_name=_("품목명"),
        blank=True,
    )
    quantity = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_("수량"),
    )
    unit_price = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_("단가"),
    )
    total_price = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_("합계 금액"),
    )

    class Meta:
        verbose_name = _("지출 품목")
        verbose_name_plural = _("지출 품목")


class ExpenseAttachment(AbstractBaseModel):
    expense = models.ForeignKey(
        Expense,
        on_delete=models.CASCADE,
        related_name="attachments",
        verbose_name=_("지출 내역"),
    )
    file_path = models.CharField(max_length=255, verbose_name=_("파일 경로"))
    caption = models.CharField(
        max_length=200,
        blank=True,
        verbose_name=_("설명"),
    )

    class Meta:
        verbose_name = _("지출 내역 첨부 자료")
        verbose_name_plural = _("지출 내역 첨부 자료")


class Transaction(AbstractBaseModel):
    """은행 거래내역 (입금/출금)"""

    TRANSACTION_TYPE_CHOICES = [
        ("DEPOSIT", _("입금")),
        ("WITHDRAWAL", _("출금")),
    ]

    group = models.ForeignKey(
        SettlementGroup,
        on_delete=models.CASCADE,
        related_name="transactions",
        verbose_name=_("그룹"),
    )
    counterparty_name = models.CharField(
        max_length=200,
        verbose_name=_("거래처/입금자"),
        blank=True,
    )
    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        verbose_name=_("거래 금액"),
    )
    currency = models.CharField(
        max_length=8,
        verbose_name=_("통화 코드"),
        blank=True,
        help_text=_("예: KRW, USD. 비어 있으면 기본 통화를 의미."),
    )
    transacted_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("거래 일시"),
    )
    transaction_type = models.CharField(
        max_length=16,
        choices=TRANSACTION_TYPE_CHOICES,
        verbose_name=_("거래 유형"),
        blank=True,
        help_text=_("DEPOSIT: 입금, WITHDRAWAL: 출금"),
    )
    balance = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_("거래 후 잔액"),
    )
    memo = models.TextField(
        blank=True,
        verbose_name=_("적요/메모"),
        help_text=_("거래 적요, 메모 등 추가 정보"),
    )

    class Meta:
        verbose_name = _("거래 내역")
        verbose_name_plural = _("거래 내역")


class ExpenseShare(AbstractBaseModel):
    """지출별 분담자"""

    expense = models.ForeignKey(
        Expense,
        on_delete=models.CASCADE,
        related_name="shares",
        verbose_name=_("지출 내역"),
    )
    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="expense_shares",
        verbose_name=_("분담자"),
    )
    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_("분담 금액"),
        help_text=_("EQUAL이면 null(자동 계산), CUSTOM이면 직접 지정"),
    )

    class Meta:
        verbose_name = _("지출 분담")
        verbose_name_plural = _("지출 분담")
        unique_together = [("expense", "user")]


class Settlement(AbstractBaseModel):
    """정산 확정 기록"""

    group = models.ForeignKey(
        SettlementGroup,
        on_delete=models.CASCADE,
        related_name="settlements",
        verbose_name=_("정산 그룹"),
    )
    confirmed_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="confirmed_settlements",
        verbose_name=_("확정자"),
    )
    total_amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        verbose_name=_("총 금액"),
    )
    member_count = models.PositiveIntegerField(verbose_name=_("참여 인원"))
    confirmed_at = models.DateTimeField(auto_now_add=True, verbose_name=_("확정 일시"))
    memo = models.TextField(blank=True, verbose_name=_("메모"))

    class Meta:
        verbose_name = _("정산 확정")
        verbose_name_plural = _("정산 확정")


class SettlementTransfer(AbstractBaseModel):
    """확정된 송금 항목"""

    settlement = models.ForeignKey(
        Settlement,
        on_delete=models.CASCADE,
        related_name="transfers",
        verbose_name=_("정산"),
    )
    from_user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="settlement_transfers_from",
        verbose_name=_("보내는 사람"),
    )
    to_user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="settlement_transfers_to",
        verbose_name=_("받는 사람"),
    )
    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        verbose_name=_("송금 금액"),
    )
    is_paid = models.BooleanField(default=False, verbose_name=_("송금 완료 여부"))
    paid_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("송금 완료 일시"),
    )

    class Meta:
        verbose_name = _("정산 송금")
        verbose_name_plural = _("정산 송금")


class SettlementExpense(AbstractBaseModel):
    """정산 확정에 포함된 지출 추적"""

    settlement = models.ForeignKey(
        Settlement,
        on_delete=models.CASCADE,
        related_name="settlement_expenses",
        verbose_name=_("정산"),
    )
    expense = models.ForeignKey(
        Expense,
        on_delete=models.CASCADE,
        related_name="settlement_records",
        verbose_name=_("지출 내역"),
    )

    class Meta:
        verbose_name = _("정산 포함 지출")
        verbose_name_plural = _("정산 포함 지출")
        unique_together = [("settlement", "expense")]


class TransactionAttachment(AbstractBaseModel):
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name="attachments",
        verbose_name=_("거래 내역"),
    )
    file_path = models.CharField(max_length=255, verbose_name=_("파일 경로"))
    caption = models.CharField(
        max_length=200,
        blank=True,
        verbose_name=_("설명"),
    )

    class Meta:
        verbose_name = _("거래 내역 첨부 자료")
        verbose_name_plural = _("거래 내역 첨부 자료")
