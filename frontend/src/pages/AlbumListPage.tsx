import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { Album } from '../types/picture';
import { albumService } from '../services/api/albumService';

export const AlbumListPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    let isMounted = true;
    const loadAlbums = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await albumService.list(Number(orgId));
        if (!isMounted) return;
        setAlbums(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('앨범 목록 로딩 실패', err);
        setError('앨범 목록을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadAlbums();
    return () => {
      isMounted = false;
    };
  }, [orgId]);

  return (
    <MobileLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">앨범</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/organizations/${orgId}/pictures/upload`)}
              className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
            >
              업로드
            </button>
            <button
              onClick={() => navigate(`/organizations/${orgId}/albums/create`)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
            >
              새 앨범
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center text-slate-500 py-12">불러오는 중...</div>
        )}

        {!isLoading && error && (
          <div className="text-center text-red-500 py-12">{error}</div>
        )}

        {!isLoading && !error && albums.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <p className="mb-4">아직 앨범이 없습니다.</p>
            <button
              onClick={() => navigate(`/organizations/${orgId}/albums/create`)}
              className="text-blue-500 hover:underline"
            >
              첫 번째 앨범을 만들어보세요
            </button>
          </div>
        )}

        {!isLoading && !error && albums.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {albums.map((album) => (
              <article
                key={album.id}
                onClick={() => navigate(`/organizations/${orgId}/albums/${album.id}`)}
                className="border border-slate-100 rounded-xl bg-white shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl text-slate-300">📷</span>
                </div>
                <h2 className="font-bold text-slate-900 truncate">{album.name}</h2>
                <p className="text-sm text-slate-500">{album.pictureCount}장</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};
