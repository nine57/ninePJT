import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { OrganizationMember } from '../types/organization';
import { organizationService } from '../services/api/organizationService';

export const MemberListPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    let isMounted = true;
    const loadMembers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await organizationService.getMembers(Number(orgId));
        if (!isMounted) return;
        setMembers(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('멤버 목록 로딩 실패', err);
        setError('멤버 목록을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadMembers();
    return () => {
      isMounted = false;
    };
  }, [orgId]);

  const handleRemoveMember = async (member: OrganizationMember) => {
    if (!orgId) return;
    if (!confirm(`${member.username}님을 모임에서 제거하시겠습니까?`)) return;

    try {
      await organizationService.removeMember(Number(orgId), member.id);
      setMembers(members.filter((m) => m.id !== member.id));
    } catch (err) {
      console.error('멤버 제거 실패', err);
      alert('멤버 제거에 실패했습니다.');
    }
  };

  const handleLeave = async () => {
    if (!orgId) return;
    if (!confirm('정말 이 모임을 탈퇴하시겠습니까?')) return;

    try {
      await organizationService.leave(Number(orgId));
      navigate('/organizations/select');
    } catch (err) {
      console.error('모임 탈퇴 실패', err);
      alert('모임 탈퇴에 실패했습니다.');
    }
  };

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
            <h1 className="text-xl font-bold text-slate-900">멤버 관리</h1>
          </div>
          <button
            onClick={() => navigate(`/organizations/${orgId}/invitations`)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
          >
            초대하기
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-slate-500 py-12">불러오는 중...</div>
        )}

        {!isLoading && error && (
          <div className="text-center text-red-500 py-12">{error}</div>
        )}

        {!isLoading && !error && (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {member.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{member.username}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(member.joinedAt).toLocaleDateString('ko-KR')} 가입
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMember(member)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Leave Organization */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={handleLeave}
            className="w-full py-3 text-red-500 hover:text-red-700 font-medium"
          >
            모임 탈퇴하기
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};
