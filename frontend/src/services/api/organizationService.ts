import { API_ENDPOINTS } from '../../constants/api';
import {
  Invitation,
  InvitationCreateRequest,
  JoinByCodeRequest,
  Organization,
  OrganizationCreateRequest,
  OrganizationDetail,
  OrganizationMember,
  OrganizationUpdateRequest,
} from '../../types/organization';
import { httpClient } from './httpClient';

// API 응답 타입 (snake_case)
interface OrganizationDetailApiResponse {
  id: number;
  name: string;
  description: string;
  member_count: number;
  created_at: string;
}

interface OrganizationMemberApiResponse {
  id: number;
  user_id: number;
  username: string;
  joined_at: string;
}

interface InvitationApiResponse {
  id: number;
  code: string;
  expires_at: string;
  max_uses: number;
  use_count: number;
  is_active: boolean;
}

// 변환 함수
const mapOrganizationDetail = (data: OrganizationDetailApiResponse): OrganizationDetail => ({
  id: data.id,
  name: data.name,
  description: data.description,
  memberCount: data.member_count,
  createdAt: data.created_at,
});

const mapMember = (data: OrganizationMemberApiResponse): OrganizationMember => ({
  id: data.id,
  userId: data.user_id,
  username: data.username,
  joinedAt: data.joined_at,
});

const mapInvitation = (data: InvitationApiResponse): Invitation => ({
  id: data.id,
  code: data.code,
  expiresAt: data.expires_at,
  maxUses: data.max_uses,
  useCount: data.use_count,
  isActive: data.is_active,
});

export const organizationService = {
  // 조직 CRUD
  list(): Promise<Organization[]> {
    return httpClient.get<Organization[]>(API_ENDPOINTS.ORGANIZATIONS);
  },

  async create(data: OrganizationCreateRequest): Promise<OrganizationDetail> {
    const response = await httpClient.post<OrganizationDetailApiResponse>(
      API_ENDPOINTS.ORGANIZATIONS,
      { body: JSON.stringify(data) }
    );
    return mapOrganizationDetail(response);
  },

  async get(id: number): Promise<OrganizationDetail> {
    const response = await httpClient.get<OrganizationDetailApiResponse>(
      `${API_ENDPOINTS.ORGANIZATIONS}/${id}`
    );
    return mapOrganizationDetail(response);
  },

  async update(id: number, data: OrganizationUpdateRequest): Promise<OrganizationDetail> {
    const response = await httpClient.patch<OrganizationDetailApiResponse>(
      `${API_ENDPOINTS.ORGANIZATIONS}/${id}`,
      { body: JSON.stringify(data) }
    );
    return mapOrganizationDetail(response);
  },

  delete(id: number): Promise<void> {
    return httpClient.delete(`${API_ENDPOINTS.ORGANIZATIONS}/${id}`);
  },

  // 멤버 관리
  async getMembers(orgId: number): Promise<OrganizationMember[]> {
    const response = await httpClient.get<OrganizationMemberApiResponse[]>(
      `${API_ENDPOINTS.ORGANIZATIONS}/${orgId}/members`
    );
    return response.map(mapMember);
  },

  removeMember(orgId: number, memberId: number): Promise<void> {
    return httpClient.delete(`${API_ENDPOINTS.ORGANIZATIONS}/${orgId}/members/${memberId}`);
  },

  leave(orgId: number): Promise<void> {
    return httpClient.post(`${API_ENDPOINTS.ORGANIZATIONS}/${orgId}/leave`);
  },

  // 초대 코드
  async createInvitation(orgId: number, data?: InvitationCreateRequest): Promise<Invitation> {
    const response = await httpClient.post<InvitationApiResponse>(
      `${API_ENDPOINTS.ORGANIZATIONS}/${orgId}/invitations`,
      { body: JSON.stringify(data || {}) }
    );
    return mapInvitation(response);
  },

  async getInvitations(orgId: number): Promise<Invitation[]> {
    const response = await httpClient.get<InvitationApiResponse[]>(
      `${API_ENDPOINTS.ORGANIZATIONS}/${orgId}/invitations`
    );
    return response.map(mapInvitation);
  },

  deactivateInvitation(orgId: number, invitationId: number): Promise<void> {
    return httpClient.delete(
      `${API_ENDPOINTS.ORGANIZATIONS}/${orgId}/invitations/${invitationId}`
    );
  },

  async joinByCode(data: JoinByCodeRequest): Promise<OrganizationDetail> {
    const response = await httpClient.post<OrganizationDetailApiResponse>(
      `${API_ENDPOINTS.ORGANIZATIONS}/join`,
      { body: JSON.stringify(data) }
    );
    return mapOrganizationDetail(response);
  },
};
