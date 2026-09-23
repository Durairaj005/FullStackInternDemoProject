// ─── Types: Competition ───────────────────────────────────────────────────────
// Mirrors the API response shape returned by GET /api/competitions/:id

export type CompetitionStatus = 'ACTIVE' | 'UPCOMING' | 'FULL' | 'ENDED' | 'REGISTRATION_CLOSED' | 'CANCELLED';

export type CtaAction =
  | 'REGISTER'
  | 'UPLOAD_SUBMISSION'
  | 'VIEW_RESULTS'
  | 'NOTIFY_ME'
  | 'NONE';

export interface CtaButton {
  text: string;
  subText: string | null;
  enabled: boolean;
  action: CtaAction;
}

export interface Spots {
  total: number;
  registered: number;
  remaining: number;
  isFull: boolean;
  progressPercentage: number;
}

export interface Lifecycle {
  status: CompetitionStatus;
  canRegister: boolean;
  registrationClosesInSeconds: number;
  isUpcoming: boolean;
  hasEnded: boolean;
}

export interface UserState {
  isRegistered: boolean;
  registeredAt: string | null;
  actionButton: CtaButton;
}

export interface Judge {
  name: string;
  designation: string;
  experience: string;
  imageUrl: string | null;
  introVideoUrl: string | null;
}

export interface Timeline {
  registrationStart: string;
  registrationEnd: string;
  submissionStart: string;
  submissionEnd: string;
  resultDate: string;
}

export interface JudgingParameter {
  title: string;
  description: string;
  weightage: string;
}

export interface Reward {
  rank: number;
  label: string;
  amount: number;
}

export interface PreviousWinner {
  name: string;
  rankTitle: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

export interface Competition {
  id: string;
  title: string;
  category: string;
  tags: string[];
  prizePool: number;
  entryFee: number;
  currency: string;
  spots: Spots;
  lifecycle: Lifecycle;
  userState: UserState;
  judge: Judge;
  timeline: Timeline;
  about: string;
  disclaimer: string | null;
  judgingParameters: JudgingParameter[];
  rulesAndEligibility: string[];
  rewards: Reward[];
  previousWinners: PreviousWinner[];
  referralLink: string | null;
  referralEarning: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface RegistrationResult {
  registrationId: string;
  competitionId: string;
  competitionTitle: string;
  userId: string;
  spotsRemaining: number;
  registeredAt: string;
}
