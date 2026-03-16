import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { albumService } from '../services/api/albumService';

export const AlbumCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const album = await albumService.create(Number(orgId), {
        name: name.trim(),
        description: description.trim(),
      });
      navigate(`/organizations/${orgId}/albums/${album.id}`);
    } catch (err) {
      console.error('앨범 생성 실패', err);
      setError('앨범을 생성하지 못했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="p-4 pt-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">새 앨범</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-slate-100 rounded-xl bg-white shadow-lg p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                앨범 이름 *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 2024년 여름 여행"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                설명
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="앨범에 대한 설명을 입력하세요"
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

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
              disabled={isSubmitting || !name.trim()}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '생성 중...' : '만들기'}
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};
