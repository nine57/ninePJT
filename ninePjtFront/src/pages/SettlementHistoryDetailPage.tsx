import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { SettlementDetail } from '../types/settlement';
import { settlementGroupService } from '../services/api/settlementGroupService';

export const SettlementHistoryDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId, groupId, settlementId } = useParams<{
    orgId: string;
    groupId: string;
    settlementId: string;
  }>();
  const [detail, setDetail] = useState<SettlementDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId || !groupId || !settlementId) return;

    setIsLoading(true);
    settlementGroupService
      .historyDetail(Number(orgId), Number(groupId), Number(settlementId))
      .then(setDetail)
      .catch((err) => {
        console.error('정산 이력 상세 로딩 실패', err);
        setError('정산 이력을 불러오지 못했습니다.');
      })
      .finally(() => setIsLoading(false));
  }, [orgId, groupId, settlementId]);

  const handleMarkPaid = async (transferId: number) => {
    if (!orgId || !groupId || !detail) return;
    try {
      const updated = await settlementGroupService.markTransferPaid(
        Number(orgId),
        Number(groupId),
        transferId
      );
      setDetail({
        ...detail,
        transfers: detail.transfers.map((t) =>
          t.id === transferId ? updated : t
        ),
      });
    } catch (err) {
      console.error('송금 완료 처리 실패', err);
      alert('송금 완료 처리에 실패했습니다.');
    }
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-500">불러오는 중...</div>
        </div>
      </MobileLayout>
    );
  }

  if (error || !detail) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-red-500">{error || '정산 이력을 찾을 수 없습니다.'}</div>
        </div>
      </MobileLayout>
    );
  }

  const paidCount = detail.transfers.filter((t) => t.isPaid).length;

  return (
    <MobileLayout>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate(`/organizations/${orgId}/settlements/${groupId}`)}
            className="text-sm text-slate-500 hover:text-slate-700 mb-1"
          >
            &larr; 그룹으로 돌아가기
          </button>
          <h1 className="text-2xl font-bold text-slate-900">정산 이력 상세</h1>
        </div>

        {/* Summary */}
        <section className="border border-slate-100 rounded-xl bg-white shadow-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">총 금액</div>
              <div className="text-xl font-bold text-slate-900">
                {formatAmount(detail.totalAmount)}원
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">참여 인원</div>
              <div className="text-xl font-bold text-slate-900">{detail.memberCount}명</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">확정자</div>
              <div className="text-sm font-medium text-slate-700">{detail.confirmedByUsername}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">확정일</div>
              <div className="text-sm font-medium text-slate-700">
                {new Date(detail.confirmedAt).toLocaleString('ko-KR')}
              </div>
            </div>
          </div>
          {detail.memo && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">메모</div>
              <div className="text-sm text-slate-700">{detail.memo}</div>
            </div>
          )}
        </section>

        {/* Transfers */}
        <section className="border border-slate-100 rounded-xl bg-white shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">송금 내역</h2>
            <span className="text-sm text-slate-500">
              {paidCount}/{detail.transfers.length}건 완료
            </span>
          </div>

          {detail.transfers.length === 0 ? (
            <div className="text-center text-slate-500 py-4">송금 내역이 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {detail.transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className={`p-3 rounded-lg border ${
                    transfer.isPaid
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {transfer.fromUsername}
                      </span>
                      <span className="text-slate-500">&rarr;</span>
                      <span className="font-medium text-slate-900">
                        {transfer.toUsername}
                      </span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {formatAmount(transfer.amount)}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {transfer.isPaid ? (
                      <span className="text-xs text-green-600">
                        {transfer.paidAt
                          ? `${new Date(transfer.paidAt).toLocaleString('ko-KR')} 완료`
                          : '완료'}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">미완료</span>
                    )}
                    {!transfer.isPaid && (
                      <button
                        onClick={() => handleMarkPaid(transfer.id)}
                        className="text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        완료 처리
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MobileLayout>
  );
};
