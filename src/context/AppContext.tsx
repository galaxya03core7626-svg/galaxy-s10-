import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdCampaign,
  MicroTask,
  Transaction,
  KYCProfile,
  GatewayCredentials,
  PayoutRequest,
  DailyStreakState,
  ReferralFriend,
  DailyEarningPoint,
  AppNotification,
} from '../types';
import {
  INITIAL_AD_CAMPAIGNS,
  INITIAL_TASKS,
  INITIAL_TRANSACTIONS,
  INITIAL_KYC_PROFILE,
  INITIAL_GATEWAY_CONFIG,
  INITIAL_REFERRALS,
  INITIAL_30_DAYS_EARNINGS,
} from '../data/initialData';
import { soundManager } from '../utils/audio';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ads: AdCampaign[];
  tasks: MicroTask[];
  transactions: Transaction[];
  kyc: KYCProfile;
  gatewayConfig: GatewayCredentials;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarned: number;
  lifetimeWithdrawn: number;
  latestReceipt: PayoutRequest | null;
  setLatestReceipt: (receipt: PayoutRequest | null) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;

  // Streak & Target features
  streak: DailyStreakState;
  claimDailyStreakBonus: () => void;
  dailyTargetUSD: number;
  todayEarnedUSD: number;
  streakCelebration: { show: boolean; bonus: number; streakCount: number } | null;
  setStreakCelebration: (val: { show: boolean; bonus: number; streakCount: number } | null) => void;

  // Referral features
  referrals: ReferralFriend[];
  referralCode: string;
  totalReferralCommission: number;
  claimReferralCommission: () => void;

  // Historical data for Recharts
  earningsHistory: DailyEarningPoint[];

  // Core Actions
  recordAdViewEarnings: (ad: AdCampaign) => void;
  completeTask: (taskId: string, answers: Record<string, string>) => void;
  addRandomTask: () => void;
  createCustomTask: (taskData: Omit<MicroTask, 'id'>) => void;
  addRandomAd: () => void;
  requestWithdrawal: (
    method: 'paypal' | 'stripe' | 'wise' | 'crypto_usdc',
    amount: number,
    recipient: any
  ) => { success: boolean; error?: string; request?: PayoutRequest };
  updateKYC: (updates: Partial<KYCProfile>) => void;
  updateGatewayConfig: (updates: Partial<GatewayCredentials>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const RANDOM_AD_TEMPLATES = [
  {
    title: 'QuantumKey Password Manager Enterprise',
    sponsor: 'QuantumKey Cybersecurity AG',
    category: 'Security & SaaS',
    durationSeconds: 15,
    rewardUSD: 0.24,
    grossCPM: 32.0,
    tagline: 'Zero-knowledge encryption for high-growth engineering teams with hardware security key passkey support.',
    question: 'What level of encryption architecture is utilized by QuantumKey?',
    correctOption: 'Zero-knowledge architecture',
    options: ['Zero-knowledge architecture', 'Symmetric shared key', 'Unencrypted cloud ledger', 'Browser cookie storage'],
  },
  {
    title: 'NordicStream Hi-Fi Audio Lossless',
    sponsor: 'Nordic Sound Technologies',
    category: 'Consumer Media',
    durationSeconds: 12,
    rewardUSD: 0.17,
    grossCPM: 22.5,
    tagline: '24-bit 192kHz uncompressed studio master streaming with spatial acoustic calibration for headphones.',
    question: 'What is the maximum studio master audio sample rate supported?',
    correctOption: '24-bit 192kHz',
    options: ['16-bit 44.1kHz', '24-bit 192kHz', '128kbps MP3', '96kHz mono'],
  },
  {
    title: 'AuraHealth Biomarker Ring Gen 4',
    sponsor: 'Aura Biosensing Inc.',
    category: 'Health & Hardware',
    durationSeconds: 15,
    rewardUSD: 0.25,
    grossCPM: 33.0,
    tagline: 'Medical-grade blood oxygenation, sleep recovery metrics, and continuous skin temperature monitoring.',
    question: 'What primary hardware format does AuraHealth utilize for biometric tracking?',
    correctOption: 'Titanium Smart Ring',
    options: ['Titanium Smart Ring', 'Chest Strap', 'Armband Monitor', 'Earbud Sensor'],
  },
];

const RANDOM_TASK_TEMPLATES: Omit<MicroTask, 'id'>[] = [
  {
    title: 'DeFi Liquidity Pool Security Usability Review',
    description: 'Evaluate smart contract liquidity deposit screen and report any friction in approval steps.',
    category: 'testing',
    reward: 2.85,
    estimatedMinutes: 3,
    difficulty: 'Medium',
    sponsor: 'Aetheris Protocol Labs',
    remainingSlots: 25,
    tags: ['App Install', 'Crypto', 'High Yield'],
    questions: [
      {
        id: 'df_1',
        question: 'How clear was the simulated gas fee breakdown before transaction confirmation?',
        type: 'radio',
        options: ['Crystal clear with exact gwei estimate', 'Slightly confusing', 'Missing priority fee indicator'],
      },
    ],
  },
  {
    title: 'Mobile Audio Stream Bitrate Evaluation',
    description: 'Listen to two 20-second audio clips and rate dynamic range compression on mobile speakers.',
    category: 'watch',
    reward: 1.50,
    estimatedMinutes: 2,
    difficulty: 'Easy',
    sponsor: 'StreamCraft UX Labs',
    remainingSlots: 40,
    tags: ['Watch', 'Audio', 'Streaming'],
    questions: [
      {
        id: 'st_1',
        question: 'Which sample had superior vocal clarity at 50% volume?',
        type: 'radio',
        options: ['Sample A (24-bit FLAC)', 'Sample B (Standard AAC)', 'Both sounded identical'],
      },
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [ads, setAds] = useState<AdCampaign[]>(() => {
    try {
      const saved = localStorage.getItem('adrewards_ads');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: AdCampaign) => ({
          ...item,
          videoUrl: '',
        }));
      }
    } catch (_e) {}
    return INITIAL_AD_CAMPAIGNS;
  });

  const [tasks, setTasks] = useState<MicroTask[]>(() => {
    const saved = localStorage.getItem('adrewards_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('adrewards_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_e) {}
    }
    // Enrich initial transactions with flowDirection and rawBlockData
    return INITIAL_TRANSACTIONS.map((tx) => ({
      ...tx,
      flowDirection: tx.amount > 0 ? 'INFLOW' : 'OUTFLOW',
      rawBlockData: {
        blockNumber: Math.floor(18000000 + Math.random() * 900000),
        merkleRoot: '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        gasUsed: 21000,
        consensusSignature: 'ED25519_VALIDATED',
      },
    }));
  });

  const [kyc, setKyc] = useState<KYCProfile>(() => {
    const saved = localStorage.getItem('adrewards_kyc');
    return saved ? JSON.parse(saved) : INITIAL_KYC_PROFILE;
  });

  const [gatewayConfig, setGatewayConfig] = useState<GatewayCredentials>(() => {
    const saved = localStorage.getItem('adrewards_gateway_config');
    return saved ? JSON.parse(saved) : INITIAL_GATEWAY_CONFIG;
  });

  const [availableBalance, setAvailableBalance] = useState<number>(() => {
    const saved = localStorage.getItem('adrewards_avail_balance');
    return saved ? parseFloat(saved) : 6.99;
  });

  const [pendingBalance, setPendingBalance] = useState<number>(() => {
    const saved = localStorage.getItem('adrewards_pending_balance');
    return saved ? parseFloat(saved) : 0.00;
  });

  const [lifetimeEarned, setLifetimeEarned] = useState<number>(() => {
    const saved = localStorage.getItem('adrewards_lifetime_earned');
    return saved ? parseFloat(saved) : 6.99;
  });

  const [lifetimeWithdrawn, setLifetimeWithdrawn] = useState<number>(() => {
    const saved = localStorage.getItem('adrewards_lifetime_withdrawn');
    return saved ? parseFloat(saved) : 0.00;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_welcome',
      title: 'High-Value Task Ready',
      message: 'Apex Crypto beta install task ($3.50 USD) is ready in the task queue.',
      type: 'high_value_task',
      timestamp: 'Just now',
      actionTab: 'tasks',
      actionLabel: 'View Task',
    },
  ]);

  const addNotification = (n: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const id = `notif_${Date.now()}`;
    const newNotif: AppNotification = {
      ...n,
      id,
      timestamp: 'Just now',
    };

    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);

    // Trigger browser native Notification if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(n.title, {
          body: n.message,
          icon: '/favicon.ico',
        });
      } catch (_e) {}
    }

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 7000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Daily Streak State: 3 tasks/day gives +$1.00 bonus
  const [streak, setStreak] = useState<DailyStreakState>(() => {
    const saved = localStorage.getItem('adrewards_streak');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_e) {}
    }
    return {
      tasksCompletedToday: 1,
      targetTasksPerDay: 3,
      streakDays: 4,
      bonusAmount: 1.00,
      isBonusClaimedToday: false,
      lastDate: '2026-10-02',
    };
  });

  const [streakCelebration, setStreakCelebration] = useState<{
    show: boolean;
    bonus: number;
    streakCount: number;
  } | null>(null);

  const dailyTargetUSD = 5.00;
  const todayEarnedUSD = transactions
    .filter((tx) => tx.timestamp.startsWith('2026-10-02') && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const [referrals, setReferrals] = useState<ReferralFriend[]>(() => {
    const saved = localStorage.getItem('adrewards_referrals');
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const referralCode = 'ALEX8821';
  const totalReferralCommission = referrals.reduce((sum, r) => sum + r.commissionEarnedUSD, 0);

  const [earningsHistory, setEarningsHistory] = useState<DailyEarningPoint[]>(() => {
    const saved = localStorage.getItem('adrewards_history');
    return saved ? JSON.parse(saved) : INITIAL_30_DAYS_EARNINGS;
  });

  const [latestReceipt, setLatestReceipt] = useState<PayoutRequest | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('adrewards_ads', JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem('adrewards_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('adrewards_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('adrewards_kyc', JSON.stringify(kyc));
  }, [kyc]);

  useEffect(() => {
    localStorage.setItem('adrewards_gateway_config', JSON.stringify(gatewayConfig));
  }, [gatewayConfig]);

  useEffect(() => {
    localStorage.setItem('adrewards_avail_balance', availableBalance.toFixed(2));
  }, [availableBalance]);

  useEffect(() => {
    localStorage.setItem('adrewards_pending_balance', pendingBalance.toFixed(2));
  }, [pendingBalance]);

  useEffect(() => {
    localStorage.setItem('adrewards_lifetime_earned', lifetimeEarned.toFixed(2));
  }, [lifetimeEarned]);

  useEffect(() => {
    localStorage.setItem('adrewards_lifetime_withdrawn', lifetimeWithdrawn.toFixed(2));
  }, [lifetimeWithdrawn]);

  useEffect(() => {
    localStorage.setItem('adrewards_streak', JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('adrewards_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('adrewards_history', JSON.stringify(earningsHistory));
  }, [earningsHistory]);

  const generateHexHash = () => {
    return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  const updateTodayHistoryPoint = (adDelta: number, taskDelta: number) => {
    setEarningsHistory((prev) => {
      const copy = [...prev];
      if (copy.length > 0) {
        const lastIdx = copy.length - 1;
        const lastItem = copy[lastIdx];
        copy[lastIdx] = {
          ...lastItem,
          adEarnings: +(lastItem.adEarnings + adDelta).toFixed(2),
          taskEarnings: +(lastItem.taskEarnings + taskDelta).toFixed(2),
          totalEarnings: +(lastItem.totalEarnings + adDelta + taskDelta).toFixed(2),
        };
      }
      return copy;
    });
  };

  const recordAdViewEarnings = (ad: AdCampaign) => {
    const txHash = generateHexHash();
    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      referenceHash: txHash,
      timestamp: getFormattedDate(),
      title: `${ad.title} Ad Verification`,
      description: `Verified ${ad.durationSeconds}s view with correct comprehension challenge answer (${ad.sponsor})`,
      type: 'ad_view',
      amount: ad.rewardUSD,
      status: 'completed',
      gateway: 'internal_ledger',
      flowDirection: 'INFLOW',
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      rawBlockData: {
        cpmRate: ad.grossCPM,
        viewerSharePercent: 75,
        attentionVerificationScore: 100,
        viewDurationSeconds: ad.durationSeconds,
        blockHash: txHash,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);
    setAvailableBalance((prev) => +(prev + ad.rewardUSD).toFixed(2));
    setLifetimeEarned((prev) => +(prev + ad.rewardUSD).toFixed(2));
    updateTodayHistoryPoint(ad.rewardUSD, 0);
  };

  const completeTask = (taskId: string, _answers: Record<string, string>) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const txHash = generateHexHash();
    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      referenceHash: txHash,
      timestamp: getFormattedDate(),
      title: targetTask.title,
      description: `Completed verified ${targetTask.category} task (${targetTask.sponsor})`,
      type: 'task_reward',
      amount: targetTask.reward,
      status: 'completed',
      gateway: 'internal_ledger',
      flowDirection: 'INFLOW',
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      rawBlockData: {
        taskCategory: targetTask.category,
        sponsor: targetTask.sponsor,
        responseHash: generateHexHash().substring(0, 16),
        qualityScore: 98,
        blockHash: txHash,
      },
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completed: true, remainingSlots: Math.max(0, t.remainingSlots - 1), completedAt: getFormattedDate() }
          : t
      )
    );
    setTransactions((prev) => [newTx, ...prev]);
    setAvailableBalance((prev) => +(prev + targetTask.reward).toFixed(2));
    setLifetimeEarned((prev) => +(prev + targetTask.reward).toFixed(2));
    updateTodayHistoryPoint(0, targetTask.reward);

    // Update Daily Streak progress
    setStreak((prev) => {
      const nextTasksCount = prev.tasksCompletedToday + 1;
      const reachedTarget = nextTasksCount >= prev.targetTasksPerDay;

      if (reachedTarget && !prev.isBonusClaimedToday) {
        const bonusTxHash = generateHexHash();
        const bonusTx: Transaction = {
          id: `tx_streak_${Date.now()}`,
          referenceHash: bonusTxHash,
          timestamp: getFormattedDate(),
          title: `3-Task Daily Streak Bonus Awarded (Day ${prev.streakDays + 1})`,
          description: `Completed 3 verified tasks in one day. Daily loyalty bonus credited!`,
          type: 'bonus',
          amount: prev.bonusAmount,
          status: 'completed',
          gateway: 'internal_ledger',
          flowDirection: 'INFLOW',
          receiptNumber: `STRK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
          rawBlockData: {
            consecutiveDays: prev.streakDays + 1,
            bonusRewardUSD: prev.bonusAmount,
            blockHash: bonusTxHash,
          },
        };

        setTimeout(() => {
          setTransactions((t) => [bonusTx, ...t]);
          setAvailableBalance((b) => +(b + prev.bonusAmount).toFixed(2));
          setLifetimeEarned((l) => +(l + prev.bonusAmount).toFixed(2));
          soundManager.playRewardChime();
          setStreakCelebration({
            show: true,
            bonus: prev.bonusAmount,
            streakCount: prev.streakDays + 1,
          });

          addNotification({
            type: 'streak_reward',
            title: 'Daily Streak Bonus Unlocked!',
            message: `+$${prev.bonusAmount.toFixed(2)} USD bonus credited for reaching 3 daily tasks.`,
            actionTab: 'wallet',
            actionLabel: 'Check Wallet',
          });
        }, 500);

        return {
          ...prev,
          tasksCompletedToday: nextTasksCount,
          streakDays: prev.streakDays + 1,
          isBonusClaimedToday: true,
        };
      }

      return {
        ...prev,
        tasksCompletedToday: nextTasksCount,
      };
    });
  };

  const claimDailyStreakBonus = () => {
    if (streak.tasksCompletedToday < streak.targetTasksPerDay || streak.isBonusClaimedToday) {
      return;
    }

    const bonusTxHash = generateHexHash();
    const bonusTx: Transaction = {
      id: `tx_streak_${Date.now()}`,
      referenceHash: bonusTxHash,
      timestamp: getFormattedDate(),
      title: `3-Task Daily Streak Bonus Awarded (Day ${streak.streakDays + 1})`,
      description: `Completed 3 verified tasks in one day. Daily loyalty bonus credited!`,
      type: 'bonus',
      amount: streak.bonusAmount,
      status: 'completed',
      gateway: 'internal_ledger',
      flowDirection: 'INFLOW',
      receiptNumber: `STRK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      rawBlockData: {
        consecutiveDays: streak.streakDays + 1,
        bonusRewardUSD: streak.bonusAmount,
        blockHash: bonusTxHash,
      },
    };

    setTransactions((prev) => [bonusTx, ...prev]);
    setAvailableBalance((prev) => +(prev + streak.bonusAmount).toFixed(2));
    setLifetimeEarned((prev) => +(prev + streak.bonusAmount).toFixed(2));
    setStreak((prev) => ({
      ...prev,
      isBonusClaimedToday: true,
      streakDays: prev.streakDays + 1,
    }));
    soundManager.playRewardChime();
    setStreakCelebration({
      show: true,
      bonus: streak.bonusAmount,
      streakCount: streak.streakDays + 1,
    });
  };

  const claimReferralCommission = () => {
    if (totalReferralCommission <= 0) return;

    const refTxHash = generateHexHash();
    const refTx: Transaction = {
      id: `tx_ref_claim_${Date.now()}`,
      referenceHash: refTxHash,
      timestamp: getFormattedDate(),
      title: `Referral Ad Revenue Share Payout`,
      description: `Claimed 10% lifetime commission bonus from invited friends`,
      type: 'referral',
      amount: totalReferralCommission,
      status: 'completed',
      gateway: 'internal_ledger',
      flowDirection: 'INFLOW',
      receiptNumber: `REF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      rawBlockData: {
        activeFriendsCount: referrals.length,
        commissionAmount: totalReferralCommission,
        blockHash: refTxHash,
      },
    };

    setTransactions((prev) => [refTx, ...prev]);
    setAvailableBalance((prev) => +(prev + totalReferralCommission).toFixed(2));
    setLifetimeEarned((prev) => +(prev + totalReferralCommission).toFixed(2));

    setReferrals((prev) =>
      prev.map((r) => ({
        ...r,
        commissionEarnedUSD: 0,
      }))
    );
    soundManager.playRewardChime();
  };

  const addRandomTask = () => {
    const randomTemplate = RANDOM_TASK_TEMPLATES[Math.floor(Math.random() * RANDOM_TASK_TEMPLATES.length)];
    const id = `task_gen_${Date.now()}`;
    const newTask: MicroTask = {
      ...randomTemplate,
      id,
      reward: +(Math.random() * 2.5 + 1.20).toFixed(2),
      remainingSlots: Math.floor(Math.random() * 40 + 15),
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);

    // Alert user that a new high-value task is available
    addNotification({
      type: 'high_value_task',
      title: 'New High-Value Task Released',
      message: `${newTask.sponsor} published "${newTask.title.substring(0, 32)}..." for +$${newTask.reward.toFixed(2)} USD.`,
      actionTab: 'tasks',
      actionLabel: 'View Task',
    });
  };

  const createCustomTask = (taskData: Omit<MicroTask, 'id'>) => {
    const id = `task_custom_${Date.now()}`;
    const newTask: MicroTask = {
      ...taskData,
      id,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    addNotification({
      type: 'high_value_task',
      title: 'Custom Task Deployed',
      message: `Your task "${taskData.title.substring(0, 30)}..." has been added to the pool.`,
      actionTab: 'tasks',
      actionLabel: 'Inspect',
    });
  };

  const addRandomAd = () => {
    const template = RANDOM_AD_TEMPLATES[Math.floor(Math.random() * RANDOM_AD_TEMPLATES.length)];
    const id = `ad_gen_${Date.now()}`;
    const newAd: AdCampaign = {
      id,
      title: template.title,
      sponsor: template.sponsor,
      category: template.category,
      durationSeconds: template.durationSeconds,
      rewardUSD: template.rewardUSD,
      grossCPM: template.grossCPM,
      videoUrl: '',
      posterUrl: '/src/assets/images/sponsor_fintech_card_1790969508934.jpg',
      tagline: template.tagline,
      sponsorUrl: 'https://example.com/sponsor',
      verificationQuestion: {
        question: template.question,
        correctOption: template.correctOption,
        options: template.options,
      },
    };
    setAds((prev) => [newAd, ...prev]);
  };

  const requestWithdrawal = (
    method: 'paypal' | 'stripe' | 'wise' | 'crypto_usdc',
    amount: number,
    recipient: any
  ): { success: boolean; error?: string; request?: PayoutRequest } => {
    if (amount > availableBalance) {
      return { success: false, error: 'Insufficient available funds. Earn more through ads and tasks.' };
    }

    if (amount < gatewayConfig.minWithdrawalThreshold) {
      return {
        success: false,
        error: `Minimum withdrawal amount is $${gatewayConfig.minWithdrawalThreshold.toFixed(2)}. Current request is $${amount.toFixed(2)}.`,
      };
    }

    let fee = 0;
    if (method === 'paypal') fee = 0.25;
    else if (method === 'stripe') fee = +(amount * 0.015).toFixed(2);
    else if (method === 'wise') fee = 0.50;
    else if (method === 'crypto_usdc') fee = 0.10;

    const netAmount = +(amount - fee).toFixed(2);
    const txHash = generateHexHash();
    const gatewayRef =
      method === 'paypal'
        ? `PAYPAL_PO_${Math.floor(10000000 + Math.random() * 90000000)}`
        : method === 'stripe'
        ? `STRIPE_tr_${Math.floor(10000000 + Math.random() * 90000000)}`
        : method === 'wise'
        ? `WISE_XFER_${Math.floor(10000000 + Math.random() * 90000000)}`
        : `POLYGON_USDC_0x${Math.floor(10000000 + Math.random() * 90000000)}`;

    const payoutRequest: PayoutRequest = {
      id: `payout_${Date.now()}`,
      amount,
      method,
      recipientDetails: recipient,
      fee,
      netAmount,
      status: 'completed',
      createdAt: getFormattedDate(),
      transactionHash: txHash,
      gatewayReferenceId: gatewayRef,
    };

    const newTx: Transaction = {
      id: `tx_wd_${Date.now()}`,
      referenceHash: txHash,
      timestamp: getFormattedDate(),
      title: `${method.toUpperCase()} Real Withdrawal Payout`,
      description: `Disbursed to ${recipient.email || recipient.bankAccount || recipient.cryptoAddress || recipient.fullName} via secure gateway`,
      type: 'withdrawal',
      amount: -amount,
      status: 'completed',
      gateway: method,
      flowDirection: 'OUTFLOW',
      payoutAddress: recipient.email || recipient.bankAccount || recipient.cryptoAddress,
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      rawBlockData: {
        grossDebit: amount,
        processingFee: fee,
        netDisbursement: netAmount,
        gatewayProcessor: method,
        gatewayReferenceId: gatewayRef,
        blockHash: txHash,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);
    setAvailableBalance((prev) => +(prev - amount).toFixed(2));
    setLifetimeWithdrawn((prev) => +(prev + amount).toFixed(2));

    setLatestReceipt(payoutRequest);
    setIsReceiptModalOpen(true);

    // Trigger Notification
    addNotification({
      type: 'withdrawal_approved',
      title: 'Withdrawal Approved & Cleared',
      message: `Your $${amount.toFixed(2)} USD withdrawal via ${method.toUpperCase()} was transmitted successfully. Net: $${netAmount.toFixed(2)}.`,
      actionTab: 'wallet',
      actionLabel: 'View Voucher',
    });

    return { success: true, request: payoutRequest };
  };

  const updateKYC = (updates: Partial<KYCProfile>) => {
    setKyc((prev) => ({ ...prev, ...updates }));
  };

  const updateGatewayConfig = (updates: Partial<GatewayCredentials>) => {
    setGatewayConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        ads,
        tasks,
        transactions,
        kyc,
        gatewayConfig,
        availableBalance,
        pendingBalance,
        lifetimeEarned,
        lifetimeWithdrawn,
        latestReceipt,
        setLatestReceipt,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        notifications,
        addNotification,
        dismissNotification,
        streak,
        claimDailyStreakBonus,
        dailyTargetUSD,
        todayEarnedUSD,
        streakCelebration,
        setStreakCelebration,
        referrals,
        referralCode,
        totalReferralCommission,
        claimReferralCommission,
        earningsHistory,
        recordAdViewEarnings,
        completeTask,
        addRandomTask,
        createCustomTask,
        addRandomAd,
        requestWithdrawal,
        updateKYC,
        updateGatewayConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
