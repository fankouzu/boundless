import { RegistrationDeadlinePolicy } from '@/lib/api/hackathons';

export interface JudgingCriteria {
  title: string;
  weight?: number;
  description?: string;
}

export interface Venue {
  type: 'virtual' | 'physical';
  country?: string;
  state?: string;
  city?: string;
  venueName?: string;
  venueAddress?: string;
}
export interface Participant {
  id: string | number;
  name: string;
  username: string;
  avatar: string;
  verified?: boolean;
  joinedDate?: string;
  role?: string;
  description?: string;
  categories?: string[];
  projects?: number;
  followers?: number;
  following?: number;
  hasSubmitted?: boolean;
  teamId?: string | null;
  teamName?: string | null;
  isIndividual?: boolean;
}

export interface ParticipantGroup {
  teamId: string | null;
  teamName: string | null;
  isIndividual: boolean;
  members: Participant[];
  memberCount: number;
  hasSubmission: boolean;
  teamCreatedAt: string;
}

export interface ParticipantsData {
  groups?: ParticipantGroup[];
  participants?: Participant[];
  grouping: 'team' | 'flat';
  participantType: string;
  hasMore: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface ParticipantsResponse {
  success: boolean;
  data: ParticipantsData;
  message: string;
  timestamp?: string;
  path?: string;
}

// Discussion types removed - use Comment type from @/types/comment instead
// with CommentEntityType.HACKATHON for hackathon discussions

export interface SubmissionCardProps {
  _id?: string;
  title: string;
  description: string;
  submitterName: string;
  submitterAvatar?: string;
  category?: string;
  categories?: string[];
  status?: 'Pending' | 'Approved' | 'Rejected';
  upvotes?: number;
  votes?: { current: number; total: number };
  comments?: number;
  submittedDate?: string;
  daysLeft?: number;
  score?: number;
  image?: string;
  onViewClick?: () => void;
  onUpvoteClick?: () => void;
  onCommentClick?: () => void;
  hasUserUpvoted?: boolean;
}

export type ParticipantType = 'team' | 'individual' | 'team_or_individual';

export interface HackathonSubmissionRequirements {
  requireGithub?: boolean;
  requireDemoVideo?: boolean;
  requireOtherLinks?: boolean;
}

export interface HackathonTabVisibility {
  detailsTab?: boolean;
  participantsTab?: boolean;
  resourcesTab?: boolean;
  submissionTab?: boolean;
  announcementsTab?: boolean;
  discussionTab?: boolean;
  winnersTab?: boolean;
  sponsorsTab?: boolean;
  joinATeamTab?: boolean;
  rulesTab?: boolean;
}

export interface HackathonParticipationSettings {
  participantType?: ParticipantType;
  teamMin?: number;
  teamMax?: number;
  about?: string;
  registrationDeadlinePolicy?: RegistrationDeadlinePolicy;
  registrationDeadline?: string;
  submissionRequirements?: HackathonSubmissionRequirements;
  tabVisibility?: HackathonTabVisibility;
}
