import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { Invitation } from '../types/organization';
import { organizationService } from '../services/api/organizationService';

export const InvitationManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    let isMounted = true;
    const loadInvitations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await organizationService.getInvitations(Number(orgId));
        if (!isMounted) return;
        setInvitations(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('초대 코드 목록 로딩 실패', err);
        setError('초대 코드 목록을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadInvitations();
    return () => {
      isMounted = false;
    };
  }, [orgId]);

  const handleCreateInvitation = async () => {
    if (!orgId) return;
    setIsCreating(true);
    try {
      const invitation = await organizationService.createInvitation(Number(orgId), {
        expires_hours: 24,
        max_uses: 0,
      });
      setInvitations([invitation, ...invitations]);
    } catch (err) {
      console.error('초대 코드 생성 실패', err);
      alert('초대 코드 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeactivate = async (invitation: Invitation) => {
    if (!orgId) return;
    if (!confirm('이 초대 코드를 비활성화하시겠습니까?')) return;

    try {
      await organizationService.deactivateInvitation(Number(orgId), invitation.id);
      setInvitations(
        invitations.map((inv) =>
          inv.id === invitation.id ? { ...inv, isActive: false } : inv
        )
      );
    } catch (err) {
      console.error('초대 코드 비활성화 실패', err);
      alert('초대 코드 비활성화에 실패했습니다.');
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('복사 실패', err);
    }
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <MobileLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-slate-500 hover:text-slate-700 mb-1"
            >
              &larr; 돌아가기
            </button>
            <h1 className="text-xl font-bold text-slate-900">초대 코드</h1>
          </div>
          <button
            onClick={handleCreateInvitation}
            disabled={isCreating}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm disabled:bg-slate-300"
          >
            {isCreating ? '생성 중...' : '새 코드'}
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-slate-500 py-12">불러오는 중...</div>
        )}

        {!isLoading && error && (
          <div className="text-center text-red-500 py-12">{error}</div>
        )}

        {!isLoading && !error && invitations.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <p className="mb-4">아직 초대 코드가 없습니다.</p>
            <button
              onClick={handleCreateInvitation}
              disabled={isCreating}
              className="text-blue-500 hover:underline"
            >
              새 초대 코드를 만들어보세요
            </button>
          </div>
        )}

        {!isLoading && !error && invitations.length > 0 && (
          <div className="space-y-3">
            {invitations.map((invitation) => {
              const expired = isExpired(invitation.expiresAt);
              const inactive = !invitation.isActive || expired;

              return (
                <div
                  key={invitation.id}
                  className={`p-4 bg-white rounded-xl border shadow-lg ${
                    inactive ? 'border-slate-200 opacity-60' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <code className="text-lg font-mono font-bold text-slate-900">
                        {invitation.code}
                      </code>
                      <button
                        onClick={() => handleCopyCode(invitation.code)}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        {copiedCode === invitation.code ? '복사됨!' : '복사'}
                      </button>
                    </div>
                    {inactive ? (
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                        {expired ? '만료됨' : '비활성'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeactivate(invitation)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        비활성화
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>
                      만료: {new Date(invitation.expiresAt).toLocaleString('ko-KR')}
                    </span>
                    <span>
                      사용: {invitation.useCount}
                      {invitation.maxUses > 0 ? `/${invitation.maxUses}` : '회'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};
