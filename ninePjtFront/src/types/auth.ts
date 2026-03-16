/**
 * 인증 관련 타입 정의
 */

export interface SignupRequest {
  username: string;
  password: string;
  email: string;
  nickname: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  nickname: string;
}

export interface SignupError {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  nickname: string;
  access: string;
  refresh: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string;
  is_staff: boolean;
  is_superuser: boolean;
}

