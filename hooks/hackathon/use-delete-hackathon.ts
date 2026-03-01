import { useState, useCallback } from 'react';
import { deleteHackathon } from '@/lib/api/hackathons';
import { deleteDraft } from '@/lib/api/hackathons/draft';
import { useAuthStatus } from '@/hooks/use-auth';
import { toast } from 'sonner';

type UseDeleteHackathonOptions =
  | {
      isDraft: true;
      organizationId: string;
      hackathonId: string;
      onSuccess?: () => void;
      onError?: (error: string) => void;
    }
  | {
      isDraft?: false;
      organizationId?: string;
      hackathonId: string;
      onSuccess?: () => void;
      onError?: (error: string) => void;
    };

/**
 * Hook to handle hackathon and draft deletion with proper API routing and feedback.
 */
export const useDeleteHackathon = (options: UseDeleteHackathonOptions) => {
  const { isDraft = false, organizationId, hackathonId, onSuccess, onError } = options;
  const { isAuthenticated } = useAuthStatus();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteHackathonAction = useCallback(async () => {
    const targetLabel = isDraft ? 'draft' : 'hackathon';
    const idLabel = isDraft ? 'Draft ID' : 'Hackathon ID';

    setIsDeleting(true);
    setError(null);

    try {
      if (!isAuthenticated) {
        throw new Error(`Please sign in to delete ${targetLabel}s`);
      }

      if (!hackathonId) {
        throw new Error(`${idLabel} is required`);
      }

      if (isDraft && !organizationId) {
        throw new Error('Organization ID is required for draft deletion');
      }

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
      // We don't re-throw here to allow callers to handle state via hook instead of try/catch
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
