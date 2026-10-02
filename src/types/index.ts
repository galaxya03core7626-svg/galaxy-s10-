export type TaskCategory = 'survey' | 'testing' | 'feedback' | 'search' | 'brand' | 'app_install' | 'watch';

export type UserRole = 'earner' | 'advertiser' | 'compliance_admin';

export interface MicroTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  reward: number; // in USD, e.g. 1.75
  estimatedMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  sponsor: string;
  remainingSlots: number;
  completed?: boolean;
  completedAt?: string;
  tags?: string[];
  questions?: {
    id: string;
    question: string;
    options: string[];
    type: 'radio' | 'text' | 'rating';
  }[];
}

export interface AdCampaign {
  id: string;
  title: string;
  sponsor: string;
  category: string;
  durationSeconds: number;
  rewardUSD: number; // User net payout (e.g. $0.18)
  grossCPM: number; // Advertiser gross CPM ($24.00)
  videoUrl: string; // Direct mp4 video or fallback stream
  posterUrl: string;
  tagline: string;
  sponsorUrl: string;
  budgetUSD?: number;
  spentUSD?: number;
  impressionsDelivered?: number;
  status?: 'active' | 'paused' | 'completed';
  createdAt?: string;
  advertiserId?: string;
  verificationQuestion: {
    question: string;
    correctOption: string;
    options: string[];
  };
}

export type TransactionType =
  | 'ad_view'
  | 'task_reward'
  | 'withdrawal'
  | 'referral'
  | 'bonus'
  | 'gateway_fee'
  | 'advertiser_deposit';

export interface Transaction {
  id: string;
  referenceHash: string;
  timestamp: string;
  title: string;
  description: string;
  type: TransactionType;
  amount: number; // positive for credits, negative for debits
  status: 'completed' | 'in_review' | 'processing' | 'failed';
  gateway?: 'paypal' | 'stripe' | 'wise' | 'crypto_usdc' | 'internal_ledger';
  payoutAddress?: string;
  receiptNumber?: string;
  flowDirection?: 'INFLOW' | 'OUTFLOW';
  rawBlockData?: Record<string, any>;
}

export interface KYCProfile {
  tier: 1 | 2 | 3;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  taxStatus: 'unsubmitted' | 'w9_verified' | 'w8ben_verified';
  trustScore: number; // 0 - 100
  fraudRiskLevel: 'Low' | 'Medium' | 'Elevated';
}

export interface GatewayCredentials {
  mode: 'sandbox' | 'live';
  paypalClientId: string;
  paypalSecret: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  admobPublisherId: string;
  adsenseClientId: string;
  minWithdrawalThreshold: number; // default $5.00
  userRevenueSharePercent: number; // default 75%
}

export interface PayoutRequest {
  id: string;
  amount: number;
  method: 'paypal' | 'stripe' | 'wise' | 'crypto_usdc';
  recipientDetails: {
    email?: string;
    bankRouting?: string;
    bankAccount?: string;
    cryptoAddress?: string;
    fullName: string;
  };
  fee: number;
  netAmount: number;
  status: 'submitted' | 'compliance_review' | 'gateway_processing' | 'completed' | 'failed';
  createdAt: string;
  transactionHash: string;
  gatewayReferenceId: string;
}

export interface DailyStreakState {
  tasksCompletedToday: number;
  targetTasksPerDay: number; // 3 tasks
  streakDays: number;
  bonusAmount: number; // e.g. $1.00
  isBonusClaimedToday: boolean;
  lastDate: string;
}

export interface ReferralFriend {
  id: string;
  name: string;
  joinDate: string;
  adsWatched: number;
  tasksCompleted: number;
  commissionEarnedUSD: number;
  status: 'active' | 'pending';
}

export interface DailyEarningPoint {
  date: string;
  adEarnings: number;
  taskEarnings: number;
  totalEarnings: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'withdrawal_approved' | 'high_value_task' | 'streak_reward' | 'advertiser_deposit';
  timestamp: string;
  read?: boolean;
  actionTab?: string;
  actionLabel?: string;
}
