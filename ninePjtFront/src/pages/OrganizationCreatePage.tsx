import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ApiError } from '../utils/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { OrganizationCreateRequest } from '../types/organization';
import { organizationService } from '../services/api/organizationService';

export const OrganizationCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OrganizationCreateRequest>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrganizationCreateRequest, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleChange = (field: keyof OrganizationCreateRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = '모임 이름을 입력해주세요.';
    } else if (formData.name.length > 100) {
      newErrors.name = '모임 이름은 100자 이하로 입력해주세요.';
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
      const organization = await organizationService.create(formData);
      navigate(`/organizations/${organization.id}`, { state: { organization } });
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors) {
        const fieldErrors: typeof errors = {};
        Object.keys(apiError.errors).forEach((key) => {
          const field = key as keyof OrganizationCreateRequest;
          if (apiError.errors && apiError.errors[key]) {
            fieldErrors[field] = apiError.errors[key][0];
          }
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        return;
      }
      setSubmitError(apiError.detail || apiError.message || '모임 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            새 모임 만들기
          </h1>
          <p className="text-slate-600">
            함께할 모임을 만들어보세요
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
              id="name"
              type="text"
              label="모임 이름"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              required
              placeholder="모임 이름을 입력하세요"
              autoComplete="off"
            />

            <div className="w-full space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-800 tracking-tight"
              >
                모임 설명
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="모임에 대한 설명을 입력하세요 (선택)"
                rows={3}
                className={`
                  w-full px-4 py-3 rounded-xl border text-sm
                  focus:outline-none focus:ring-4 focus:ring-blue-100
                  focus:border-blue-300
                  transition-all duration-200 shadow-sm
                  resize-none
                  ${errors.description
                    ? 'border-rose-100 bg-rose-50 placeholder-rose-400'
                    : 'border-blue-50 bg-blue-50 placeholder-slate-400'
                  }
                  text-slate-900
                `}
              />
              {errors.description && (
                <p className="text-sm font-medium text-rose-600">{errors.description}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              모임 만들기
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/organizations/select"
            className="text-sm text-slate-600 hover:text-blue-600"
          >
            취소하고 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};
