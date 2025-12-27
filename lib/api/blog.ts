import api from './api';
// import {
//   getRelatedPosts as getRelatedPostsData,
//   BlogPost as DataBlogPost,
// } from '@/lib/data/blog';
import {
  BlogPost,
  GetBlogPostsRequest,
  GetBlogPostsResponse,
  SearchBlogPostsRequest,
  SearchBlogPostsResponse,
  BlogApiError,
} from '@/types/blog';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

/**
 * Convert data layer BlogPost to API layer BlogPost
 */

/**
 * Get paginated blog posts with filtering and sorting
 */
export const getBlogPosts = async (
  params: GetBlogPostsRequest = {}
): Promise<GetBlogPostsResponse> => {
  try {
    const {
      authorId,
      organizationId,
      status,
      search,
      tags,
      categories,
      includePrivate = false,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      includePrivate: includePrivate.toString(),
    });

    if (authorId) {
      queryParams.append('authorId', authorId);
    }

    if (organizationId) {
      queryParams.append('organizationId', organizationId);
    }

    if (status) {
      queryParams.append('status', status);
    }

    if (search) {
      queryParams.append('search', search);
    }

    if (tags) {
      queryParams.append('tags', tags);
    }

    if (categories) {
      queryParams.append('categories', categories);
    }

    const response = await api.get<ApiResponse<GetBlogPostsResponse>>(
      `/blogs?${queryParams.toString()}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch blog posts: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

/**
 * Get a single blog post by slug
 */
export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  try {
    const response = await api.get<ApiResponse<BlogPost>>(
      `/blogs/slug/${slug}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error in getBlogPost:', error);
    if (error instanceof Error && error.message.includes('404')) {
      throw new Error(`Blog post with slug "${slug}" not found`);
    }
    throw new Error(
      `Failed to fetch blog post: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

/**
 * Search blog posts with full-text search
 */
export const searchBlogPosts = async (
  params: SearchBlogPostsRequest
): Promise<SearchBlogPostsResponse> => {
  try {
    const {
      q,
      page = 1,
      limit = 20,
      categories,
      tags,
      authorId,
      organizationId,
      status,
    } = params;

    if (!q || q.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const queryParams = new URLSearchParams({
      q: q.trim(),
      page: page.toString(),
      limit: limit.toString(),
    });

    if (categories) {
      queryParams.append('categories', categories);
    }

    if (tags) {
      queryParams.append('tags', tags);
    }

    if (authorId) {
      queryParams.append('authorId', authorId);
    }

    if (organizationId) {
      queryParams.append('organizationId', organizationId);
    }

    if (status) {
      queryParams.append('status', status);
    }

    const response = await api.get<ApiResponse<SearchBlogPostsResponse>>(
      `/blog/search?${queryParams.toString()}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error(
      `Failed to search blog posts: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

/**
 * Utility function to build query parameters for blog requests
 */
export const buildBlogQueryParams = (
  params: Record<string, unknown>
): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  return queryParams.toString();
};

/**
 * Utility function to validate blog post slug
 */
export const validateBlogSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
};

/**
 * Utility function to sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().replace(/[<>]/g, '').substring(0, 100);
};

/**
 * Error handling utilities
 */
export const handleBlogApiError = (error: unknown): BlogApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
      code: 'INTERNAL_ERROR',
    };
  }

  return {
    message: 'An unknown error occurred',
    status: 500,
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Check if an error is a blog API error
 */
export const isBlogApiError = (error: unknown): error is BlogApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
};
