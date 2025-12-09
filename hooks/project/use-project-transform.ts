'use client';

import * as React from 'react';
import type { CrowdfundingCampaign } from '@/lib/api/types';

interface TransformedProject {
  projectId: string;
  creatorName: string;
  creatorLogo: string;
  projectImage: string;
  projectTitle: string;
  projectDescription: string;
  status: 'Validation' | 'Funding' | 'Funded' | 'Completed';
  deadlineInDays: number;
  funding: {
    current: number;
    goal: number;
    currency: string;
  };
  votes?: {
    current: number;
    goal: number;
  };
}

export function useProjectTransform() {
  const transformProjectForCard = React.useCallback(
    (campaign: CrowdfundingCampaign): TransformedProject => {
      let deadlineInDays: number | null = null;

      try {
        const now = new Date();
        const end = new Date(campaign.fundingEndDate);
        deadlineInDays = Math.ceil(
          (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
      } catch {
        // Handle error silently
        deadlineInDays = null;
      }

      // Map project status to card status
      let cardStatus: 'Validation' | 'Funding' | 'Funded' | 'Completed' =
        'Funding';
      const status = campaign.project.status;
      if (status === 'IDEA') {
        cardStatus = 'Validation';
      } else if (status === 'ACTIVE') {
        cardStatus = 'Funding';
      } else if (status === 'COMPLETED') {
        cardStatus = 'Completed';
      }

      return {
        projectId: campaign.id,
        creatorName: campaign.project.creator?.name || 'Unknown Creator',
        creatorLogo: campaign.project.creator?.image || '/avatar.png',
        projectImage:
          campaign.project.logo || '/landing/explore/project-placeholder-1.png',
        projectTitle: campaign.project.title,
        projectDescription:
          campaign.project.description || campaign.project.vision || '',
        status: cardStatus,
        deadlineInDays: deadlineInDays || 0,
        funding: {
          current: campaign.fundingRaised,
          goal: campaign.fundingGoal,
          currency: campaign.fundingCurrency,
        },
        votes:
          status === 'IDEA'
            ? {
                current: campaign.project.votes || 0,
                goal: 100, // Default goal since voting structure changed
              }
            : undefined,
      };
    },
    []
  );

  return { transformProjectForCard };
}
