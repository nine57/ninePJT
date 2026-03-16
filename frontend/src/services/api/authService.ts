import { LoginRequest, LoginResponse, SignupRequest, SignupResponse, UserInfo } from '../../types/auth';
import { clearTokens, getRefreshToken, setAccessToken } from '../../utils/token';

import { API_ENDPOINTS } from '../../constants/api';
import { httpClient } from './httpClient';

export interface TokenRefreshResponse {
  access: string;
}

export const authService = {
  signup(data: SignupRequest): Promise<SignupResponse> {
    return httpClient.post<SignupResponse>(API_ENDPOINTS.SIGNUP, {
      body: JSON.stringify(data),
    });
  },
  login(data: LoginRequest): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, {
      body: JSON.stringify(data),
    });
  },
  logout(): Promise<void> {
    return httpClient.post<void>(API_ENDPOINTS.LOGOUT, {}).then(() => {
      clearTokens();
    });
  },
  me(): Promise<UserInfo> {
    return httpClient.get<UserInfo>(API_ENDPOINTS.ME);
  },
  refreshToken(): Promise<string> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return Promise.reject(new Error('Refresh token이 없습니다.'));
    }
    return httpClient
      .post<TokenRefreshResponse>(API_ENDPOINTS.TOKEN_REFRESH, {
        body: JSON.stringify({ refresh: refreshToken }),
      })
      .then((response) => {
        setAccessToken(response.access);
        return response.access;
      })
      .catch((error) => {
        clearTokens();
        throw error;
      });
  },
};


