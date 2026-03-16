import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
} from '../utils/validation';

import { ApiError } from '../utils/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SignupRequest } from '../types/auth';
import { authService } from '../services/api/authService';

/**
 * 회원가입 페이지
 */
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupRequest>({
    username: '',
    password: '',
    email: '',
    nickname: '',
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof SignupRequest | 'passwordConfirm', string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleChange = (field: keyof SignupRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 실시간 검증
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordConfirm(value);
    if (errors.passwordConfirm) {
      const result = validatePasswordConfirm(formData.password, value);
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: result.error,
      }));
    }
  };

  const validateField = (field: keyof SignupRequest, value: string) => {
    let result;
    switch (field) {
      case 'username':
        result = validateUsername(value);
        break;
      case 'password':
        result = validatePassword(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'nickname':
        result = validateNickname(value);
        break;
      default:
        return;
    }
    setErrors((prev) => ({
      ...prev,
      [field]: result.error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const usernameResult = validateUsername(formData.username);
    if (!usernameResult.isValid) {
      newErrors.username = usernameResult.error;
    }

    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.error;
    }

    const passwordConfirmResult = validatePasswordConfirm(
      formData.password,
      passwordConfirm
    );
    if (!passwordConfirmResult.isValid) {
      newErrors.passwordConfirm = passwordConfirmResult.error;
    }

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error;
    }

    const nicknameResult = validateNickname(formData.nickname);
    if (!nicknameResult.isValid) {
      newErrors.nickname = nicknameResult.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.signup(formData);
      alert(`${response.nickname || response.username}님, 회원가입이 완료되었습니다!`);
      navigate('/login');
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors) {
        // 서버에서 반환한 필드별 에러 처리
        const fieldErrors: typeof errors = {};
        Object.keys(apiError.errors).forEach((key) => {
          const field = key as keyof SignupRequest;
          if (apiError.errors && apiError.errors[key]) {
            fieldErrors[field] = apiError.errors[key][0];
          }
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        return;
      }
      setSubmitError(apiError.detail || apiError.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            회원가입
          </h1>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {submitError && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <p className="text-sm text-rose-600">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              error={errors.username}
              required
              showRequiredIndicator={false}
              placeholder="사용자명"
              autoComplete="username"
              showErrorAsPlaceholder
            />

            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
              showRequiredIndicator={false}
              placeholder="이메일"
              autoComplete="email"
              showErrorAsPlaceholder
            />

            <Input
              id="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange('nickname')}
              error={errors.nickname}
              required
              showRequiredIndicator={false}
              placeholder="닉네임"
              autoComplete="nickname"
              showErrorAsPlaceholder
            />

            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
              showRequiredIndicator={false}
              placeholder="비밀번호"
              autoComplete="new-password"
              showErrorAsPlaceholder
            />

            <Input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              error={errors.passwordConfirm}
              required
              showRequiredIndicator={false}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
              showErrorAsPlaceholder
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              회원가입
            </Button>
          </form>
        </div>

        {/* 푸터 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

