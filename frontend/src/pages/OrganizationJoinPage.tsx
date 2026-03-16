import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ApiError } from '../utils/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { organizationService } from '../services/api/organizationService';

export const OrganizationJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 8);
    setCode(value);
    if (error) {
      setError('');
    }
  };

  const validateForm = (): boolean => {
    if (!code.trim()) {
      setError('초대 코드를 입력해주세요.');
      return false;
    }
    if (code.length < 6) {
      setError('초대 코드가 너무 짧습니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const organization = await organizationService.joinByCode({ code });
      navigate(`/organizations/${organization.id}`, { state: { organization } });
    } catch (err) {
      const apiError = err as ApiError;
      setSubmitError(apiError.detail || apiError.message || '가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            모임 가입하기
          </h1>
          <p className="text-slate-600">
            초대 코드를 입력하여 모임에 참여하세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {submitError && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <p className="text-sm text-rose-600">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="code"
              type="text"
              label="초대 코드"
              value={code}
              onChange={handleChange}
              error={error}
              required
              placeholder="초대 코드 8자리"
              autoComplete="off"
              className="text-center text-lg tracking-widest font-mono"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              가입하기
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              초대 코드는 모임 관리자에게 받을 수 있습니다.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <Link
            to="/organizations/create"
            className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            새 모임 만들기
          </Link>
          <Link
            to="/organizations/select"
            className="block text-sm text-slate-600 hover:text-blue-600"
          >
            돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};
