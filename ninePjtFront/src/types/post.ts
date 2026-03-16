export interface PostHashtag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  organizationId: number | null;
  authorId: number | null;
  authorUsername: string | null;
  title: string;
  content: string;
  isNotice: boolean;
  isPinned: boolean;
  hashtags: PostHashtag[];
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  is_notice?: boolean;
  is_pinned?: boolean;
  hashtags?: string[];
}

export interface PostUpdateRequest {
  title?: string;
  content?: string;
  is_notice?: boolean;
  is_pinned?: boolean;
  hashtags?: string[];
}


