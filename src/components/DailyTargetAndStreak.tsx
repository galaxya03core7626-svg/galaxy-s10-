import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, CheckCircle2, Target, Sparkles, Trophy, ArrowRight, Gift } from 'lucide-react';

export const DailyTargetAndStreak: React.FC = () => {
  const {
    streak,
    claimDailyStreakBonus,
    dailyTargetUSD,
    todayEarnedUSD,
    setActiveTab,
  } = useApp();

  const targetProgress = Math.min(100, (todayEarnedUSD / dailyTargetUSD) * 100);
  const tasksRemaining = Math.max(0, streak.targetTasksPerDay - streak.tasksCompletedToday);
  const isStreakTargetMet = streak.tasksCompletedToday >= streak.targetTasksPerDay;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Daily Target Earnings Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Target className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Daily Earnings Target
              </h4>
              <p className="text-[11px] text-slate-400">
                Today's Goal: <strong className="text-slate-200 font-mono">${dailyTargetUSD.toFixed(2)} USD</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
              ${todayEarnedUSD.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-500 block">/ ${dailyTargetUSD.toFixed(2)}</span>
          </div>
        </div>

        {/* Progress Bar with milestone ticks */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                targetProgress >= 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-300'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${targetProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>$0.00</span>
            <span>$2.50 (50%)</span>
            <span className={targetProgress >= 100 ? 'text-emerald-400 font-bold' : ''}>
              ${dailyTargetUSD.toFixed(2)} (Goal)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
          <span className="text-slate-400 text-[11px]">
            {targetProgress >= 100 ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Target achieved! Extra earnings go directly to wallet.
              </span>
            ) : (
              <span>${(dailyTargetUSD - todayEarnedUSD).toFixed(2)} remaining to hit target</span>
            )}
          </span>

          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Earn More</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Daily Streak Reward Feature (3 tasks/day = +$1.00 bonus) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Daily Tasks Streak
                </h4>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20">
                  {streak.streakDays} Days 🔥
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Complete 3 tasks today to earn <strong className="text-emerald-400 font-mono">+${streak.bonusAmount.toFixed(2)} Bonus</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
              {streak.tasksCompletedToday} / {streak.targetTasksPerDay}
            </span>
            <span className="text-[11px] text-slate-500 block">Tasks Done</span>
          </div>
        </div>

        {/* 3 Step Streak Progress Indicators */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[1, 2, 3].map((step) => {
            const isCompleted = streak.tasksCompletedToday >= step;
            return (
              <div
                key={step}
                className={`p-2 rounded-lg text-center border transition-all ${
                  isCompleted
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[10px] flex items-center justify-center">
                      {step}
                    </span>
                  )}
                  <span>Task {step}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status / Claim action */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
          <div className="text-slate-400 text-[11px]">
            {isStreakTargetMet ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {streak.isBonusClaimedToday
                  ? `Day ${streak.streakDays} streak bonus +$${streak.bonusAmount.toFixed(2)} awarded!`
                  : `3 Tasks complete! Claim your +$${streak.bonusAmount.toFixed(2)} bonus.`}
              </span>
            ) : (
              <span>Complete {tasksRemaining} more task{tasksRemaining > 1 ? 's' : ''} to unlock +${streak.bonusAmount.toFixed(2)}</span>
            )}
          </div>

          {isStreakTargetMet && !streak.isBonusClaimedToday ? (
            <button
              onClick={claimDailyStreakBonus}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Claim +${streak.bonusAmount.toFixed(2)}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View Tasks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
