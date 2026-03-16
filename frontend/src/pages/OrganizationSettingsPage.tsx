import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ApiError } from '../utils/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  Invitation,
  OrganizationDetail,
  OrganizationMember,
  OrganizationUpdateRequest,
} from '../types/organization';
import { organizationService } from '../services/api/organizationService';

export const OrganizationSettingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orgId = Number(id);

  const [organization, setOrganization] = useState<OrganizationDetail | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 조직 정보 수정 상태
  const [editForm, setEditForm] = useState<OrganizationUpdateRequest>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 초대 코드 생성 상태
  const [isCreatingInvitation, setIsCreatingInvitation] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 삭제/탈퇴 상태
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!orgId) return;

    setIsLoading(true);
    setError('');
    try {
      const [orgData, membersData, invitationsData] = await Promise.all([
        organizationService.get(orgId),
        organizationService.getMembers(orgId),
        organizationService.getInvitations(orgId),
      ]);
      setOrganization(orgData);
      setMembers(membersData);
      setInvitations(invitationsData);
      setEditForm({ name: orgData.name, description: orgData.description || '' });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEditChange = (field: keyof OrganizationUpdateRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!organization) return;

    setIsSaving(true);
    try {
      const updated = await organizationService.update(orgId, editForm);
      setOrganization(updated);
      setIsEditing(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateInvitation = async () => {
    setIsCreatingInvitation(true);
    try {
      const invitation = await organizationService.createInvitation(orgId);
      setInvitations((prev) => [invitation, ...prev]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '초대 코드 생성에 실패했습니다.');
    } finally {
      setIsCreatingInvitation(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // 클립보드 접근 실패 시 무시
    }
  };

  const handleDeactivateInvitation = async (invitationId: number) => {
    try {
      await organizationService.deactivateInvitation(orgId, invitationId);
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '초대 코드 비활성화에 실패했습니다.');
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    try {
      await organizationService.removeMember(orgId, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '멤버 제거에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await organizationService.delete(orgId);
      navigate('/organizations/select');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '모임 삭제에 실패했습니다.');
      setIsDeleting(false);
    }
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await organizationService.leave(orgId);
      navigate('/organizations/select');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '탈퇴에 실패했습니다.');
      setIsLeaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
        <p className="text-slate-600">불러오는 중...</p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{error || '모임을 찾을 수 없습니다.'}</p>
          <Button variant="secondary" onClick={() => navigate('/organizations/select')}>
            모임 선택으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">모임 설정</h1>
            <p className="text-sm text-slate-600">{organization.name}</p>
          </div>
          <button
            onClick={() => navigate(`/organizations/${orgId}`)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            돌아가기
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* 조직 정보 수정 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">모임 정보</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                수정
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                id="edit-name"
                type="text"
                label="모임 이름"
                value={editForm.name || ''}
                onChange={handleEditChange('name')}
              />
              <div className="w-full space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  모임 설명
                </label>
                <textarea
                  value={editForm.description || ''}
                  onChange={handleEditChange('description')}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-blue-50 bg-blue-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 shadow-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  저장
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ name: organization.name, description: organization.description || '' });
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-900 font-medium">{organization.name}</p>
              <p className="text-sm text-slate-600">
                {organization.description || '설명 없음'}
              </p>
              <p className="text-xs text-slate-500">
                생성일: {formatDate(organization.createdAt)}
              </p>
            </div>
          )}
        </div>

        {/* 멤버 목록 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              멤버 ({members.length}명)
            </h2>
          </div>

          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-slate-900">{member.username}</p>
                  <p className="text-xs text-slate-500">
                    가입일: {formatDate(member.joinedAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-sm text-rose-600 hover:text-rose-700"
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 초대 코드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">초대 코드</h2>
            <Button
              variant="secondary"
              onClick={handleCreateInvitation}
              isLoading={isCreatingInvitation}
            >
              새 코드 생성
            </Button>
          </div>

          {invitations.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              활성화된 초대 코드가 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div className="space-y-1">
                    <p className="font-mono text-lg font-bold text-blue-600 tracking-wider">
                      {invitation.code}
                    </p>
                    <p className="text-xs text-slate-500">
                      만료: {formatDate(invitation.expiresAt)}
                      {invitation.maxUses > 0 && ` | 사용: ${invitation.useCount}/${invitation.maxUses}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(invitation.code)}
                      className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 bg-blue-50 rounded-lg"
                    >
                      {copiedCode === invitation.code ? '복사됨!' : '복사'}
                    </button>
                    <button
                      onClick={() => handleDeactivateInvitation(invitation.id)}
                      className="text-sm text-rose-600 hover:text-rose-700"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 위험 영역 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-rose-100">
          <h2 className="text-lg font-semibold text-rose-600">위험 영역</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">모임 탈퇴</p>
                <p className="text-sm text-slate-600">이 모임에서 나갑니다.</p>
              </div>
              {showLeaveConfirm ? (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleLeave}
                    isLoading={isLeaving}
                  >
                    확인
                  </Button>
                  <button
                    onClick={() => setShowLeaveConfirm(false)}
                    className="text-sm text-slate-600"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                >
                  탈퇴하기
                </button>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">모임 삭제</p>
                <p className="text-sm text-slate-600">모임을 완전히 삭제합니다.</p>
              </div>
              {showDeleteConfirm ? (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                  >
                    확인
                  </Button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-sm text-slate-600"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                >
                  삭제하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
