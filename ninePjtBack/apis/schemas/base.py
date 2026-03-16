from ninja import Schema


class ErrorSchema(Schema):
    """에러 응답 스키마"""

    detail: str


class MessageSchema(Schema):
    """메시지 응답 스키마"""

    detail: str
