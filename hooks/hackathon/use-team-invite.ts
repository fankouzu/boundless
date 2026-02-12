'use client';

import { useState, useCallback } from 'react';
import {
  createTeamPost,
  inviteUserToTeam,
  type CreateTeamPostRequest,
} from '@/lib/api/hackathons';
import { toast } from 'sonner';

interface UseTeamInviteOptions {
  hackathonSlugOrId: string;
  organizationId?: string;
  onSuccess?: (teamId: string) => void;
}

export function useTeamInvite({
  hackathonSlugOrId,
  organizationId,
  onSuccess,
}: UseTeamInviteOptions) {
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeamAndInvite = useCallback(
    async (
      teamData: CreateTeamPostRequest,
      invitees: string[] // Array of user IDs or usernames
    ) => {
      setIsCreatingTeam(true);
      setError(null);

      try {
        // 1. Create Team
        const teamResponse = await createTeamPost(
          hackathonSlugOrId,
          teamData,
          organizationId
        );

        if (!teamResponse.success || !teamResponse.data) {
          throw new Error(teamResponse.message || 'Failed to create team');
        }

        const newTeamId = teamResponse.data.id;

        // 2. Invite Members
        if (invitees.length > 0) {
          const invitePromises = invitees.map(async invitee => {
            try {
              const res = await inviteUserToTeam(hackathonSlugOrId, newTeamId, {
                inviteeIdentifier: invitee,
                message: 'Join my team for the hackathon!',
              });

              if (!res.success) {
                console.warn(`Failed to invite ${invitee}: ${res.message}`);
                toast.error(`Failed to invite ${invitee}: ${res.message}`);
              }
              return res;
            } catch (err) {
              const errorMessage =
                err instanceof Error ? err.message : 'Unknown error';
              console.error(`Error inviting ${invitee}:`, err);
              toast.error(`Error inviting ${invitee}: ${errorMessage}`);
              return null;
            }
          });

          await Promise.all(invitePromises);
        }

        toast.success('Team created successfully!');
        onSuccess?.(newTeamId);
        return newTeamId;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create team';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsCreatingTeam(false);
      }
    },
    [hackathonSlugOrId, organizationId, onSuccess]
  );

  return {
    createTeamAndInvite,
    isCreatingTeam,
    error,
  };
}
