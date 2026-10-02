import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  TrendingUp,
  DollarSign,
  Sparkles,
  PieChart,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export const EstimatedMonthlyEarningsCard: React.FC = () => {
  const { earningsHistory, todayEarnedUSD, dailyTargetUSD } = useApp();

  // Compute stats from the 30-day ledger history
  const total30Days = earningsHistory.reduce((sum, p) => sum + p.totalEarnings, 0);
  const totalAdEarnings = earningsHistory.reduce((sum, p) => sum + p.adEarnings, 0);
  const totalTaskEarnings = earningsHistory.reduce((sum, p) => sum + p.taskEarnings, 0);

  const daysCount = earningsHistory.length || 30;
  const dailyAverage = total30Days / daysCount;

  // 30-day month projection
  const estimatedMonthly = dailyAverage * 30;
  const estimatedAnnual = dailyAverage * 365;

  const adRatio = total30Days > 0 ? (totalAdEarnings / total30Days) * 100 : 25;
  const taskRatio = total30Days > 0 ? (totalTaskEarnings / total30Days) * 100 : 75;

  // Pace comparison versus minimum $5.00 daily target ($150/month)
  const pacePercentage = Math.min(100, (estimatedMonthly / (dailyTargetUSD * 30)) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden space-y-4">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Estimated Monthly Earnings</h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/25">
                Active 30-Day Run-Rate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Projected real dollar earnings calculated from your 30-day verified ledger performance
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
            Projected Monthly Sum
          </span>
          <div className="font-mono text-2xl font-black text-emerald-400 tabular-nums">
            $<AnimatedCounter value={estimatedMonthly} decimals={2} prefix="" /> USD
          </div>
        </div>
      </div>

      {/* 3 Metric Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 text-xs">
        <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
            Daily Average Pace
          </span>
          <p className="font-mono text-base font-bold text-white tabular-nums">
            ${dailyAverage.toFixed(2)} / day
          </p>
          <p className="text-[11px] text-slate-500">Based on past 30 days of data</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
            Annualized Projection
          </span>
          <p className="font-mono text-base font-bold text-blue-400 tabular-nums">
            ${estimatedAnnual.toFixed(2)} / year
          </p>
          <p className="text-[11px] text-slate-500">Assuming steady run-rate</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
            Max Potential Run-Rate
          </span>
          <p className="font-mono text-base font-bold text-amber-400 tabular-nums">
            ${(dailyTargetUSD * 30).toFixed(2)} / month
          </p>
          <p className="text-[11px] text-slate-500">At $5.00 daily target pace</p>
        </div>
      </div>

      {/* Target Pace Progress Bar */}
      <div className="space-y-1.5 pt-1 relative z-10">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <span>Pace to Target ($150.00/mo):</span>
            <strong className="text-emerald-400 font-mono">{pacePercentage.toFixed(1)}%</strong>
          </span>
          <span className="text-slate-400 text-[11px]">
            Earnings Split: <span className="text-blue-400">{taskRatio.toFixed(0)}% Tasks</span> · <span className="text-emerald-400">{adRatio.toFixed(0)}% Ads</span>
          </span>
        </div>

        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${pacePercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
