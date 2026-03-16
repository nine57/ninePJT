import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { SettlementGroupDetail, SettlementCalculation, SettlementHistory } from '../types/settlement';
import { Expense } from '../services/api/expenseService';
import { settlementGroupService } from '../services/api/settlementGroupService';
import { expenseService } from '../services/api/expenseService';

export const SettlementGroupDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId, groupId } = useParams<{ orgId: string; groupId: string }>();
  const [group, setGroup] = useState<SettlementGroupDetail | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [calculation, setCalculation] = useState<SettlementCalculation | null>(null);
  const [historyList, setHistoryList] = useState<SettlementHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalculation, setShowCalculation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const loadData = async () => {
    if (!orgId || !groupId) return;
    setIsLoading(true);
    setError(null);
    setCalculation(null);
    setShowCalculation(false);
    try {
      const [groupData, expensesData, historyData] = await Promise.all([
        settlementGroupService.get(Number(orgId), Number(groupId)),
        expenseService.list({ group: Number(groupId) }),
        settlementGroupService.history(Number(orgId), Number(groupId)),
      ]);
      setGroup(groupData);
      setExpenses(expensesData);
      setHistoryList(historyData);
    } catch (err) {
      console.error('데이터 로딩 실패', err);
      setError('데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orgId, groupId]);

  const handleCalculate = async () => {
    if (!orgId || !groupId) return;
    try {
      const data = await settlementGroupService.calculate(Number(orgId), Number(groupId));
      setCalculation(data);
      setShowCalculation(true);
    } catch (err) {
      console.error('정산 계산 실패', err);
      alert('정산 계산에 실패했습니다.');
    }
  };

  const handleConfirm = async () => {
    if (!orgId || !groupId || !calculation) return;
    if (!confirm('정산을 확정하시겠습니까? 미정산 지출이 모두 정산완료로 처리됩니다.')) return;

    setIsConfirming(true);
    try {
      await settlementGroupService.confirm(Number(orgId), Number(groupId));
      alert('정산이 확정되었습니다.');
      setShowCalculation(false);
      setCalculation(null);
      await loadData();
    } catch (err) {
      console.error('정산 확정 실패', err);
      alert('정산 확정에 실패했습니다.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (!confirm('이 지출을 삭제하시겠습니까?')) return;
    try {
      await expenseService.delete(expenseId);
      setExpenses(expenses.filter((e) => e.id !== expenseId));
      setCalculation(null);
      setShowCalculation(false);
    } catch (err) {
      console.error('지출 삭제 실패', err);
      alert('지출 삭제에 실패했습니다.');
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

  if (error || !group) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-red-500">{error || '그룹을 찾을 수 없습니다.'}</div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(`/organizations/${orgId}/settlements`)}
              className="text-sm text-slate-500 hover:text-slate-700 mb-1"
            >
              &larr; 목록으로
            </button>
            <h1 className="text-2xl font-bold text-slate-900">{group.name}</h1>
            {group.description && (
              <p className="text-sm text-slate-600 mt-1">{group.description}</p>
            )}
          </div>
          <button
            onClick={() => navigate(`/organizations/${orgId}/settlements/${groupId}/expenses/create`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            지출 추가
          </button>
        </div>

        {/* Expenses List */}
        <section className="border border-slate-100 rounded-xl bg-white shadow-lg p-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">지출 내역</h2>

          {expenses.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              아직 지출 내역이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <button
                  key={expense.id}
                  onClick={() => setSelectedExpense(expense)}
                  className={`w-full text-left flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-slate-50 ${
                    expense.isSettled ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {expense.title || expense.groupName || '지출'}
                      </span>
                      {expense.isSettled && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          정산완료
                        </span>
                      )}
                      {expense.splitType === 'CUSTOM' && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                          직접지정
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      {expense.payerUsername} &middot;{' '}
                      {expense.paidAt
                        ? new Date(expense.paidAt).toLocaleDateString('ko-KR')
                        : new Date(expense.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 ml-3">
                    {formatAmount(expense.amount)}원
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Settlement Calculation */}
        <section className="border border-slate-100 rounded-xl bg-white shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">정산하기</h2>
            <button
              onClick={handleCalculate}
              disabled={expenses.every((e) => e.isSettled)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              정산 계산
            </button>
          </div>

          {showCalculation && calculation && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-slate-500">총 금액</div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatAmount(calculation.totalAmount)}원
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-500">참여 인원</div>
                  <div className="text-lg font-bold text-slate-900">
                    {calculation.memberCount}명
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-500">1인당</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatAmount(calculation.perPerson)}원
                  </div>
                </div>
              </div>

              {/* Member Balances */}
              {calculation.memberBalances.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">멤버별 잔액</h3>
                  <div className="space-y-2">
                    {calculation.memberBalances.map((member) => {
                      const balance = parseFloat(member.balance);
                      return (
                        <div
                          key={member.userId}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded"
                        >
                          <div>
                            <span className="text-slate-700">{member.username}</span>
                            <span className="text-xs text-slate-400 ml-2">
                              지출 {formatAmount(member.totalPaid)} / 부담 {formatAmount(member.totalOwed)}
                            </span>
                          </div>
                          <span className={`font-medium ${balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                            {balance > 0 ? '+' : ''}{formatAmount(member.balance)}원
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Member Expenses */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">멤버별 지출</h3>
                <div className="space-y-2">
                  {calculation.memberExpenses.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded"
                    >
                      <span className="text-slate-700">{member.username}</span>
                      <span className="font-medium text-slate-900">
                        {formatAmount(member.totalPaid)}원
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settlements */}
              {calculation.settlements.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">송금 내역</h3>
                  <div className="space-y-2">
                    {calculation.settlements.map((settlement, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {settlement.fromUsername}
                          </span>
                          <span className="text-slate-500">&rarr;</span>
                          <span className="font-medium text-slate-900">
                            {settlement.toUsername}
                          </span>
                        </div>
                        <span className="font-bold text-blue-600">
                          {formatAmount(settlement.amount)}원
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {calculation.settlements.length === 0 && (
                <div className="text-center text-slate-500 py-4">
                  모든 멤버가 동일하게 지출했습니다. 정산할 내역이 없습니다.
                </div>
              )}

              {/* 정산 확정 버튼 */}
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isConfirming ? '확정 중...' : '정산 확정하기'}
              </button>
            </div>
          )}

          {!showCalculation && (
            <div className="text-center text-slate-500 py-4">
              정산 계산 버튼을 눌러 누가 누구에게 얼마를 보내야 하는지 확인하세요.
            </div>
          )}
        </section>

        {/* Settlement History */}
        {historyList.length > 0 && (
          <section className="border border-slate-100 rounded-xl bg-white shadow-lg p-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">정산 이력</h2>
            <div className="space-y-3">
              {historyList.map((history) => (
                <button
                  key={history.id}
                  onClick={() => navigate(`/organizations/${orgId}/settlements/${groupId}/history/${history.id}`)}
                  className="w-full text-left p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">
                        {formatAmount(history.totalAmount)}원
                      </div>
                      <div className="text-sm text-slate-500">
                        {history.confirmedByUsername} &middot;{' '}
                        {new Date(history.confirmedAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-700">
                        {history.memberCount}명
                      </div>
                      <div className="text-xs text-slate-400">
                        {history.paidCount}/{history.transferCount}건 완료
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 지출 상세 모달 */}
      {selectedExpense && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setSelectedExpense(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedExpense.title || '지출'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {selectedExpense.isSettled && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      정산완료
                    </span>
                  )}
                  {selectedExpense.splitType === 'CUSTOM' && (
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                      직접지정
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* 금액 */}
            <div className="text-3xl font-bold text-slate-900">
              {formatAmount(selectedExpense.amount)}원
            </div>

            {/* 기본 정보 */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">결제자</span>
                <span className="text-slate-900 font-medium">{selectedExpense.payerUsername}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">결제일</span>
                <span className="text-slate-900">
                  {selectedExpense.paidAt
                    ? new Date(selectedExpense.paidAt).toLocaleDateString('ko-KR')
                    : new Date(selectedExpense.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">분할 방식</span>
                <span className="text-slate-900">
                  {selectedExpense.splitType === 'CUSTOM' ? '직접지정' : '균등분할'}
                </span>
              </div>
              {selectedExpense.note && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">메모</span>
                  <span className="text-slate-900 text-right">{selectedExpense.note}</span>
                </div>
              )}
            </div>

            {/* 참여자 목록 */}
            {selectedExpense.participants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  참여자 ({selectedExpense.participants.length}명)
                </h3>
                <div className="space-y-1.5">
                  {selectedExpense.participants.map((p) => (
                    <div
                      key={p.userId}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm"
                    >
                      <span className="text-slate-800">{p.username}</span>
                      <span className="text-slate-600 font-medium">
                        {p.amount
                          ? `${formatAmount(p.amount)}원`
                          : `${formatAmount(
                              String(
                                Math.round(
                                  parseFloat(selectedExpense.amount) /
                                    selectedExpense.participants.length
                                )
                              )
                            )}원 (균등)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedExpense(null);
                  navigate(
                    `/organizations/${orgId}/settlements/${groupId}/expenses/${selectedExpense.id}/edit`
                  );
                }}
                disabled={selectedExpense.isSettled}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                수정
              </button>
              <button
                onClick={async () => {
                  await handleDeleteExpense(selectedExpense.id);
                  setSelectedExpense(null);
                }}
                className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
};
