from typing import Any, Optional

from ninja import Schema


class ExpenseShareResponse(Schema):
    user_id: int
    username: str
    amount: Optional[str]

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_user_id(obj) -> int:
        return obj.user_id

    @staticmethod
    def resolve_username(obj) -> str:
        return obj.user.username

    @staticmethod
    def resolve_amount(obj) -> Optional[str]:
        return str(obj.amount) if obj.amount is not None else None


class ExpenseResponse(Schema):
    id: int
    group: int
    group_name: Optional[str]
    title: str
    amount: str
    payer: int
    payer_username: str
    paid_at: Optional[str]
    note: str
    split_type: str
    is_settled: bool
    created_at: str
    updated_at: str
    participants: list[ExpenseShareResponse] = []

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_participants(obj) -> list:
        return list(obj.shares.all())

    @staticmethod
    def resolve_group(obj) -> int:
        return obj.group_id

    @staticmethod
    def resolve_group_name(obj) -> Optional[str]:
        return obj.group.name if obj.group else None

    @staticmethod
    def resolve_title(obj) -> str:
        return obj.merchant_name or ""

    @staticmethod
    def resolve_amount(obj) -> str:
        return str(obj.amount)

    @staticmethod
    def resolve_payer(obj) -> int:
        return obj.payer_id

    @staticmethod
    def resolve_payer_username(obj) -> str:
        return obj.payer.username

    @staticmethod
    def resolve_paid_at(obj) -> Optional[str]:
        return obj.paid_at.isoformat() if obj.paid_at else None

    @staticmethod
    def resolve_note(obj) -> str:
        return obj.memo or ""

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj) -> str:
        return obj.updated_at.isoformat()


class ExpenseDetailResponse(Schema):
    id: int
    group: int
    group_name: Optional[str]
    merchant_name: str
    amount: str
    currency: str
    payer: int
    payer_username: str
    paid_at: Optional[str]
    payment_method: str
    memo: str
    is_settled: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_group(obj) -> int:
        return obj.group_id

    @staticmethod
    def resolve_group_name(obj) -> Optional[str]:
        return obj.group.name if obj.group else None

    @staticmethod
    def resolve_amount(obj) -> str:
        return str(obj.amount)

    @staticmethod
    def resolve_payer(obj) -> int:
        return obj.payer_id

    @staticmethod
    def resolve_payer_username(obj) -> str:
        return obj.payer.username

    @staticmethod
    def resolve_paid_at(obj) -> Optional[str]:
        return obj.paid_at.isoformat() if obj.paid_at else None

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj) -> str:
        return obj.updated_at.isoformat()


class AttachmentResponse(Schema):
    id: int
    file_path: str
    caption: str
    created_at: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_caption(obj) -> str:
        return obj.caption or ""

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()


class ExpenseImageUploadResponse(Schema):
    expense: ExpenseDetailResponse
    attachment: AttachmentResponse
    analysis: dict[str, Any]


class SettlementGroupResponse(Schema):
    """정산 그룹 응답"""

    id: int
    name: str
    description: str
    expense_count: int
    total_amount: str
    created_at: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_description(obj) -> str:
        return obj.description or ""

    @staticmethod
    def resolve_expense_count(obj) -> int:
        return getattr(obj, "expense_count", 0) or 0

    @staticmethod
    def resolve_total_amount(obj) -> str:
        amount = getattr(obj, "total_amount", None)
        return str(amount) if amount else "0"

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()


class SettlementGroupDetailResponse(Schema):
    """정산 그룹 상세 응답"""

    id: int
    name: str
    description: str
    organization_id: Optional[int]
    is_active: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_description(obj) -> str:
        return obj.description or ""

    @staticmethod
    def resolve_organization_id(obj) -> Optional[int]:
        return obj.organization_id

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj) -> str:
        return obj.updated_at.isoformat()


class MemberExpenseResponse(Schema):
    """멤버별 지출 합계"""

    user_id: int
    username: str
    total_paid: str


class MemberBalanceResponse(Schema):
    """대상자별 잔액 집계"""

    user_id: int
    username: str
    total_paid: str
    total_owed: str
    balance: str


class SettlementItemResponse(Schema):
    """정산 송금 내역"""

    from_user_id: int
    from_username: str
    to_user_id: int
    to_username: str
    amount: str


class SettlementCalculationResponse(Schema):
    """정산 계산 결과"""

    group_id: int
    group_name: str
    total_amount: str
    member_count: int
    per_person: str
    member_expenses: list[MemberExpenseResponse]
    member_balances: list[MemberBalanceResponse]
    settlements: list[SettlementItemResponse]


class SettlementTransferResponse(Schema):
    """정산 송금 항목"""

    id: int
    from_user_id: int
    from_username: str
    to_user_id: int
    to_username: str
    amount: str
    is_paid: bool
    paid_at: Optional[str]

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_from_user_id(obj) -> int:
        return obj.from_user_id

    @staticmethod
    def resolve_from_username(obj) -> str:
        return obj.from_user.username

    @staticmethod
    def resolve_to_user_id(obj) -> int:
        return obj.to_user_id

    @staticmethod
    def resolve_to_username(obj) -> str:
        return obj.to_user.username

    @staticmethod
    def resolve_amount(obj) -> str:
        return str(obj.amount)

    @staticmethod
    def resolve_paid_at(obj) -> Optional[str]:
        return obj.paid_at.isoformat() if obj.paid_at else None


class SettlementDetailResponse(Schema):
    """정산 확정 상세"""

    id: int
    group_id: int
    group_name: str
    confirmed_by_username: str
    total_amount: str
    member_count: int
    confirmed_at: str
    memo: str
    transfers: list[SettlementTransferResponse]

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_group_id(obj) -> int:
        return obj.group_id

    @staticmethod
    def resolve_group_name(obj) -> str:
        return obj.group.name if obj.group else ""

    @staticmethod
    def resolve_confirmed_by_username(obj) -> str:
        return obj.confirmed_by.username

    @staticmethod
    def resolve_total_amount(obj) -> str:
        return str(obj.total_amount)

    @staticmethod
    def resolve_confirmed_at(obj) -> str:
        return obj.confirmed_at.isoformat()

    @staticmethod
    def resolve_memo(obj) -> str:
        return obj.memo or ""


class SettlementHistoryResponse(Schema):
    """정산 이력 목록 항목"""

    id: int
    total_amount: str
    member_count: int
    confirmed_at: str
    confirmed_by_username: str
    transfer_count: int
    paid_count: int

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_total_amount(obj) -> str:
        return str(obj.total_amount)

    @staticmethod
    def resolve_confirmed_at(obj) -> str:
        return obj.confirmed_at.isoformat()

    @staticmethod
    def resolve_confirmed_by_username(obj) -> str:
        return obj.confirmed_by.username

    @staticmethod
    def resolve_transfer_count(obj) -> int:
        return getattr(obj, "transfer_count", 0) or 0

    @staticmethod
    def resolve_paid_count(obj) -> int:
        return getattr(obj, "paid_count", 0) or 0
