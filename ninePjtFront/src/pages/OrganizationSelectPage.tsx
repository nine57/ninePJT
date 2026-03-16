import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiError } from '../utils/api';
import { Button } from '../components/Button';
import { Organization } from '../types/organization';
import { organizationService } from '../services/api/organizationService';
import { useNavigate } from 'react-router-dom';

export const OrganizationSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [shouldShowSheet, setShouldShowSheet] = useState(false);
  const [renderSheet, setRenderSheet] = useState(false);
  const [isSheetActive, setIsSheetActive] = useState(false);
  useEffect(() => {
    let raf: number | null = null;
    if (shouldShowSheet) {
      setRenderSheet(true);
      if (typeof window !== 'undefined') {
        raf = window.requestAnimationFrame(() => {
          setIsSheetActive(true);
        });
      } else {
        setIsSheetActive(true);
      }
    } else {
      setIsSheetActive(false);
    }
    return () => {
      if (raf !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(raf);
      }
    };
  }, [shouldShowSheet]);

  const handleSheetClose = useCallback(() => {
    setShouldShowSheet(false);
  }, []);

  const handleProceed = (organization: Organization) => {
    handleSheetClose();
    navigate(`/organizations/${organization.id}`, { state: { organization } });
  };

  const loadOrganizations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await organizationService.list();
      setOrganizations(data);
      if (data.length === 1) {
        setShouldShowSheet(false);
        handleProceed(data[0]);
      } else if (data.length > 1) {
        setShouldShowSheet(true);
      } else {
        setShouldShowSheet(false);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '조직 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emptyState = useMemo(() => {
    if (isLoading) {
      return '조직 목록을 불러오는 중입니다...';
    }
    if (error) {
      return error;
    }
    return '참여 중인 조직이 없습니다.';
  }, [isLoading, error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            모임 선택
          </h1>
          <p className="text-slate-600">
            어떤 모임에서 활동하실 건가요?
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600">
              해당하는 모임이 없다면<br />새로 모임을 만들어보세요.
            </p>
            <Button variant="secondary" fullWidth onClick={() => navigate('/organizations/create')}>
              새로 모임 만들기
            </Button>
          </div>

          {organizations.length === 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center space-y-4">
              <p className="text-sm text-slate-600">{emptyState}</p>
              {!isLoading && (
                <Button variant="secondary" fullWidth onClick={loadOrganizations}>
                  다시 시도
                </Button>
              )}
            </div>
          )}

          {organizations.length === 1 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-3 text-center">
              <p className="text-sm text-blue-600 font-medium">자동 연결 중</p>
              <p className="text-lg font-semibold text-slate-900">{organizations[0].name}</p>
              {organizations[0].description && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {organizations[0].description}
                </p>
              )}
              <p className="text-xs text-blue-500">해당 모임으로 곧 이동합니다...</p>
            </div>
          )}
        </div>

        {renderSheet && organizations.length > 1 && (
          <div
            className={`fixed inset-0 bg-black/40 flex items-end justify-center z-50 transition-opacity duration-300 ${
              isSheetActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={handleSheetClose}
          >
            <div
              className="w-full max-w-md bg-white rounded-t-3xl p-8 pt-4 space-y-4 transform transition-transform duration-300 ease-out"
              style={{
                transform: isSheetActive ? 'translateY(0)' : 'translateY(100%)',
              }}
              onClick={(event) => event.stopPropagation()}
              onTransitionEnd={(event) => {
                if (event.propertyName === 'transform' && !isSheetActive) {
                  setRenderSheet(false);
                }
              }}
            >
              <div className="flex items-center justify-between my-2 px-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">모임을 선택하세요</h2>
                </div>
              </div>
              <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
                {organizations.map((organization) => (
                  <button
                    key={organization.id}
                    onClick={() => handleProceed(organization)}
                    className="w-full text-left bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl p-4 transition-all duration-200"
                  >
                    <p className="text-xs text-blue-500 font-semibold mb-1">모임 #{organization.id}</p>
                    <p className="text-lg font-bold text-slate-900 mb-1">{organization.name}</p>
                    {organization.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {organization.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


