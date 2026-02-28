'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconCurrencyDollar, 
  IconClock, 
  IconCheck, 
  IconArrowUpRight,
  IconTrophy,
  IconBriefcase,
  IconUsers,
  IconTarget
} from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserEarnings, claimEarning, EarningsData, EarningActivity } from '@/lib/api/user/earnings';
import { toast } from 'sonner';

/**
 * Interface for SummaryCard props.
 */
interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

/**
 * SummaryCard component for displaying high-level stats.
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

/**
 * Interface for BreakdownItem props.
 */
interface BreakdownItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

/**
 * BreakdownItem component for showing source-specific earnings.
 */
const BreakdownItem: React.FC<BreakdownItemProps> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
    <span className="font-semibold">${value.toLocaleString()}</span>
  </div>
);

/**
 * Interface for ActivityItem props.
 */
interface ActivityItemProps {
  activity: EarningActivity;
  onClaim: () => void;
  isClaiming: boolean;
}

/**
 * ActivityItem component for displaying a single reward entry.
 */
const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onClaim, isClaiming }) => (
  <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
    <div className="space-y-1">
      <div className="font-semibold flex items-center gap-2">
        {activity.title}
        <Badge variant={activity.status === 'completed' ? 'default' : activity.status === 'pending' ? 'secondary' : 'outline'}>
          {activity.status}
        </Badge>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="capitalize">{activity.source}</span>
        <span>•</span>
        <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
    <div className="text-right space-y-2">
      <p className="font-bold text-lg">${activity.amount.toLocaleString()}</p>
      {activity.status === 'claimable' && (
        <Button size="sm" onClick={onClaim} disabled={isClaiming}>
          {isClaiming ? 'Claiming...' : 'Claim'}
          <IconArrowUpRight className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  </div>
);

/**
 * EarningsSkeleton component for loading states.
 */
const EarningsSkeleton: React.FC = () => (
  <div className="container mx-auto py-8 space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-6 w-[350px]" />
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <Skeleton className="h-[120px] rounded-xl" />
      <Skeleton className="h-[120px] rounded-xl" />
      <Skeleton className="h-[120px] rounded-xl" />
    </div>
    <div className="grid gap-8 md:grid-cols-7">
      <Skeleton className="md:col-span-3 h-[400px] rounded-xl" />
      <Skeleton className="md:col-span-4 h-[400px] rounded-xl" />
    </div>
  </div>
);

/**
 * EarningsPage component for managing and tracking user rewards.
 */
const EarningsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EarningsData | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserEarnings();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch earnings:', error);
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * Handles the claiming of a specific earning activity.
   */
  const handleClaim = async (id: string) => {
    setClaimingId(id);
    try {
      const res = await claimEarning({ activityId: id });
      if (res.success) {
        toast.success('Claim successful!');
        // Refresh data
        const updated = await getUserEarnings();
        if (updated.success && updated.data) {
          setData(updated.data);
        }
      } else {
        toast.error(res.message || 'Claim failed');
      }
    } catch (error) {
      console.error('Failed to claim earning:', error);
      toast.error('An error occurred during claiming');
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return <EarningsSkeleton />;
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-muted-foreground py-8">No earnings data found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Earnings Dashboard</h1>
        <p className="text-muted-foreground text-lg">Manage and track your rewards across the platform.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
          title="Total Earned" 
          value={`$${data.totalEarned.toLocaleString()}`} 
          icon={<IconCurrencyDollar className="h-5 w-5 text-primary" />}
          description="Lifetime earnings"
        />
        <SummaryCard 
          title="Pending Withdrawal" 
          value={`$${data.pendingWithdrawal.toLocaleString()}`} 
          icon={<IconClock className="h-5 w-5 text-yellow-500" />}
          description="Awaiting processing"
        />
        <SummaryCard 
          title="Completed Withdrawal" 
          value={`$${data.completedWithdrawal.toLocaleString()}`} 
          icon={<IconCheck className="h-5 w-5 text-green-500" />}
          description="Successfully cashed out"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Breakdown */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Source Breakdown</CardTitle>
            <CardDescription>Earnings categorized by activity type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BreakdownItem label="Hackathons" value={data.breakdown.hackathons} icon={<IconTrophy className="h-4 w-4" />} />
            <BreakdownItem label="Grants" value={data.breakdown.grants} icon={<IconTarget className="h-4 w-4" />} />
            <BreakdownItem label="Crowdfunding" value={data.breakdown.crowdfunding} icon={<IconUsers className="h-4 w-4" />} />
            <BreakdownItem label="Bounties" value={data.breakdown.bounties} icon={<IconBriefcase className="h-4 w-4" />} />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest wins and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent activity found.</p>
              ) : (
                data.activities.map((activity) => (
                  <ActivityItem 
                    key={activity.id} 
                    activity={activity} 
                    onClaim={() => handleClaim(activity.id)}
                    isClaiming={claimingId === activity.id}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarningsPage;
