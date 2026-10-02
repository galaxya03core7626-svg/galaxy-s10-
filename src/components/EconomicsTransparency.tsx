import React from 'react';
import {
  FileText,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle2,
  Lock,
  PieChart,
} from 'lucide-react';

export const EconomicsTransparency: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Economic Transparency & Revenue Architecture</span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
            Audited 75/25 Split
          </span>
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          A completely transparent look into how real ad revenue is generated, advertiser CPM economics, and the verification pipeline that guarantees real cash payouts.
        </p>
      </div>

      {/* 3 Step Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-base font-bold text-white">Advertiser Deposits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real brands (Fintechs, CleanTech firms, Game Studios) deposit advertising budgets into ad networks (Google AdMob, AdSense, Unity) or sponsor research pools at high CPM bids ($15.00 – $35.00 CPM).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-base font-bold text-white">Verified Human Action</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You watch the full ad video without background tab switching, or complete structured market research questionnaires. Anti-bot heuristics guarantee advertisers get authentic human engagement.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-base font-bold text-white">Direct Real Withdrawal</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            75% of the gross advertiser revenue is instantly credited to your available balance. Once you reach the accessible $5.00 threshold, you disburse real dollars directly to your PayPal or Bank.
          </p>
        </div>
      </div>

      {/* Revenue Breakdown Math */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <PieChart className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">The Math: How $1.00 of Revenue is Allocated</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-emerald-400 font-bold font-mono text-xl tabular-nums">75%</span>
            <p className="text-white font-semibold">User Net Earnings</p>
            <p className="text-slate-400 text-[11px]">
              Directly credited to your withdrawable dollar wallet with zero forfeiture.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-blue-400 font-bold font-mono text-xl tabular-nums">15%</span>
            <p className="text-white font-semibold">Gateway & Payout Reserves</p>
            <p className="text-slate-400 text-[11px]">
              Covers PayPal REST, ACH wire clearing, and banking settlement charges.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-purple-400 font-bold font-mono text-xl tabular-nums">6%</span>
            <p className="text-white font-semibold">Anti-Fraud & Compliance</p>
            <p className="text-slate-400 text-[11px]">
              Automated CAPTCHAs, bot filtering, and identity verification infrastructure.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-slate-300 font-bold font-mono text-xl tabular-nums">4%</span>
            <p className="text-white font-semibold">Hosting & Server Maintenance</p>
            <p className="text-slate-400 text-[11px]">
              Cloud video streaming bandwidth, TLS security, and database storage.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ & Real Anti-Fraud Safeguards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Frequently Asked Questions on Real Dollars & Compliance</h3>

        <div className="space-y-4 text-xs divide-y divide-slate-800/80">
          <div className="pt-3 first:pt-0 space-y-1">
            <h4 className="font-bold text-slate-200">Are the earnings real dollars that can be spent?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes. Unlike apps that award worthless proprietary "coins" with impossible $100 payout gates, AdRewards Pro uses standard USD fiat. When you withdraw $10.00, real funds are transmitted via the PayPal Payouts API or Stripe Direct to your bank account.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-slate-200">Why does the video player pause if I leave the window?</h4>
            <p className="text-slate-400 leading-relaxed">
              Advertisers pay for genuine human attention. If users could run 100 muted videos in hidden background tabs, advertisers would stop paying and ban the platform. Keeping the window in focus ensures long-term advertiser trust and sustainable high payouts for all users.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-slate-200">Why is there a minimum $5.00 threshold?</h4>
            <p className="text-slate-400 leading-relaxed">
              Payment networks (such as PayPal and automated clearing houses) charge a baseline fixed processing fee (e.g. $0.25) per transaction. A $5.00 minimum prevents micro-fees from consuming your hard-earned rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
