import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import { validatePassword, validateUsername } from '../utils/validation';

import { ApiError } from '../utils/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LoginRequest } from '../types/auth';
import { authService } from '../services/api/authService';
import { getRandomWelcomeMessage } from '../constants/messages';
import { setTokens } from '../utils/token';

/**
 * 로그인 페이지
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const welcomeMessage = useMemo(() => getRandomWelcomeMessage(), []);
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginRequest, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleChange = (field: keyof LoginRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 실시간 검증
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const validateField = (field: keyof LoginRequest, value: string) => {
    let result;
    switch (field) {
      case 'username':
        result = validateUsername(value);
        break;
      case 'password':
        result = validatePassword(value);
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
      const response = await authService.login(formData);
      if (response && response.access && response.refresh) {
        // JWT 토큰 저장
        setTokens(response.access, response.refresh);
        setFormData({
          username: '',
          password: '',
        });
        setErrors({});
        const redirectTo = searchParams.get('redirect') || '/organizations/select';
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors) {
        // 서버에서 반환한 필드별 에러 처리
        const fieldErrors: typeof errors = {};
        Object.keys(apiError.errors).forEach((key) => {
          const field = key as keyof LoginRequest;
          if (apiError.errors && apiError.errors[key]) {
            fieldErrors[field] = apiError.errors[key][0];
          }
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        return;
      }
      setSubmitError(apiError.detail || apiError.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-dvh bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            로그인
          </h1>
        </div>

        {/* 웰컴 문구 */}
        <p className="text-sm text-slate-600 text-center mb-4">
          {welcomeMessage}
        </p>

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6">
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
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
              showRequiredIndicator={false}
              placeholder="비밀번호"
              autoComplete="current-password"
              showErrorAsPlaceholder
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              로그인
            </Button>
          </form>
        </div>

        {/* 푸터 링크 */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm text-slate-600">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

