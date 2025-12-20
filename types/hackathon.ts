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

export interface CommentUser {
  _id: string;
  profile: {
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
}

export interface CommentReactionCounts {
  LIKE: number;
  DISLIKE: number;
  HELPFUL: number;
}

export interface CommentEditHistory {
  content: string;
  editedAt: string;
}

export interface CommentReport {
  userId: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'misinformation' | 'other';
  description?: string;
  createdAt: string;
}

export interface Discussion {
  _id: string;
  userId: CommentUser;
  projectId: string;
  content: string;
  parentCommentId?: string;
  status: 'active' | 'deleted' | 'flagged' | 'hidden';
  editHistory: CommentEditHistory[];
  reactionCounts: CommentReactionCounts;
  totalReactions: number;
  replyCount: number;
  replies: Discussion[];
  createdAt: string;
  updatedAt: string;
  isSpam: boolean;
  reports: CommentReport[];
}

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
