import React from 'react';
import { useApp } from '../context/AppContext';
import { WalletCard } from './WalletCard';
import { DailyTargetAndStreak } from './DailyTargetAndStreak';
import { EarningsTrendChart } from './EarningsTrendChart';
import { UserActivityFeed } from './UserActivityFeed';
import { AdVideoPlayer } from './AdVideoPlayer';
import { EstimatedMonthlyEarningsCard } from './EstimatedMonthlyEarningsCard';
import {
  PlayCircle,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Trophy,
  X,
  Users,
} from 'lucide-react';

interface DashboardProps {
  onOpenWithdraw: () => void;
  onOpenTaskModal: (task: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenWithdraw, onOpenTaskModal }) => {
  const {
    tasks,
    setActiveTab,
    ads,
    streakCelebration,
    setStreakCelebration,
    referrals,
    totalReferralCommission,
  } = useApp();

  const openTasks = tasks.filter((t) => !t.completed).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 1. Real Dollar Wallet Overview with Animated Incremental Counter */}
      <WalletCard
        onOpenWithdraw={onOpenWithdraw}
        onViewLedger={() => setActiveTab('wallet')}
      />

      {/* 2. Daily Target Progress Bar & 3-Task Daily Streak Reward Widget */}
      <DailyTargetAndStreak />

      {/* 3. Estimated Monthly Earnings Run-Rate Card */}
      <EstimatedMonthlyEarningsCard />

      {/* Quick Launch Banner with Referrals Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('ads')}
          className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left group cursor-pointer shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 tabular-nums">
              +${(ads[0]?.rewardUSD || 0.18).toFixed(2)} / Ad
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
            Watch Sponsor Ads
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Verified 15s commercial streams with instant dollar crediting.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 to-slate-900 border border-blue-500/30 hover:border-blue-500/60 transition-all text-left group cursor-pointer shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30 tabular-nums">
              Up to $3.50 / Task
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
            Complete Micro-Tasks
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Answer market surveys, test checkout UX, and train search AI.
          </p>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition-all text-left group cursor-pointer shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 tabular-nums">
              10% Lifetime Share
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
            Invite Friends ({referrals.length})
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Claim +${totalReferralCommission.toFixed(2)} in passive commissions.
          </p>
        </button>
      </div>

      {/* 3. Recharts 30-Day Daily Earnings Trend Chart */}
      <EarningsTrendChart />

      {/* 4. Main Working Engine: In-App Video Player Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-lg font-bold text-white">Live Ad Video Engine</h3>
          </div>
          <button
            onClick={() => setActiveTab('ads')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>View All Campaigns</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <AdVideoPlayer />
      </section>

      {/* 5. Priority Tasks Quick List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white">High-Yield Priority Tasks</h4>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Browse All ({tasks.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {openTasks.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center col-span-3">
              All priority tasks completed! Check back soon or click "Add Random Sponsor Task".
            </p>
          ) : (
            openTasks.map((t) => (
              <div
                key={t.id}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl flex flex-col justify-between gap-3 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[130px] font-medium">{t.sponsor}</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>~{t.estimatedMinutes}m</span>
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white line-clamp-2">{t.title}</h5>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                    +${t.reward.toFixed(2)} USD
                  </span>
                  <button
                    onClick={() => onOpenTaskModal(t)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Start Task
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 6. Chronological User Activity Feed Below Dashboard Summary */}
      <UserActivityFeed />

      {/* Streak Celebration Popup Modal */}
      {streakCelebration?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative space-y-4">
            <button
              onClick={() => setStreakCelebration(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">Daily Streak Reward!</h4>
              <p className="text-xs text-slate-300 mt-1">
                You completed 3 verified tasks today and extended your streak to{' '}
                <strong className="text-amber-400">{streakCelebration.streakCount} days</strong>!
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Bonus Credited</span>
              <p className="font-mono text-3xl font-extrabold text-emerald-400 tabular-nums">
                +${streakCelebration.bonus.toFixed(2)} USD
              </p>
            </div>

            <button
              onClick={() => setStreakCelebration(null)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Awesome, Keep Going!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
