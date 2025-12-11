import { useState, useEffect, useCallback } from 'react';
import { EntityType, UseFollowReturn } from '@/types/follow';
import { followApi } from '@/lib/api/follow';
import { useAuth } from './use-auth';

export const useFollow = (
  entityType: EntityType,
  entityId: string,
  initialIsFollowing = false
): UseFollowReturn => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check follow status on mount if user is authenticated
  useEffect(() => {
    if (user && entityId) {
      checkFollowStatus();
    }
  }, [user, entityId, entityType]);

  const checkFollowStatus = useCallback(async () => {
    try {
      const response = await followApi.checkFollowStatus(entityType, entityId);
      setIsFollowing(response.data.isFollowing);
    } catch (err) {
      // Silently fail for status check - don't set error state
      console.warn('Failed to check follow status:', err);
    }
  }, [entityType, entityId]);

  const follow = useCallback(async () => {
    if (!user) {
      setError('You must be logged in to follow');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await followApi.followEntity(entityType, entityId);
      setIsFollowing(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to follow';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsLoading(false);
    }
  }, [user, entityType, entityId]);

  const unfollow = useCallback(async () => {
    if (!user) {
      setError('You must be logged in to unfollow');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await followApi.unfollowEntity(entityType, entityId);
      setIsFollowing(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to unfollow';
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsLoading(false);
    }
  }, [user, entityType, entityId]);

  const toggleFollow = useCallback(async () => {
    if (isFollowing) {
      await unfollow();
    } else {
      await follow();
    }
  }, [isFollowing, follow, unfollow]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isFollowing,
    isLoading,
    follow,
    unfollow,
    toggleFollow,
    error,
    clearError,
  };
};
