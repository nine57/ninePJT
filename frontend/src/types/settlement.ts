export interface SettlementGroup {
  id: number;
  name: string;
  description: string;
  expenseCount: number;
  totalAmount: string;
  createdAt: string;
}

export interface SettlementGroupDetail {
  id: number;
  name: string;
  description: string;
  organizationId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemberExpense {
  userId: number;
  username: string;
  totalPaid: string;
}

export interface MemberBalance {
  userId: number;
  username: string;
  totalPaid: string;
  totalOwed: string;
  balance: string;
}

export interface SettlementItem {
  fromUserId: number;
  fromUsername: string;
  toUserId: number;
  toUsername: string;
  amount: string;
}

export interface SettlementCalculation {
  groupId: number;
  groupName: string;
  totalAmount: string;
  memberCount: number;
  perPerson: string;
  memberExpenses: MemberExpense[];
  memberBalances: MemberBalance[];
  settlements: SettlementItem[];
}

export interface SettlementTransfer {
  id: number;
  fromUserId: number;
  fromUsername: string;
  toUserId: number;
  toUsername: string;
  amount: string;
  isPaid: boolean;
  paidAt: string | null;
}

export interface SettlementDetail {
  id: number;
  groupId: number;
  groupName: string;
  confirmedByUsername: string;
  totalAmount: string;
  memberCount: number;
  confirmedAt: string;
  memo: string;
  transfers: SettlementTransfer[];
}

export interface SettlementHistory {
  id: number;
  totalAmount: string;
  memberCount: number;
  confirmedAt: string;
  confirmedByUsername: string;
  transferCount: number;
  paidCount: number;
}

// API Response types (snake_case)
export interface SettlementGroupApiResponse {
  id: number;
  name: string;
  description: string;
  expense_count: number;
  total_amount: string;
  created_at: string;
}

export interface SettlementGroupDetailApiResponse {
  id: number;
  name: string;
  description: string;
  organization_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemberExpenseApiResponse {
  user_id: number;
  username: string;
  total_paid: string;
}

export interface MemberBalanceApiResponse {
  user_id: number;
  username: string;
  total_paid: string;
  total_owed: string;
  balance: string;
}

export interface SettlementItemApiResponse {
  from_user_id: number;
  from_username: string;
  to_user_id: number;
  to_username: string;
  amount: string;
}

export interface SettlementCalculationApiResponse {
  group_id: number;
  group_name: string;
  total_amount: string;
  member_count: number;
  per_person: string;
  member_expenses: MemberExpenseApiResponse[];
  member_balances: MemberBalanceApiResponse[];
  settlements: SettlementItemApiResponse[];
}

export interface SettlementTransferApiResponse {
  id: number;
  from_user_id: number;
  from_username: string;
  to_user_id: number;
  to_username: string;
  amount: string;
  is_paid: boolean;
  paid_at: string | null;
}

export interface SettlementDetailApiResponse {
  id: number;
  group_id: number;
  group_name: string;
  confirmed_by_username: string;
  total_amount: string;
  member_count: number;
  confirmed_at: string;
  memo: string;
  transfers: SettlementTransferApiResponse[];
}

export interface SettlementHistoryApiResponse {
  id: number;
  total_amount: string;
  member_count: number;
  confirmed_at: string;
  confirmed_by_username: string;
  transfer_count: number;
  paid_count: number;
}

// Request types
export interface SettlementGroupCreateRequest {
  name: string;
  description?: string;
}

export interface SettlementGroupUpdateRequest {
  name?: string;
  description?: string;
}

export interface SettlementConfirmRequest {
  memo?: string;
}
