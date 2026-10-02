import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Copy,
  CheckCircle2,
  DollarSign,
  Share2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Gift,
  ExternalLink,
} from 'lucide-react';

export const ReferralSection: React.FC = () => {
  const {
    referrals,
    referralCode,
    totalReferralCommission,
    claimReferralCommission,
    availableBalance,
  } = useApp();

  const [copied, setCopied] = useState<boolean>(false);
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);

  const inviteUrl = `${window.location.origin}/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClaim = () => {
    if (totalReferralCommission <= 0) return;
    claimReferralCommission();
    setClaimSuccess(true);
    setTimeout(() => setClaimSuccess(false), 4000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Join me on AdRewards Pro to earn real dollars watching verified sponsor ads and answering quick surveys! Use my invite link:`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(inviteUrl)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Earn real dollars watching ads and taking surveys! ${inviteUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent('Join AdRewards Pro and earn real dollars!')}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Invite Friends & Earn 10% Lifetime Ad Share</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
              Passive Commission
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Generate your personal invite link. Whenever your referred friends watch ads or complete tasks, you automatically earn 10% of their ad rewards for life.
          </p>
        </div>

        {totalReferralCommission > 0 && (
          <button
            onClick={handleClaim}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Claim +${totalReferralCommission.toFixed(2)} to Wallet</span>
          </button>
        )}
      </div>

      {claimSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Referral commissions successfully transferred to your available wallet balance!</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Friends</p>
            <p className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {referrals.length}
            </p>
          </div>
          <Users className="w-6 h-6 text-blue-500/40" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Claimable Commission</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              ${totalReferralCommission.toFixed(2)} USD
            </p>
          </div>
          <DollarSign className="w-6 h-6 text-emerald-500/40" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Commission Rate</p>
            <p className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              10% Lifetime
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-amber-500/40" />
        </div>
      </div>

      {/* Unique Invite Link Generator Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Your Personal Referral Link & Code</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Share this link across social channels, forums, or with colleagues to build your passive rewards network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between font-mono text-xs text-slate-200 truncate">
            <span className="truncate pr-3">{inviteUrl}</span>
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold shrink-0">
              Code: {referralCode}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>
        </div>

        {/* 1-Click Social Sharing */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-medium mr-1">Quick Share:</span>
          <button
            onClick={shareOnTwitter}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            X / Twitter
          </button>
          <button
            onClick={shareOnWhatsApp}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            WhatsApp
          </button>
          <button
            onClick={shareOnTelegram}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Telegram
          </button>
        </div>
      </div>

      {/* Friends Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Referred Friends Roster ({referrals.length})
          </h4>
          <span className="text-xs text-slate-500 font-mono">10% Platform Revenue Match</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Friend Name</th>
                <th className="py-3 px-4">Date Joined</th>
                <th className="py-3 px-4 text-center">Ads Watched</th>
                <th className="py-3 px-4 text-center">Tasks Completed</th>
                <th className="py-3 px-4 text-right">Commission Accrued</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {referrals.map((friend) => (
                <tr key={friend.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {friend.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {friend.joinDate}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                    {friend.adsWatched}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                    {friend.tasksCompleted}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                    +${friend.commissionEarnedUSD.toFixed(2)} USD
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
