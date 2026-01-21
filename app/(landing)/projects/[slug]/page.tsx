'use client';
import { ProjectLayout } from '@/components/project-details/project-layout';
import { ProjectLoading } from '@/components/project-details/project-loading';
import { notFound } from 'next/navigation';
import { getCrowdfundingProject } from '@/lib/api/project';
import type { Crowdfunding } from '@/types/project';
import { use, useEffect, useState } from 'react';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [project, setProject] = useState<Crowdfunding | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectData = await getCrowdfundingProject(slug);
        setProject(projectData);
      } catch {
        setError('Failed to fetch project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [slug]);

  if (loading) {
    return <ProjectLoading />;
  }

  if (error || !project) {
    notFound();
  }

  return (
    <div className='mx-auto flex min-h-screen max-w-[1440px] flex-col space-y-[60px] px-5 py-5 md:space-y-20 md:px-[50px] lg:px-[100px]'>
      <div className='flex-1'>
        <ProjectLayout project={project.project} crowdfund={project} />
      </div>
    </div>
  );
}
