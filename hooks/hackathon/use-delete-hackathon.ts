'use client';

import { useState, useCallback } from 'react';
import { deleteHackathon } from '@/lib/api/hackathons';
import { deleteDraft } from '@/lib/api/hackathons/draft';
import { useAuthStatus } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface UseDeleteHackathonOptions {
  organizationId: string;
  hackathonId: string;
  isDraft?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteHackathon({
  organizationId,
  hackathonId,
  isDraft = false,
  onSuccess,
  onError,
}: UseDeleteHackathonOptions) {
  const { isAuthenticated } = useAuthStatus();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteHackathonAction = useCallback(async () => {
    const targetLabel = isDraft ? 'draft' : 'hackathon';
    
    if (!isAuthenticated) {
      toast.error(`Please sign in to delete ${targetLabel}s`);
      throw new Error('Authentication required');
    }

    if (!organizationId || !hackathonId) {
      const idError = `Organization ID and ${isDraft ? 'Draft' : 'Hackathon'} ID are required`;
      toast.error(idError);
      throw new Error(idError);
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = isDraft 
        ? await deleteDraft(organizationId, hackathonId)
        : await deleteHackathon(hackathonId);

      if (response.success) {
        toast.success(`${isDraft ? 'Draft' : 'Hackathon'} deleted successfully`);
        onSuccess?.();
        return response.data;
      } else {
        throw new Error(response.message || `Failed to delete ${targetLabel}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to delete ${targetLabel}`;
      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [organizationId, hackathonId, isDraft, isAuthenticated, onSuccess, onError]);

  return {
    isDeleting,
    error,
    deleteHackathon: deleteHackathonAction,
  };
}
