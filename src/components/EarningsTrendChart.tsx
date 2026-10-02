import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Calendar, DollarSign, Award } from 'lucide-react';

export const EarningsTrendChart: React.FC = () => {
  const { earningsHistory } = useApp();
  const [activeMetric, setActiveMetric] = useState<'total' | 'split'>('split');

  // Compute 30-day stats
  const total30Days = earningsHistory.reduce((sum, p) => sum + p.totalEarnings, 0);
  const avgDaily = total30Days / (earningsHistory.length || 1);
  const peakDay = earningsHistory.reduce(
    (max, p) => (p.totalEarnings > max.totalEarnings ? p : max),
    earningsHistory[0] || { date: 'N/A', totalEarnings: 0 }
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
            <span>{label}, 2026</span>
            <span className="text-[10px] text-slate-500 uppercase">Audit Point</span>
          </p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
              </span>
              <span className="font-bold text-white tabular-nums">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
      {/* Header & Metric stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">30-Day Daily Earnings Performance</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified ad impressions and completed research tasks over the last 30 daily cycles
          </p>
        </div>

        {/* Metric mode toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('split')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeMetric === 'split' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ads vs Tasks Breakdown
          </button>
          <button
            onClick={() => setActiveMetric('total')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeMetric === 'total' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Total Net Earnings
          </button>
        </div>
      </div>

      {/* Metric highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">30-Day Total</span>
            <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
              ${total30Days.toFixed(2)} USD
            </span>
          </div>
          <DollarSign className="w-5 h-5 text-emerald-500/30" />
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Daily Average</span>
            <span className="font-mono text-lg font-bold text-slate-200 tabular-nums">
              ${avgDaily.toFixed(2)} / day
            </span>
          </div>
          <Calendar className="w-5 h-5 text-blue-500/30" />
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Best Single Day</span>
            <span className="font-mono text-lg font-bold text-amber-400 tabular-nums">
              ${peakDay.totalEarnings.toFixed(2)} ({peakDay.date})
            </span>
          </div>
          <Award className="w-5 h-5 text-amber-500/30" />
        </div>
      </div>

      {/* The Recharts Line Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={earningsHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              interval={4}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
              iconSize={8}
            />

            {activeMetric === 'total' ? (
              <Line
                type="monotone"
                dataKey="totalEarnings"
                name="Total Real Earnings ($)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#10b981', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#34d399' }}
              />
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="taskEarnings"
                  name="Task Research Rewards ($)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 4, fill: '#60a5fa' }}
                />
                <Line
                  type="monotone"
                  dataKey="adEarnings"
                  name="Ad Video Views ($)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 4, fill: '#34d399' }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
