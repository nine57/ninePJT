from typing import Optional

from ninja import Schema


class OrganizationCreateRequest(Schema):
    name: str
    description: str = ""


class OrganizationUpdateRequest(Schema):
    name: Optional[str] = None
    description: Optional[str] = None


class InvitationCreateRequest(Schema):
    expires_hours: int = 24
    max_uses: int = 0


class JoinByCodeRequest(Schema):
    code: str
