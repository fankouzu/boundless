/* eslint-disable @typescript-eslint/no-unused-vars */
import { CrowdfundingProject, Crowdfunding } from '@/types/project';
import api from './api';
import {
  ProjectInitRequest,
  CreateCrowdfundingProjectRequest,
  CreateCrowdfundingProjectResponse,
  GetCrowdfundingProjectsResponse,
  UpdateCrowdfundingProjectRequest,
  UpdateCrowdfundingProjectResponse,
  DeleteCrowdfundingProjectResponse,
  FundCrowdfundingProjectRequest,
  FundCrowdfundingProjectResponse,
  CrowdfundingCampaign,
  VoteResponse,
  GetProjectVotesRequest,
  GetProjectVotesResponse,
  RemoveVoteResponse,
} from './types';

export const initProject = async (data: ProjectInitRequest) => {
  const res = await api.post('/projects', data);
  return res;
};

export const getProjects = async (
  page = 1,
  limit = 9,
  filters?: {
    status?: string;
    owner?: string;
  }
): Promise<{
  projects: CrowdfundingProject[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }

  if (filters?.owner) {
    params.append('owner', filters.owner);
  }

  const res = await api.get(`/projects?${params.toString()}`);
  return res.data.data;
};

export const getProjectDetails = async (_projectId: string) => {
  const res = await api.get(`/projects/${_projectId}`);
  return res.data.data;
};

export const deleteProject = async (_projectId: string) => {
  const res = await api.delete(`/projects/${_projectId}`);
  return res.data.data;
};

export const updateProject = async (
  _projectId: string,
  data: ProjectInitRequest
) => {
  const res = await api.put(`/projects/${_projectId}`, data);
  return res.data.data;
};

export const generateCampaignLink = async (_projectId: string) => {
  // Mock implementation for now
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          shareLink: 'https://boundlessfi.xyz/campaigns/' + _projectId,
        },
      });
    }, 500);
  });
};

/**
 * Create a crowdfunding project
 * Frontend handles all blockchain transactions and provides escrow data
 * @param data - Project data including escrowId, transactionHash, and validateMilestones
 */
export const createCrowdfundingProject = async (
  data: CreateCrowdfundingProjectRequest
): Promise<CreateCrowdfundingProjectResponse> => {
  const res = await api.post('/crowdfunding', data);
  return res.data;
};

// Crowdfunding Project API Functions

/**
 * Get all crowdfunding projects with pagination and filtering
 */
export const getCrowdfundingProjects = async (
  page = 1,
  limit = 10,
  filters?: {
    category?: string;
    status?: string;
    minFundingGoal?: string;
    maxFundingGoal?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }
): Promise<GetCrowdfundingProjectsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.category) {
    params.append('category', filters.category);
  }

  if (filters?.status) {
    params.append('status', filters.status);
  }

  if (filters?.minFundingGoal) {
    params.append('minFundingGoal', filters.minFundingGoal);
  }

  if (filters?.maxFundingGoal) {
    params.append('maxFundingGoal', filters.maxFundingGoal);
  }

  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy);
  }

  if (filters?.sortOrder) {
    params.append('sortOrder', filters.sortOrder);
  }

  if (filters?.search) {
    params.append('search', filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `/crowdfunding?${queryString}` : '/crowdfunding';

  const res = await api.get(url);
  return res.data;
};

/**
 * Get authenticated user's crowdfunding campaigns
 * Get a paginated list of crowdfunding campaigns created by the authenticated user
 *
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @param filters - Optional filters for the campaigns
 * @param filters.category - Category of the campaign
 * @param filters.status - Status of the campaign
 * @param filters.minFundingGoal - Minimum funding goal of the campaign
 * @param filters.maxFundingGoal - Maximum funding goal of the campaign
 * @param filters.sortBy - Sort by field
 * @param filters.sortOrder - Sort order ('asc' | 'desc')
 * @param filters.search - Search term for campaigns
 * @returns Promise<GetCrowdfundingProjectsResponse>
 */
export const getMyCrowdfundingProjects = async (
  page = 1,
  limit = 3,
  filters?: {
    category?: string;
    status?: string;
    minFundingGoal?: number;
    maxFundingGoal?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }
): Promise<{
  success: boolean;
  message: string;
  data: {
    data: CrowdfundingCampaign[];
  };
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.category) {
    params.append('category', filters.category);
  }

  if (filters?.status) {
    params.append('status', filters.status);
  }

  if (filters?.minFundingGoal !== undefined) {
    params.append('minFundingGoal', filters.minFundingGoal.toString());
  }

  if (filters?.maxFundingGoal !== undefined) {
    params.append('maxFundingGoal', filters.maxFundingGoal.toString());
  }

  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy);
  }

  if (filters?.sortOrder) {
    params.append('sortOrder', filters.sortOrder);
  }

  if (filters?.search) {
    params.append('search', filters.search);
  }

  const queryString = params.toString();
  const url = queryString
    ? `/crowdfunding/me?${queryString}`
    : '/crowdfunding/me';

  const res = await api.get(url);
  return res.data;
};

/**
 * Get a single crowdfunding project by ID
 */
export const getCrowdfundingProject = async (
  projectId: string
): Promise<Crowdfunding> => {
  const res = await api.get(`/crowdfunding/${projectId}`);
  return res.data.data;
};

/**
 * Get detailed information about a specific milestone
 * @param projectId - Campaign ID or slug
 * @param milestoneIndex - Milestone index (0-based)
 * @returns Promise with milestone details
 */
export const getCrowdfundingMilestone = async (
  projectId: string,
  milestoneIndex: number
): Promise<any> => {
  const res = await api.get(
    `/crowdfunding/${projectId}/milestones/${milestoneIndex}`
  );
  return res.data.data;
};

/**
 * Validate milestone submission data before blockchain interaction
 * Strictly validates milestone submission data (status, evidence, documents) without performing any side effects.
 * Use this before blockchain interaction to ensure data integrity.
 *
 * @param campaignIdOrSlug - Campaign ID or slug
 * @param milestoneIndex - Milestone index (0-based)
 * @param data - Submission data to validate
 * @param data.evidence - Evidence of milestone completion (min 10 characters, at least 3 words)
 * @param data.status - Milestone status (completed | in_review | submitted)
 * @param data.documents - Optional array of document URLs as supporting evidence
 * @returns Promise with validation result
 */
export const validateMilestoneSubmission = async (
  campaignIdOrSlug: string,
  milestoneIndex: number,
  data: {
    evidence: string;
    status: 'completed' | 'in_review' | 'submitted';
    documents?: string[];
  }
): Promise<{
  validated: boolean;
  data?: {
    status: string;
    evidence: string;
    documents?: string[];
  };
  error?: string;
}> => {
  const res = await api.post(
    `/crowdfunding/${campaignIdOrSlug}/milestones/${milestoneIndex}/validate-submission`,
    data
  );
  return res.data.data;
};

/**
 * Update milestone status with optional evidence and documents
 * When submitting milestone completion, evidence is required and will be strictly validated.
 *
 * @param campaignIdOrSlug - Campaign ID or slug
 * @param milestoneIndex - Milestone index (0-based)
 * @param data - Update data
 * @param data.status - Milestone status (pending | in_progress | completed | cancelled)
 * @param data.evidence - Evidence of milestone completion (required for submission, min 10 characters)
 * @param data.documents - Array of document URLs as evidence
 * @param data.completedAt - Date when milestone was completed
 * @param data.releaseTransactionHash - Transaction hash for fund release
 * @returns Promise with updated milestone data
 */
export const updateMilestone = async (
  campaignIdOrSlug: string,
  milestoneIndex: number,
  data: {
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    evidence?: string;
    documents?: string[];
    completedAt?: string;
    releaseTransactionHash?: string;
  }
): Promise<any> => {
  const res = await api.put(
    `/crowdfunding/${campaignIdOrSlug}/milestones/${milestoneIndex}`,
    data
  );
  return res.data;
};

/**
 * Update a crowdfunding project
 */
export const updateCrowdfundingProject = async (
  projectId: string,
  data: UpdateCrowdfundingProjectRequest
): Promise<UpdateCrowdfundingProjectResponse> => {
  const res = await api.put(`/crowdfunding/${projectId}`, data);
  return res.data;
};

/**
 * Delete a crowdfunding project
 */
export const deleteCrowdfundingProject = async (
  projectId: string
): Promise<DeleteCrowdfundingProjectResponse> => {
  const res = await api.delete(`/crowdfunding/${projectId}`);
  return res.data;
};

/**
 * Fund a crowdfunding project
 * Frontend handles all blockchain transactions and provides transaction hash
 * @param projectId - The ID of the project to fund
 * @param data - Funding data including amount and transactionHash
 */
export const fundCrowdfundingProject = async (
  projectId: string,
  data: FundCrowdfundingProjectRequest
): Promise<FundCrowdfundingProjectResponse> => {
  const res = await api.post(`/crowdfunding/projects/${projectId}/fund`, data);
  return res.data;
};

export const voteProject = async (
  projectId: string,
  value: 1 | -1 = 1
): Promise<VoteResponse> => {
  const res = await api.post(`/projects/${projectId}/vote`, { value });
  return res.data;
};

/**
 * Get votes for a project with pagination and filtering
 */
export const getProjectVotes = async (
  projectId: string,
  params?: GetProjectVotesRequest
): Promise<GetProjectVotesResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }

  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  if (params?.voteType) {
    queryParams.append('voteType', params.voteType);
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `/projects/${projectId}/votes?${queryString}`
    : `/projects/${projectId}/votes`;

  const res = await api.get(url);
  return res.data;
};

/**
 * Remove user's vote from a project
 */
export const removeProjectVote = async (
  projectId: string
): Promise<RemoveVoteResponse> => {
  const res = await api.delete(`/projects/${projectId}/vote`);
  return res.data;
};

export const contributeToProject = async (
  projectId: string,
  data: FundCrowdfundingProjectRequest
): Promise<FundCrowdfundingProjectResponse> => {
  const res = await api.post(`/crowdfunding/${projectId}/contribute`, data);
  return res.data;
};
