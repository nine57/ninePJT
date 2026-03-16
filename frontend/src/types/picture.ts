export interface Album {
  id: number;
  name: string;
  description: string;
  pictureCount: number;
  createdAt: string;
}

export interface AlbumDetail {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

// API Response types (snake_case)
export interface AlbumApiResponse {
  id: number;
  name: string;
  description: string;
  picture_count: number;
  created_at: string;
}

export interface AlbumDetailApiResponse {
  id: number;
  name: string;
  description: string;
  organization_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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

// Request types
export interface AlbumCreateRequest {
  name: string;
  description?: string;
}

export interface AlbumUpdateRequest {
  name?: string;
  description?: string;
}

export interface PictureUpdateRequest {
  caption?: string;
  album?: number;
}
