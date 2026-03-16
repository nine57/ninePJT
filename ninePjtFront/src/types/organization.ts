/**
 * 조직(모임) 관련 타입
 */
export interface Organization {
  id: number;
  name: string;
  description?: string | null;
}

export interface OrganizationDetail extends Organization {
  memberCount: number;
  createdAt: string;
}

export interface OrganizationMember {
  id: number;
  userId: number;
  username: string;
  joinedAt: string;
}

export interface Invitation {
  id: number;
  code: string;
  expiresAt: string;
  maxUses: number;
  useCount: number;
  isActive: boolean;
}

// Request 타입
export interface OrganizationCreateRequest {
  name: string;
  description?: string;
}

export interface OrganizationUpdateRequest {
  name?: string;
  description?: string;
}

export interface InvitationCreateRequest {
  expires_hours?: number;
  max_uses?: number;
}

export interface JoinByCodeRequest {
  code: string;
}
