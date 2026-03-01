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

/**
 * Hook to handle hackathon and draft deletion with proper API routing and feedback.
 */
export const useDeleteHackathon = ({
  organizationId,
  hackathonId,
  isDraft = false,
  onSuccess,
  onError,
}: UseDeleteHackathonOptions) => {
  const { isAuthenticated } = useAuthStatus();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteHackathonAction = useCallback(async () => {
    const targetLabel = isDraft ? 'draft' : 'hackathon';
    
    if (!isAuthenticated) {
      toast.error(`Please sign in to delete ${targetLabel}s`);
      throw new Error('Authentication required');
    }

    if (!hackathonId) {
      toast.error('Hackathon ID is required');
      throw new Error('Hackathon ID is required');
    }

    if (isDraft && !organizationId) {
      toast.error('Organization ID is required for draft deletion');
      throw new Error('Organization ID is required for draft deletion');
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
      console.error(`Error deleting ${targetLabel}:`, err);
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
};
