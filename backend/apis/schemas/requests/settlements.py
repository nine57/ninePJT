from typing import Optional

from ninja import Schema


class ExpenseShareInput(Schema):
    """지출 분담자 입력"""

    user_id: int
    amount: Optional[str] = None


class ExpenseCreateRequest(Schema):
    """지출 생성 요청"""

    group: int
    title: str
    amount: str
    note: Optional[str] = None
    paid_at: Optional[str] = None
    split_type: str = "EQUAL"
    participants: Optional[list[ExpenseShareInput]] = None


class SettlementConfirmRequest(Schema):
    """정산 확정 요청"""

    memo: str = ""


class ExpenseUpdateRequest(Schema):
    """지출 수정 요청"""

    title: Optional[str] = None
    amount: Optional[str] = None
    note: Optional[str] = None
    paid_at: Optional[str] = None
    merchant_name: Optional[str] = None
    memo: Optional[str] = None
    split_type: Optional[str] = None
    participants: Optional[list[ExpenseShareInput]] = None


class SettlementGroupCreateRequest(Schema):
    """정산 그룹 생성 요청"""

    name: str
    description: str = ""


class SettlementGroupUpdateRequest(Schema):
    """정산 그룹 수정 요청"""

    name: Optional[str] = None
    description: Optional[str] = None
