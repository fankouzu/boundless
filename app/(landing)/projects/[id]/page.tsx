'use client';
import { ProjectLayout } from '@/components/project-details/project-layout';
import { ProjectLoading } from '@/components/project-details/project-loading';
import { notFound } from 'next/navigation';
import { getCrowdfundingProject } from '@/lib/api/project';
import type {
  CrowdfundingProject,
  CrowdfundData,
  CrowdfundingCampaign,
} from '@/lib/api/types';
import { useEffect, useState } from 'react';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

function transformCrowdfundingProject(campaign: CrowdfundingCampaign) {
  const creatorName = campaign.project.creator?.name || 'Unknown Creator';

  const daysToDeadline = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.fundingEndDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // Create a project-like object for compatibility with existing components
  const transformedProject: CrowdfundingProject & {
    daysToDeadline: number;
    additionalCreator: {
      name: string;
      role: string;
      avatar: string;
    };
    links: Array<{
      type: string;
      url: string;
      icon: string;
    }>;
    votes: number;
  } = {
    // Required CrowdfundingProject fields
    _id: campaign.project.id,
    title: campaign.project.title,
    description: campaign.project.description,
    category: campaign.project.category,
    status: campaign.project.status,
    creator: {
      profile: {
        firstName: campaign.project.creator?.name?.split(' ')[0] || 'Unknown',
        lastName:
          campaign.project.creator?.name?.split(' ').slice(1).join(' ') ||
          'Creator',
        username: campaign.project.creator?.username || 'unknown',
      },
      _id: campaign.project.creator?.id || '',
    },
    owner: {
      type: 'user' as const,
    },
    vision: campaign.project.vision || campaign.project.description,
    githubUrl: campaign.project.githubUrl,
    projectWebsite: campaign.project.projectWebsite,
    demoVideo: campaign.project.demoVideo,
    socialLinks: campaign.socialLinks.map(link => ({
      platform: link.platform,
      url: link.url,
      _id: `${link.platform}_${Date.now()}`, // Generate ID for compatibility
    })),
    contact: campaign.contact,
    funding: {
      goal: campaign.fundingGoal,
      raised: campaign.fundingRaised,
      currency: campaign.fundingCurrency,
      endDate: campaign.fundingEndDate,
      contributors: campaign.contributors,
    },
    voting: {
      startDate: campaign.createdAt,
      endDate: campaign.fundingEndDate,
      totalVotes: campaign.project.votes || 0,
      positiveVotes: campaign.project.votes || 0,
      negativeVotes: 0,
      voters: [],
    },
    milestones: campaign.milestones.map(milestone => ({
      title: milestone.name,
      description: milestone.description,
      amount: milestone.amount,
      dueDate: milestone.endDate,
      status: milestone.status,
      _id: `milestone_${Date.now()}_${Math.random()}`, // Generate ID
    })),
    team: campaign.team.map(member => ({
      profile: {
        firstName: member.name.split(' ')[0],
        lastName: member.name.split(' ').slice(1).join(' ') || '',
        username: member.email.split('@')[0],
      },
      role: member.role,
      joinedAt: campaign.createdAt,
      _id: `team_${Date.now()}_${Math.random()}`, // Generate ID
    })),
    media: {
      banner: campaign.project.banner || '',
      logo: campaign.project.logo,
      thumbnail: campaign.project.thumbnail || '',
    },
    documents: {
      whitepaper: campaign.project.whitepaperUrl || '',
      pitchDeck: campaign.project.pitchVideoUrl || '',
    },
    tags: campaign.project.tags || [],
    grant: {
      isGrant: false,
      totalBudget: campaign.fundingGoal,
      totalDisbursed: campaign.fundingRaised,
      proposalsReceived: 0,
      proposalsApproved: 0,
      status: 'active',
      applications: [],
    },
    summary: campaign.project.summary || '',
    type: 'crowdfunding',
    votes: campaign.project.votes || 0,
    stakeholders: {
      serviceProvider: campaign.escrowAddress || '',
      approver: campaign.escrowAddress || '',
      releaseSigner: campaign.escrowAddress || '',
      disputeResolver: campaign.escrowAddress || '',
      receiver: campaign.escrowAddress || '',
      platformAddress: '',
    },
    trustlessWorkStatus: campaign.trustlessWorkStatus,
    escrowType: campaign.escrowType,
    createdAt: campaign.project.createdAt,
    updatedAt: campaign.project.updatedAt,
    __v: 0,

    // Additional fields for the component
    daysToDeadline,
    additionalCreator: {
      name: creatorName,
      role: 'OWNER',
      avatar: campaign.project.creator?.image || '/user.png',
    },
    links: [
      ...(campaign.project.githubUrl
        ? [{ type: 'github', url: campaign.project.githubUrl, icon: 'github' }]
        : []),
      ...(campaign.project.projectWebsite
        ? [
            {
              type: 'website',
              url: campaign.project.projectWebsite,
              icon: 'globe',
            },
          ]
        : []),
      ...(campaign.project.demoVideo
        ? [
            {
              type: 'youtube',
              url: campaign.project.demoVideo,
              icon: 'youtube',
            },
          ]
        : []),
      ...(Object.entries(campaign.project.socialLinks || {}).map(
        ([platform, url]) => ({
          type: platform,
          url,
          icon: platform.toLowerCase(),
        })
      ) || []),
    ],
    // Add campaign-specific fields
    escrowAddress: campaign.escrowAddress ?? undefined,
  };

  // Create a crowdfund-like object for compatibility
  const transformedCrowdfund: CrowdfundData = {
    _id: campaign.id,
    projectId: campaign.projectId,
    thresholdVotes: 100, // Default value since this structure changed
    voteDeadline: campaign.fundingEndDate,
    totalVotes: campaign.project.votes || 0,
    status: campaign.project.status === 'IDEA' ? 'voting' : 'active',
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    __v: 0,
    isVotingActive: campaign.project.status === 'IDEA',
    voteProgress: campaign.project.votes || 0,
    id: campaign.id,
  };

  return {
    project: transformedProject,
    crowdfund: transformedCrowdfund,
  };
}

function ProjectContent({ id }: { id: string }) {
  const [projectData, setProjectData] = useState<ReturnType<
    typeof transformCrowdfundingProject
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCrowdfundingProject(id);
        const transformedData = transformCrowdfundingProject(response);
        setProjectData(transformedData);
      } catch (err) {
        console.error('Failed to fetch project data:', err);
        setError('Failed to fetch project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (loading) {
    return <ProjectLoading />;
  }

  if (error || !projectData) {
    notFound();
  }

  return (
    <div className='bg-background-main-bg mx-auto flex min-h-screen max-w-[1440px] flex-col space-y-[60px] px-5 py-5 md:space-y-[80px] md:px-[50px] lg:px-[100px]'>
      <div className='flex-1'>
        <ProjectLayout
          project={projectData.project}
          crowdfund={projectData.crowdfund}
        />
      </div>
    </div>
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  if (!id) {
    return <ProjectLoading />;
  }

  return <ProjectContent id={id} />;
}
