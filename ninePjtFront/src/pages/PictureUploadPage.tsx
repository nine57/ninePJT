import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { Album } from '../types/picture';
import { albumService } from '../services/api/albumService';
import { pictureService } from '../services/api/pictureService';

export const PictureUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [searchParams] = useSearchParams();
  const preselectedAlbumId = searchParams.get('album');

  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(preselectedAlbumId || '');
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!orgId) return;
    albumService.list(Number(orgId)).then(setAlbums).catch(console.error);
  }, [orgId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);

    // Generate previews
    const newPreviews: string[] = [];
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target?.result as string);
        if (newPreviews.length === selectedFiles.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const albumId = selectedAlbumId ? Number(selectedAlbumId) : undefined;

      for (let i = 0; i < files.length; i++) {
        await pictureService.upload(
          Number(orgId),
          files[i],
          albumId,
          caption || undefined
        );
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (albumId) {
        navigate(`/organizations/${orgId}/albums/${albumId}`);
      } else {
        navigate(`/organizations/${orgId}/albums`);
      }
    } catch (err) {
      console.error('업로드 실패', err);
      setError('사진 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
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
        <h1 className="text-2xl font-bold text-slate-900 mb-6">사진 업로드</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-slate-100 rounded-xl bg-white shadow-lg p-6 space-y-4">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                사진 선택 *
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`미리보기 ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Album Select */}
            <div>
              <label htmlFor="album" className="block text-sm font-medium text-slate-700 mb-1">
                앨범
              </label>
              <select
                id="album"
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">앨범 선택 안함</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Caption */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-slate-700 mb-1">
                설명
              </label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="사진에 대한 설명을 입력하세요"
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Progress */}
            {isUploading && (
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>업로드 중...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

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
              disabled={isUploading || files.length === 0}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isUploading ? '업로드 중...' : `업로드 (${files.length}장)`}
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};
