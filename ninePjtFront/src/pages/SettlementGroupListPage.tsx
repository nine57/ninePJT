import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { SettlementGroup } from '../types/settlement';
import { settlementGroupService } from '../services/api/settlementGroupService';

export const SettlementGroupListPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [groups, setGroups] = useState<SettlementGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    let isMounted = true;
    const loadGroups = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await settlementGroupService.list(Number(orgId));
        if (!isMounted) return;
        setGroups(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('정산 그룹 목록 로딩 실패', err);
        setError('정산 그룹 목록을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadGroups();
    return () => {
      isMounted = false;
    };
  }, [orgId]);

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  return (
    <MobileLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">정산</h1>
          <button
            onClick={() => navigate(`/organizations/${orgId}/settlements/create`)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
          >
            새 그룹
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-slate-500 py-12">불러오는 중...</div>
        )}

        {!isLoading && error && (
          <div className="text-center text-red-500 py-12">{error}</div>
        )}

        {!isLoading && !error && groups.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <p className="mb-4">아직 정산 그룹이 없습니다.</p>
            <button
              onClick={() => navigate(`/organizations/${orgId}/settlements/create`)}
              className="text-blue-500 hover:underline"
            >
              첫 번째 그룹을 만들어보세요
            </button>
          </div>
        )}

        {!isLoading && !error && groups.length > 0 && (
          <div className="space-y-4">
            {groups.map((group) => (
              <article
                key={group.id}
                onClick={() => navigate(`/organizations/${orgId}/settlements/${group.id}`)}
                className="border border-slate-100 rounded-xl bg-white shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-slate-900">{group.name}</h2>
                  <span className="text-sm text-slate-500">
                    {group.expenseCount}건
                  </span>
                </div>
                {group.description && (
                  <p className="text-sm text-slate-600 mb-2">{group.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    {formatAmount(group.totalAmount)}원
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(group.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};
