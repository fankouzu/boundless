'use client';

import { useEffect, useState } from 'react';
import { getMe } from '@/lib/api/auth';
import { GetMeResponse } from '@/lib/api/types';
import { SectionCards } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { useAuthStatus } from '@/hooks/use-auth';

export function MeDashboard() {
  const { user, isLoading } = useAuthStatus();
  const [meData, setMeData] = useState<GetMeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMe();
        setMeData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading || loading) {
    return <div className='p-8 text-center'>Loading...</div>;
  }

  if (!meData) {
    return <div className='p-8 text-center'>Failed to load data</div>;
  }

  const chartData = meData.chart.map(item => ({
    date: item.date,
    projects: item.count,
  }));

  return (
    <div className='@container/main flex flex-1 flex-col gap-2'>
      <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
        <SectionCards stats={meData.stats} />
        <div className='px-4 lg:px-6'>
          <ChartAreaInteractive
            chartData={chartData}
            title='Activity Overview'
            description='Your activity over time'
          />
        </div>
      </div>
    </div>
  );
}
