import { httpClient } from './httpClient';
import {
  Album,
  AlbumDetail,
  AlbumApiResponse,
  AlbumDetailApiResponse,
  AlbumCreateRequest,
  AlbumUpdateRequest,
} from '../../types/picture';

const mapAlbum = (data: AlbumApiResponse): Album => ({
  id: data.id,
  name: data.name,
  description: data.description,
  pictureCount: data.picture_count,
  createdAt: data.created_at,
});

const mapAlbumDetail = (data: AlbumDetailApiResponse): AlbumDetail => ({
  id: data.id,
  name: data.name,
  description: data.description,
  organizationId: data.organization_id,
  isActive: data.is_active,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const albumService = {
  list: async (orgId: number): Promise<Album[]> => {
    const data = await httpClient.get<AlbumApiResponse[]>(
      `/api/organizations/${orgId}/albums`
    );
    return data.map(mapAlbum);
  },

  get: async (orgId: number, albumId: number): Promise<AlbumDetail> => {
    const data = await httpClient.get<AlbumDetailApiResponse>(
      `/api/organizations/${orgId}/albums/${albumId}`
    );
    return mapAlbumDetail(data);
  },

  create: async (orgId: number, request: AlbumCreateRequest): Promise<AlbumDetail> => {
    const data = await httpClient.post<AlbumDetailApiResponse>(
      `/api/organizations/${orgId}/albums`,
      { body: JSON.stringify(request) }
    );
    return mapAlbumDetail(data);
  },

  update: async (
    orgId: number,
    albumId: number,
    request: AlbumUpdateRequest
  ): Promise<AlbumDetail> => {
    const data = await httpClient.patch<AlbumDetailApiResponse>(
      `/api/organizations/${orgId}/albums/${albumId}`,
      { body: JSON.stringify(request) }
    );
    return mapAlbumDetail(data);
  },

  delete: async (orgId: number, albumId: number): Promise<void> => {
    await httpClient.delete(`/api/organizations/${orgId}/albums/${albumId}`);
  },
};
