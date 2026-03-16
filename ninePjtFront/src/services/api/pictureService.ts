import { API_BASE_URL, API_ENDPOINTS } from '../../constants/api';
import { getAccessToken } from '../../utils/token';
import { httpClient } from './httpClient';

// ===== API 응답 타입 (snake_case) =====

export interface PictureApiResponse {
  id: number;
  organization: number;
  album: number | null;
  album_name: string | null;
  file_url: string;
  caption: string;
  created_at: string;
  updated_at: string;
}

// ===== 프론트엔드 모델 (camelCase) =====

export interface Picture {
  id: number;
  organization: number;
  album: number | null;
  albumName: string | null;
  fileUrl: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
}

// ===== 요청 타입 =====

export interface PictureCreateRequest {
  organization: number;
  file_path: string;
  caption?: string;
  album?: number;
}

export interface PictureUpdateRequest {
  caption?: string;
  album?: number;
}

export interface FetchPicturesParams {
  organization?: number;
  album?: number;
}

// ===== 변환 함수 =====

const mapPicture = (data: PictureApiResponse): Picture => ({
  id: data.id,
  organization: data.organization,
  album: data.album,
  albumName: data.album_name,
  fileUrl: data.file_url,
  caption: data.caption,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

// ===== 서비스 =====

export const pictureService = {
  list: async (params?: FetchPicturesParams): Promise<Picture[]> => {
    const data = await httpClient.get<PictureApiResponse[]>(API_ENDPOINTS.PICTURES, {
      params: params as Record<string, number>,
    });
    return data.map(mapPicture);
  },

  get: async (id: number): Promise<Picture> => {
    const data = await httpClient.get<PictureApiResponse>(`${API_ENDPOINTS.PICTURES}/${id}`);
    return mapPicture(data);
  },

  create: async (request: PictureCreateRequest): Promise<Picture> => {
    const data = await httpClient.post<PictureApiResponse>(API_ENDPOINTS.PICTURES, {
      body: JSON.stringify(request),
    });
    return mapPicture(data);
  },

  upload: async (
    organizationId: number,
    image: File,
    albumId?: number,
    caption?: string
  ): Promise<Picture> => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('인증이 필요합니다.');
    }

    const formData = new FormData();
    formData.append('image', image);

    let url = `${API_BASE_URL}${API_ENDPOINTS.PICTURES}/upload?organization=${organizationId}`;
    if (albumId) {
      url += `&album=${albumId}`;
    }
    if (caption) {
      url += `&caption=${encodeURIComponent(caption)}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || '업로드 실패');
    }

    const data = await response.json();
    return mapPicture(data);
  },

  update: async (id: number, request: PictureUpdateRequest): Promise<Picture> => {
    const data = await httpClient.patch<PictureApiResponse>(`${API_ENDPOINTS.PICTURES}/${id}`, {
      body: JSON.stringify(request),
    });
    return mapPicture(data);
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.PICTURES}/${id}`);
  },

};
