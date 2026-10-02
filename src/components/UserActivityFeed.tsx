import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import {
  Activity,
  PlayCircle,
  CheckSquare,
  ArrowUpRight,
  Flame,
  Award,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const UserActivityFeed: React.FC = () => {
  const { transactions, setLatestReceipt, setIsReceiptModalOpen } = useApp();
  const [filter, setFilter] = useState<'all' | 'ad_view' | 'task_reward' | 'withdrawal' | 'bonus'>('all');

  const filtered = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const handleOpenVoucher = (tx: Transaction) => {
    if (tx.type === 'withdrawal') {
      setLatestReceipt({
        id: tx.id,
        amount: Math.abs(tx.amount),
        method: (tx.gateway as any) || 'paypal',
        recipientDetails: {
          email: tx.payoutAddress || 'User Account',
          fullName: 'Alex Vance',
        },
        fee: 0.25,
        netAmount: Math.max(0, Math.abs(tx.amount) - 0.25),
        status: 'completed',
        createdAt: tx.timestamp,
        transactionHash: tx.referenceHash,
        gatewayReferenceId: tx.receiptNumber || 'PAYPAL_PO_8849201',
      });
      setIsReceiptModalOpen(true);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ad_view':
        return <PlayCircle className="w-4 h-4 text-emerald-400" />;
      case 'task_reward':
        return <CheckSquare className="w-4 h-4 text-blue-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      case 'bonus':
        return <Flame className="w-4 h-4 text-amber-400" />;
      default:
        return <Award className="w-4 h-4 text-purple-400" />;
    }
  };

  const getStatusBadge = (tx: Transaction) => {
    if (tx.type === 'withdrawal') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Disbursed</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
        <CheckCircle2 className="w-3 h-3" />
        <span>Audited</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Live User Activity Feed</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time chronological audit stream of all completed tasks, verified video views, and gateway payouts
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'task_reward', label: 'Tasks' },
            { id: 'ad_view', label: 'Ads' },
            { id: 'withdrawal', label: 'Payouts' },
            { id: 'bonus', label: 'Streaks' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === item.id
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No activity found for this filter.</p>
        ) : (
          filtered.slice(0, 10).map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <div
                key={tx.id}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 p-3.5 rounded-xl flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getActivityIcon(tx.type)}
                  </div>

                  <div className="truncate pr-2 space-y-0.5">
                    <p className="text-xs font-bold text-white truncate">{tx.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{tx.timestamp}</span>
                      <span>·</span>
                      <span className="text-slate-500 truncate max-w-[140px]">{tx.description}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span
                      className={`font-mono text-xs font-bold tabular-nums block ${
                        isCredit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isCredit ? '+' : ''}${tx.amount.toFixed(2)} USD
                    </span>
                    {getStatusBadge(tx)}
                  </div>

                  {tx.type === 'withdrawal' && (
                    <button
                      onClick={() => handleOpenVoucher(tx)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline underline-offset-2 flex items-center gap-1"
                    >
                      <span>Voucher</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
