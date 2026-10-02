import React from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, ArrowUpRight, ShieldCheck, CheckCircle2, AlertCircle, History } from 'lucide-react';

import { AnimatedCounter } from './AnimatedCounter';

interface WalletCardProps {
  onOpenWithdraw?: () => void;
  onViewLedger?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ onOpenWithdraw, onViewLedger }) => {
  const {
    availableBalance,
    pendingBalance,
    lifetimeEarned,
    lifetimeWithdrawn,
    gatewayConfig,
    kyc,
    setActiveTab,
  } = useApp();

  const minThreshold = gatewayConfig.minWithdrawalThreshold;
  const isEligibleForWithdrawal = availableBalance >= minThreshold;
  const progressPercent = Math.min(100, (availableBalance / minThreshold) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
      {/* Background glow subtle */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Main Balance display */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Audited Real Balance (USD)</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 lowercase font-mono">1 USD = 1.00 USD</span>
          </div>

          <div className="flex items-baseline gap-3">
            <AnimatedCounter
              value={availableBalance}
              className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white tabular-nums"
            />
            <span className="text-sm font-medium text-slate-400">Available to Withdraw</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
            <div>
              <span className="text-slate-500">Pending Clearance: </span>
              <span className="font-mono text-slate-300 font-semibold tabular-nums">
                ${pendingBalance.toFixed(2)}
              </span>
            </div>
            <span className="text-slate-700">·</span>
            <div>
              <span className="text-slate-500">Lifetime Earned: </span>
              <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                ${lifetimeEarned.toFixed(2)}
              </span>
            </div>
            <span className="text-slate-700">·</span>
            <div>
              <span className="text-slate-500">Total Paid Out: </span>
              <span className="font-mono text-blue-400 font-semibold tabular-nums">
                ${lifetimeWithdrawn.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Payout Threshold Meter */}
        <div className="lg:w-96 flex flex-col gap-4 bg-slate-950/60 border border-slate-800/80 p-4 rounded-lg">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Payout Threshold (${minThreshold.toFixed(2)} Min)</span>
              <span className="font-mono text-slate-300 tabular-nums font-semibold">
                {progressPercent.toFixed(0)}%
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isEligibleForWithdrawal ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {isEligibleForWithdrawal ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Threshold reached. Immediate real payout available.</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>
                    Earn ${(minThreshold - availableBalance).toFixed(2)} more to reach minimum withdrawal.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                if (onOpenWithdraw) {
                  onOpenWithdraw();
                } else {
                  setActiveTab('withdraw');
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs transition-colors cursor-pointer shadow-sm shadow-emerald-500/10"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw Real Dollars</span>
            </button>

            <button
              onClick={() => {
                if (onViewLedger) {
                  onViewLedger();
                } else {
                  setActiveTab('wallet');
                }
              }}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2.5 rounded-lg text-xs transition-colors cursor-pointer border border-slate-700"
              title="View full cryptographic transaction ledger"
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Security Baseline Ribbon */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>
            KYC Identity Tier {kyc.tier} Verified · Trust Score:{' '}
            <strong className="text-white font-mono">{kyc.trustScore}%</strong>
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
          <span>GATEWAYS: PAYPAL PAYOUTS · STRIPE DIRECT · ACH · USDC</span>
        </div>
      </div>
    </div>
  );
};
