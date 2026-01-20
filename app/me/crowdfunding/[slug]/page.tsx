'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { getCrowdfundingProject } from '@/lib/api/project';
import { Crowdfunding } from '@/types/project';

import {
  CampaignBanner,
  ProjectDetails,
  CampaignTabs,
  FundingProgress,
  ProjectLinks,
  TagsSection,
} from './components';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CampaignViewPage({ params }: PageProps) {
  const [campaign, setCampaign] = useState<Crowdfunding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const { slug } = await params;
        const data = await getCrowdfundingProject(slug);
        setCampaign(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [params]);

  if (loading) {
    return (
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        <div className='text-center'>Campaign not found</div>
      </div>
    );
  }

  const project = campaign.project;

  return (
    <div className='container mx-auto max-w-6xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='sm' asChild>
            <Link href='/me/crowdfunding'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-white'>{project.title}</h1>
            <p className='mt-1 text-white/70'>
              {project.vision ? project.vision.slice(0, 100) : ''}...
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/me/crowdfunding/${campaign.slug}/edit`}>
            <Edit className='mr-2 h-4 w-4' />
            Edit Campaign
          </Link>
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <CampaignBanner project={project} />
          <ProjectDetails campaign={campaign} project={project} />
          <CampaignTabs campaign={campaign} />
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          <FundingProgress campaign={campaign} />
          <ProjectLinks project={project} />
          <TagsSection project={project} />
        </div>
      </div>
    </div>
  );
}
