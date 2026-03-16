import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { AlbumDetail } from '../types/picture';
import { Picture, pictureService } from '../services/api/pictureService';
import { albumService } from '../services/api/albumService';

export const AlbumDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId, albumId } = useParams<{ orgId: string; albumId: string }>();
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);

  useEffect(() => {
    if (!orgId || !albumId) return;

    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [albumData, picturesData] = await Promise.all([
          albumService.get(Number(orgId), Number(albumId)),
          pictureService.list({ album: Number(albumId) }),
        ]);
        if (!isMounted) return;
        setAlbum(albumData);
        setPictures(picturesData);
      } catch (err) {
        if (!isMounted) return;
        console.error('데이터 로딩 실패', err);
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [orgId, albumId]);

  const handleDeletePicture = async (pictureId: number) => {
    if (!confirm('이 사진을 삭제하시겠습니까?')) return;
    try {
      await pictureService.delete(pictureId);
      setPictures(pictures.filter((p) => p.id !== pictureId));
      setSelectedPicture(null);
    } catch (err) {
      console.error('사진 삭제 실패', err);
      alert('사진 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-slate-500">불러오는 중...</div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-red-500">{error || '앨범을 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <MobileLayout>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(`/organizations/${orgId}/albums`)}
              className="text-sm text-slate-500 hover:text-slate-700 mb-1"
            >
              &larr; 앨범 목록
            </button>
            <h1 className="text-2xl font-bold text-slate-900">{album.name}</h1>
            {album.description && (
              <p className="text-sm text-slate-600 mt-1">{album.description}</p>
            )}
          </div>
          <button
            onClick={() => navigate(`/organizations/${orgId}/pictures/upload?album=${albumId}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            사진 추가
          </button>
        </div>

        {/* Pictures Grid */}
        {pictures.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            아직 사진이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {pictures.map((picture) => (
              <div
                key={picture.id}
                onClick={() => setSelectedPicture(picture)}
                className="aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={picture.fileUrl}
                  alt={picture.caption || '사진'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📷</text></svg>';
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Picture Modal */}
        {selectedPicture && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPicture(null)}
          >
            <div
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedPicture.fileUrl}
                  alt={selectedPicture.caption || '사진'}
                  className="w-full max-h-[70vh] object-contain bg-black"
                />
                <button
                  onClick={() => setSelectedPicture(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                {selectedPicture.caption && (
                  <p className="text-slate-700 mb-2">{selectedPicture.caption}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {new Date(selectedPicture.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                  <button
                    onClick={() => handleDeletePicture(selectedPicture.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};
