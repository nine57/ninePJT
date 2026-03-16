import { API_ENDPOINTS } from '../../constants/api';
import { Post, PostCreateRequest, PostUpdateRequest } from '../../types/post';
import { httpClient } from './httpClient';

export interface FetchPostsParams {
  organization?: number;
  isNotice?: boolean;
}

interface PostApiResponse {
  id: number;
  organization_id: number | null;
  author_id: number | null;
  author_username: string | null;
  title: string;
  content: string;
  is_notice: boolean;
  is_pinned: boolean;
  hashtags: {
    id: number;
    name: string;
  }[];
  created_at: string;
  updated_at: string;
}

const mapPost = (data: PostApiResponse): Post => ({
  id: data.id,
  organizationId: data.organization_id,
  authorId: data.author_id,
  authorUsername: data.author_username,
  title: data.title,
  content: data.content,
  isNotice: data.is_notice,
  isPinned: data.is_pinned,
  hashtags: data.hashtags ?? [],
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const postsService = {
  async list(params: FetchPostsParams = {}): Promise<Post[]> {
    const response = await httpClient.get<PostApiResponse[]>(API_ENDPOINTS.POSTS, {
      params: {
        organization: params.organization,
        is_notice: typeof params.isNotice === 'boolean' ? params.isNotice : undefined,
      },
    });
    return response.map(mapPost);
  },

  async get(id: number): Promise<Post> {
    const response = await httpClient.get<PostApiResponse>(`${API_ENDPOINTS.POSTS}/${id}`);
    return mapPost(response);
  },

  async create(organizationId: number, data: PostCreateRequest): Promise<Post> {
    const response = await httpClient.post<PostApiResponse>(
      `${API_ENDPOINTS.POSTS}?organization=${organizationId}`,
      { body: JSON.stringify(data) }
    );
    return mapPost(response);
  },

  async update(id: number, data: PostUpdateRequest): Promise<Post> {
    const response = await httpClient.patch<PostApiResponse>(`${API_ENDPOINTS.POSTS}/${id}`, {
      body: JSON.stringify(data),
    });
    return mapPost(response);
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`${API_ENDPOINTS.POSTS}/${id}`);
  },
};


