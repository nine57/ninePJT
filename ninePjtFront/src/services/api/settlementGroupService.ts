import { httpClient } from './httpClient';
import {
  SettlementGroup,
  SettlementGroupDetail,
  SettlementCalculation,
  SettlementDetail,
  SettlementHistory,
  SettlementTransfer,
  SettlementGroupApiResponse,
  SettlementGroupDetailApiResponse,
  SettlementCalculationApiResponse,
  SettlementDetailApiResponse,
  SettlementHistoryApiResponse,
  SettlementTransferApiResponse,
  SettlementGroupCreateRequest,
  SettlementGroupUpdateRequest,
  SettlementConfirmRequest,
} from '../../types/settlement';

const mapSettlementGroup = (data: SettlementGroupApiResponse): SettlementGroup => ({
  id: data.id,
  name: data.name,
  description: data.description,
  expenseCount: data.expense_count,
  totalAmount: data.total_amount,
  createdAt: data.created_at,
});

const mapSettlementGroupDetail = (data: SettlementGroupDetailApiResponse): SettlementGroupDetail => ({
  id: data.id,
  name: data.name,
  description: data.description,
  organizationId: data.organization_id,
  isActive: data.is_active,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

const mapTransfer = (t: SettlementTransferApiResponse): SettlementTransfer => ({
  id: t.id,
  fromUserId: t.from_user_id,
  fromUsername: t.from_username,
  toUserId: t.to_user_id,
  toUsername: t.to_username,
  amount: t.amount,
  isPaid: t.is_paid,
  paidAt: t.paid_at,
});

const mapSettlementCalculation = (data: SettlementCalculationApiResponse): SettlementCalculation => ({
  groupId: data.group_id,
  groupName: data.group_name,
  totalAmount: data.total_amount,
  memberCount: data.member_count,
  perPerson: data.per_person,
  memberExpenses: data.member_expenses.map((m) => ({
    userId: m.user_id,
    username: m.username,
    totalPaid: m.total_paid,
  })),
  memberBalances: (data.member_balances || []).map((b) => ({
    userId: b.user_id,
    username: b.username,
    totalPaid: b.total_paid,
    totalOwed: b.total_owed,
    balance: b.balance,
  })),
  settlements: data.settlements.map((s) => ({
    fromUserId: s.from_user_id,
    fromUsername: s.from_username,
    toUserId: s.to_user_id,
    toUsername: s.to_username,
    amount: s.amount,
  })),
});

const mapSettlementDetail = (data: SettlementDetailApiResponse): SettlementDetail => ({
  id: data.id,
  groupId: data.group_id,
  groupName: data.group_name,
  confirmedByUsername: data.confirmed_by_username,
  totalAmount: data.total_amount,
  memberCount: data.member_count,
  confirmedAt: data.confirmed_at,
  memo: data.memo,
  transfers: data.transfers.map(mapTransfer),
});

const mapSettlementHistory = (data: SettlementHistoryApiResponse): SettlementHistory => ({
  id: data.id,
  totalAmount: data.total_amount,
  memberCount: data.member_count,
  confirmedAt: data.confirmed_at,
  confirmedByUsername: data.confirmed_by_username,
  transferCount: data.transfer_count,
  paidCount: data.paid_count,
});

export const settlementGroupService = {
  list: async (orgId: number): Promise<SettlementGroup[]> => {
    const data = await httpClient.get<SettlementGroupApiResponse[]>(
      `/api/organizations/${orgId}/settlement-groups`
    );
    return data.map(mapSettlementGroup);
  },

  get: async (orgId: number, groupId: number): Promise<SettlementGroupDetail> => {
    const data = await httpClient.get<SettlementGroupDetailApiResponse>(
      `/api/organizations/${orgId}/settlement-groups/${groupId}`
    );
    return mapSettlementGroupDetail(data);
  },

  create: async (orgId: number, request: SettlementGroupCreateRequest): Promise<SettlementGroupDetail> => {
    const data = await httpClient.post<SettlementGroupDetailApiResponse>(
      `/api/organizations/${orgId}/settlement-groups`,
      { body: JSON.stringify(request) }
    );
    return mapSettlementGroupDetail(data);
  },

  update: async (
    orgId: number,
    groupId: number,
    request: SettlementGroupUpdateRequest
  ): Promise<SettlementGroupDetail> => {
    const data = await httpClient.patch<SettlementGroupDetailApiResponse>(
      `/api/organizations/${orgId}/settlement-groups/${groupId}`,
      { body: JSON.stringify(request) }
    );
    return mapSettlementGroupDetail(data);
  },

  delete: async (orgId: number, groupId: number): Promise<void> => {
    await httpClient.delete(`/api/organizations/${orgId}/settlement-groups/${groupId}`);
  },

  calculate: async (orgId: number, groupId: number): Promise<SettlementCalculation> => {
    const data = await httpClient.get<SettlementCalculationApiResponse>(
      `/api/organizations/${orgId}/settlement-groups/${groupId}/calculate`
    );
    return mapSettlementCalculation(data);
  },

  confirm: async (orgId: number, groupId: number, memo?: string): Promise<SettlementDetail> => {
    const data = await httpClient.post<SettlementDetailApiResponse>(
      `/api/organizations/${orgId}/settlement-groups/${groupId}/confirm`,
      { body: JSON.stringify({ memo: memo || '' } satisfies SettlementConfirmRequest) }
    );
    return mapSettlementDetail(data);
  },

  history: async (orgId: number, groupId: number): Promise<SettlementHistory[]> => {
    const data = await httpClient.get<SettlementHistoryApiResponse[]>(
      `/api/organizations/${orgId}/settlement-groups/${groupId}/history`
    );
    return data.map(mapSettlementHistory);
  },

  historyDetail: async (orgId: number, groupId: number, settlementId: number): Promise<SettlementDetail> => {
    const data = await httpClient.get<SettlementDetailApiResponse>(
      `/api/organizations/${orgId}/settlement-groups/${groupId}/history/${settlementId}`
    );
    return mapSettlementDetail(data);
  },

  markTransferPaid: async (orgId: number, groupId: number, transferId: number): Promise<SettlementTransfer> => {
    const data = await httpClient.patch<SettlementTransferApiResponse>(
      `/api/organizations/${orgId}/settlement-groups/${groupId}/transfers/${transferId}/pay`,
      {}
    );
    return mapTransfer(data);
  },
};
