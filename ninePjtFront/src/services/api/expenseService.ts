import { API_BASE_URL, API_ENDPOINTS } from '../../constants/api';

import { ApiError } from '../../utils/api';
import { getAccessToken } from '../../utils/token';
import { httpClient } from './httpClient';

// ===== API 응답 타입 (snake_case) =====

export interface ExpenseParticipantApiResponse {
  user_id: number;
  username: string;
  amount: string | null;
}

export interface ExpenseApiResponse {
  id: number;
  group: number;
  group_name: string | null;
  title: string;
  amount: string;
  payer: number;
  payer_username: string;
  paid_at: string | null;
  note: string;
  split_type: string;
  is_settled: boolean;
  created_at: string;
  updated_at: string;
  participants: ExpenseParticipantApiResponse[];
}

export interface ExpenseAnalyzeImageResponse {
  expense: {
    id: number;
    group: number;
    group_name: string | null;
    merchant_name: string;
    amount: string;
    currency: string;
    payer: number;
    payer_username: string;
    paid_at: string | null;
    payment_method: string;
    memo: string;
    is_settled: boolean;
    created_at: string;
    updated_at: string;
  };
  attachment: {
    id: number;
    file_path: string;
    caption: string;
    created_at: string;
  };
  analysis: {
    merchant_name?: string | null;
    amount?: string | null;
    currency?: string | null;
    paid_at?: string | null;
    payment_method?: string | null;
    memo?: string | null;
    items?: ExpenseAnalysisItem[];
  };
}

export interface ExpenseAnalysisItem {
  name: string;
  quantity: number | null;
  unit_price: string | null;
  total_price: string | null;
}

// ===== 프론트엔드 모델 (camelCase) =====

export interface ExpenseParticipant {
  userId: number;
  username: string;
  amount: string | null;
}

export interface Expense {
  id: number;
  group: number;
  groupName: string | null;
  title: string;
  amount: string;
  payer: number;
  payerUsername: string;
  paidAt: string | null;
  note: string;
  splitType: string;
  isSettled: boolean;
  createdAt: string;
  updatedAt: string;
  participants: ExpenseParticipant[];
}

// ===== 요청 타입 =====

export interface ExpenseShareInput {
  user_id: number;
  amount?: string;
}

export interface ExpenseCreateRequest {
  group: number;
  title: string;
  amount: string;
  note?: string;
  paid_at?: string;
  split_type?: string;
  participants?: ExpenseShareInput[];
}

export interface ExpenseAnalyzeImageRequest {
  image: File;
  group: number;
}

export interface FetchExpensesParams {
  organization?: number;
  group?: number;
  payer?: number;
}

// ===== 변환 함수 =====

const mapExpense = (data: ExpenseApiResponse): Expense => ({
  id: data.id,
  group: data.group,
  groupName: data.group_name,
  title: data.title,
  amount: data.amount,
  payer: data.payer,
  payerUsername: data.payer_username,
  paidAt: data.paid_at,
  note: data.note,
  splitType: data.split_type || 'EQUAL',
  isSettled: data.is_settled,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  participants: (data.participants || []).map((p) => ({
    userId: p.user_id,
    username: p.username,
    amount: p.amount,
  })),
});

// ===== 서비스 =====

export interface ExpenseUpdateRequest {
  title?: string;
  amount?: string;
  note?: string;
  paid_at?: string;
  merchant_name?: string;
  memo?: string;
  split_type?: string;
  participants?: ExpenseShareInput[];
}

export const expenseService = {
  list: async (params?: FetchExpensesParams): Promise<Expense[]> => {
    const data = await httpClient.get<ExpenseApiResponse[]>(API_ENDPOINTS.EXPENSES, {
      params: params as Record<string, number>,
    });
    return data.map(mapExpense);
  },

  get: async (id: number): Promise<Expense> => {
    const data = await httpClient.get<ExpenseApiResponse>(`${API_ENDPOINTS.EXPENSES}/${id}`);
    return mapExpense(data);
  },

  create: async (request: ExpenseCreateRequest): Promise<Expense> => {
    const data = await httpClient.post<ExpenseApiResponse>(API_ENDPOINTS.EXPENSES, {
      body: JSON.stringify(request),
    });
    return mapExpense(data);
  },

  update: async (id: number, request: ExpenseUpdateRequest): Promise<Expense> => {
    const data = await httpClient.patch<ExpenseApiResponse>(`${API_ENDPOINTS.EXPENSES}/${id}`, {
      body: JSON.stringify(request),
    });
    return mapExpense(data);
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.EXPENSES}/${id}`);
  },

  settle: async (id: number): Promise<Expense> => {
    const data = await httpClient.patch<ExpenseApiResponse>(`${API_ENDPOINTS.EXPENSES}/${id}/settle`, {});
    return mapExpense(data);
  },

  analyzeImage: async (
    request: ExpenseAnalyzeImageRequest
  ): Promise<ExpenseAnalyzeImageResponse> => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('인증이 필요합니다.');
    }

    const formData = new FormData();
    formData.append('image', request.image);

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.EXPENSES_ANALYZE_IMAGE}?group=${request.group}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    let responseData: unknown = null;
    let responseText = '';
    try {
      responseText = await response.text();
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch {
      responseData = responseText || null;
    }

    if (!response.ok) {
      const detail =
        typeof responseData === 'object' &&
        responseData !== null &&
        'detail' in responseData
          ? (responseData as { detail?: string }).detail
          : undefined;
      const error: ApiError = {
        message: detail || '이미지 분석 중 오류가 발생했습니다.',
        detail,
        status: response.status,
        errors:
          typeof responseData === 'object' &&
          responseData !== null &&
          'errors' in responseData
            ? (responseData as { errors?: Record<string, string[]> }).errors
            : undefined,
        raw: responseData,
      };
      throw error;
    }

    return responseData as ExpenseAnalyzeImageResponse;
  },
};

