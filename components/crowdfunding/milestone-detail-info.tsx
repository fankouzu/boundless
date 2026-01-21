'use client';

import { Calendar, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Milestone, Crowdfunding } from '@/types/project';

interface MilestoneDetailInfoProps {
  milestone: Milestone;
  campaign: Crowdfunding;
}

export function MilestoneDetailInfo({
  milestone,
  campaign,
}: MilestoneDetailInfoProps) {
  const totalMilestoneAmount =
    campaign.milestones?.reduce((sum, m) => sum + m.amount, 0) || 0;
  const milestonePercentage =
    totalMilestoneAmount > 0
      ? ((milestone.amount / totalMilestoneAmount) * 100).toFixed(1)
      : '0';

  return (
    <div className='grid grid-cols-1 gap-6 py-6 md:grid-cols-3'>
      {/* Amount */}
      <div className='flex flex-col space-y-2'>
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <Target className='h-4 w-4' />
          <span>Target Amount</span>
        </div>
        <div className='flex items-baseline gap-2'>
          <span className='text-2xl font-semibold'>
            {campaign.fundingCurrency} {milestone.amount.toLocaleString()}
          </span>
          <span className='text-muted-foreground text-sm'>
            ({milestonePercentage}% of total)
          </span>
        </div>
      </div>

      {/* Start Date */}
      <div className='flex flex-col space-y-2'>
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <Calendar className='h-4 w-4' />
          <span>Start Date</span>
        </div>
        <time className='text-lg font-semibold'>
          {format(new Date(milestone.startDate), 'MMM d, yyyy')}
        </time>
      </div>

      {/* Due Date */}
      <div className='flex flex-col space-y-2'>
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <Calendar className='h-4 w-4' />
          <span>Due Date</span>
        </div>
        <time className='text-lg font-semibold'>
          {format(new Date(milestone.endDate), 'MMM d, yyyy')}
        </time>
      </div>
    </div>
  );
}
