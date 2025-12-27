export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  coverImage: string;
  date: string;
  slug: string;
  categories: string[];
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  tags: string[];
  readTime: number;
  createdAt: string;
  updatedAt?: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
  icon: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
}

export interface GetBlogPostsRequest {
  authorId?: string;
  organizationId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  search?: string;
  tags?: string;
  categories?: string;
  includePrivate?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface GetRelatedPostsRequest {
  limit?: number;
}

export interface SearchBlogPostsRequest {
  q: string;
  page?: number;
  limit?: number;
  categories?: string;
  tags?: string;
  authorId?: string;
  organizationId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface GetBlogPostsResponse {
  data: BlogPost[];
  hasMore: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface GetBlogPostResponse {
  post: BlogPost;
}

export interface GetRelatedPostsResponse {
  posts: BlogPost[];
}

export interface GetCategoriesResponse {
  categories: BlogCategory[];
}

export interface GetTagsResponse {
  tags: BlogTag[];
}

export interface SearchBlogPostsResponse {
  posts: BlogPost[];
  hasMore: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
  query: string;
}

export interface BlogApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}
