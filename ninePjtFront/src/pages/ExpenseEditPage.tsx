import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { expenseService, ExpenseShareInput } from '../services/api/expenseService';
import { organizationService } from '../services/api/organizationService';

interface MemberInfo {
  userId: number;
  username: string;
}

export const ExpenseEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId, groupId: _groupId, expenseId } = useParams<{ orgId: string; groupId: string; expenseId: string }>();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paidAt, setPaidAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [splitType, setSplitType] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!orgId || !expenseId) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [expense, memberList] = await Promise.all([
          expenseService.get(Number(expenseId)),
          organizationService.getMembers(Number(orgId)),
        ]);

        setTitle(expense.title || '');
        setAmount(expense.amount || '');
        setNote(expense.note || '');
        if (expense.paidAt) {
          const date = new Date(expense.paidAt);
          setPaidAt(date.toISOString().slice(0, 16));
        }
        setSplitType(expense.splitType === 'CUSTOM' ? 'CUSTOM' : 'EQUAL');
        setMembers(memberList.map((m) => ({ userId: m.userId, username: m.username })));

        if (expense.participants.length > 0) {
          setSelectedUserIds(new Set(expense.participants.map((p) => p.userId)));
          const amounts: Record<number, string> = {};
          expense.participants.forEach((p) => {
            if (p.amount) amounts[p.userId] = p.amount;
          });
          setCustomAmounts(amounts);
        }
      } catch (err) {
        console.error('데이터 로딩 실패', err);
        setError('지출 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [orgId, expenseId]);

  const toggleParticipant = (userId: number) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleCustomAmountChange = (userId: number, value: string) => {
    setCustomAmounts((prev) => ({ ...prev, [userId]: value }));
  };

  const customTotal = Array.from(selectedUserIds).reduce((sum, uid) => {
    const val = parseFloat(customAmounts[uid] || '0');
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseId || !title.trim() || !amount) return;

    if (splitType === 'CUSTOM' && selectedUserIds.size > 0) {
      const amountNum = parseFloat(amount);
      if (Math.abs(customTotal - amountNum) > 0.01) {
        setError(`참여자 금액 합계(${customTotal.toLocaleString()})가 총 금액(${amountNum.toLocaleString()})과 일치하지 않습니다.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let participants: ExpenseShareInput[] | undefined;
      if (selectedUserIds.size > 0) {
        participants = Array.from(selectedUserIds).map((uid) => {
          const share: ExpenseShareInput = { user_id: uid };
          if (splitType === 'CUSTOM' && customAmounts[uid]) {
            share.amount = customAmounts[uid];
          }
          return share;
        });
      }

      await expenseService.update(Number(expenseId), {
        title: title.trim(),
        amount,
        note: note.trim() || undefined,
        paid_at: paidAt || undefined,
        split_type: splitType,
        participants,
      });
      navigate(-1);
    } catch (err) {
      console.error('지출 수정 실패', err);
      setError('지출을 수정하지 못했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <MobileLayout>
      <div className="p-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-slate-700 mb-2"
        >
          &larr; 돌아가기
        </button>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">지출 수정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-slate-100 rounded-xl bg-white shadow-lg p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                지출 내용 *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 점심 식사"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
                금액 *
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="paidAt" className="block text-sm font-medium text-slate-700 mb-1">
                지출 일시
              </label>
              <input
                id="paidAt"
                type="datetime-local"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-1">
                메모
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="추가 메모를 입력하세요"
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* 분할 방식 */}
          <div className="border border-slate-100 rounded-xl bg-white shadow-lg p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-700">분할 방식</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSplitType('EQUAL')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  splitType === 'EQUAL'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                균등 분할
              </button>
              <button
                type="button"
                onClick={() => setSplitType('CUSTOM')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  splitType === 'CUSTOM'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                직접 지정
              </button>
            </div>

            {/* 참여자 선택 */}
            {members.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  참여자 선택 {selectedUserIds.size > 0 && `(${selectedUserIds.size}명)`}
                </h3>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.userId} className="flex items-center gap-3">
                      <label className="flex items-center gap-2 flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.has(member.userId)}
                          onChange={() => toggleParticipant(member.userId)}
                          className="w-4 h-4 text-blue-500 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">{member.username}</span>
                      </label>
                      {splitType === 'CUSTOM' && selectedUserIds.has(member.userId) && (
                        <input
                          type="number"
                          value={customAmounts[member.userId] || ''}
                          onChange={(e) => handleCustomAmountChange(member.userId, e.target.value)}
                          placeholder="금액"
                          className="w-28 px-3 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
                {splitType === 'CUSTOM' && selectedUserIds.size > 0 && amount && (
                  <div className={`mt-3 text-sm ${Math.abs(customTotal - parseFloat(amount)) < 0.01 ? 'text-green-600' : 'text-red-500'}`}>
                    합계: {customTotal.toLocaleString()}원 / {parseFloat(amount).toLocaleString()}원
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !amount}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};
