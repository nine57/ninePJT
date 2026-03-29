import { clearTokens, getAccessToken } from './token';

/**
 * API 유틸리티 함수
 */

export interface ApiError {
  message: string;
  detail?: string;
  status?: number;
  errors?: {
    [key: string]: string[];
  };
  raw?: unknown;
}

/**
 * API 요청을 위한 fetch 래퍼
 */
export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const accessToken = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // JWT 토큰이 있으면 Authorization 헤더에 추가
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: unknown = null;
  let responseText = '';
  try {
    responseText = await response.text();
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = responseText || null;
  }

  if (response.status === 401) {
    clearTokens();
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login?redirect=${redirect}`;
    return Promise.reject({ message: '로그인이 필요합니다.', status: 401 } as ApiError);
  }

  if (!response.ok) {
    const detail =
      typeof data === 'object' && data !== null && 'detail' in data
        ? (data as { detail?: string }).detail
        : undefined;
    const error: ApiError = {
      message: detail || '요청 처리 중 오류가 발생했습니다.',
      detail,
      status: response.status,
      errors:
        typeof data === 'object' && data !== null && 'errors' in data
          ? (data as { errors?: Record<string, string[]> }).errors
          : undefined,
      raw: data,
    };
    throw error;
  }

  return (data as T) ?? ({} as T);
}

