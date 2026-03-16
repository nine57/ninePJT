import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { expenseService, ExpenseShareInput } from '../services/api/expenseService';
import { organizationService } from '../services/api/organizationService';

interface MemberInfo {
  userId: number;
  username: string;
}

export const ExpenseCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId, groupId } = useParams<{ orgId: string; groupId: string }>();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paidAt, setPaidAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 분할 방식
  const [splitType, setSplitType] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [customAmounts, setCustomAmounts] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!orgId) return;
    organizationService.getMembers(Number(orgId)).then((memberList) => {
      setMembers(memberList.map((m) => ({ userId: m.userId, username: m.username })));
    }).catch(() => {});
  }, [orgId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !groupId) return;

    setImage(file);
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await expenseService.analyzeImage({
        image: file,
        group: Number(groupId),
      });

      if (result.expense) {
        if (result.expense.merchant_name) {
          setTitle(result.expense.merchant_name);
        }
        if (result.expense.amount && result.expense.amount !== '0') {
          setAmount(result.expense.amount);
        }
        if (result.expense.memo) {
          setNote(result.expense.memo);
        }
        if (result.expense.paid_at) {
          const date = new Date(result.expense.paid_at);
          setPaidAt(date.toISOString().slice(0, 16));
        }
      }

      alert('영수증 분석이 완료되어 지출이 등록되었습니다.');
      navigate(`/organizations/${orgId}/settlements/${groupId}`);
    } catch (err) {
      console.error('이미지 분석 실패', err);
      setError('이미지 분석에 실패했습니다. 직접 입력해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    if (!groupId || !title.trim() || !amount) return;

    // CUSTOM 검증
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

      await expenseService.create({
        group: Number(groupId),
        title: title.trim(),
        amount: amount,
        note: note.trim() || undefined,
        paid_at: paidAt || undefined,
        split_type: splitType,
        participants,
      });
      navigate(`/organizations/${orgId}/settlements/${groupId}`);
    } catch (err) {
      console.error('지출 생성 실패', err);
      setError('지출을 등록하지 못했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="p-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-slate-700 mb-2"
        >
          &larr; 돌아가기
        </button>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">지출 추가</h1>

        {/* Image Upload */}
        <div className="border border-slate-100 rounded-xl bg-white shadow-lg p-4 mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            영수증 사진으로 자동 입력
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isAnalyzing}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {isAnalyzing && (
            <p className="text-sm text-blue-500 mt-2">영수증을 분석하고 있습니다...</p>
          )}
          {image && !isAnalyzing && (
            <p className="text-sm text-green-500 mt-2">분석 완료! 아래 내용을 확인해주세요.</p>
          )}
        </div>

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
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};
