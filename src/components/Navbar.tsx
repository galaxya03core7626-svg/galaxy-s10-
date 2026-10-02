import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  ShieldCheck,
  PlayCircle,
  CheckSquare,
  ArrowUpRight,
  Sliders,
  Users,
  Megaphone,
  Server,
} from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, availableBalance, kyc } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              AdRewards Pro
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-white border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ads'
                ? 'text-white border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            Watch & Earn
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'text-white border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-blue-400" />
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('advertiser')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'advertiser'
                ? 'text-white border-b-2 border-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Megaphone className="w-4 h-4 text-blue-400" />
            Advertiser Hub
          </button>
          <button
            onClick={() => setActiveTab('gateway-analysis')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gateway-analysis'
                ? 'text-white border-b-2 border-purple-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4 text-purple-400" />
            Gateway Arch
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'referrals'
                ? 'text-white border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            Referrals
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wallet'
                ? 'text-white border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'text-white border-b-2 border-slate-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            KYC
          </button>
        </nav>

        {/* Zone 3: Dynamic Real-Time KYC Indicator & Actions */}
        <div className="flex items-center gap-3">
          {/* Dynamic User Verification Status Indicator */}
          <button
            onClick={() => setActiveTab('verification')}
            className="hidden sm:flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer group"
            title="Click to view KYC profile or resolve pending tax documents"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${kyc.tier === 3 ? 'bg-emerald-400' : 'bg-purple-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${kyc.tier === 3 ? 'bg-emerald-500' : 'bg-purple-500'}`} />
            </span>
            <div className="text-left flex items-center gap-1.5">
              <span className="font-semibold text-slate-200">
                Tier {kyc.tier} {kyc.tier === 3 ? 'Tax Verified' : 'ID Verified'}
              </span>
              {kyc.tier < 3 && (
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono font-medium group-hover:bg-purple-500/30 transition-colors">
                  Resolve W-9 →
                </span>
              )}
            </div>
          </button>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available</span>
            <AnimatedCounter
              value={availableBalance}
              className="text-emerald-400 font-bold text-sm"
            />
          </div>

          <button
            onClick={() => setActiveTab('withdraw')}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap shadow-sm shadow-emerald-500/20"
          >
            <span>Withdraw Real</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-3 px-4 py-2 border-t border-slate-900 text-xs font-medium text-slate-400 scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`whitespace-nowrap py-1 ${activeTab === 'dashboard' ? 'text-white font-semibold' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`whitespace-nowrap py-1 ${activeTab === 'ads' ? 'text-emerald-400 font-semibold' : ''}`}
        >
          Watch Ads
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`whitespace-nowrap py-1 ${activeTab === 'tasks' ? 'text-blue-400 font-semibold' : ''}`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab('advertiser')}
          className={`whitespace-nowrap py-1 ${activeTab === 'advertiser' ? 'text-blue-400 font-semibold' : ''}`}
        >
          Advertiser Hub
        </button>
        <button
          onClick={() => setActiveTab('gateway-analysis')}
          className={`whitespace-nowrap py-1 ${activeTab === 'gateway-analysis' ? 'text-purple-400 font-semibold' : ''}`}
        >
          Gateway Arch
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`whitespace-nowrap py-1 ${activeTab === 'referrals' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Referrals
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`whitespace-nowrap py-1 ${activeTab === 'wallet' ? 'text-emerald-400 font-semibold' : ''}`}
        >
          Wallet
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`whitespace-nowrap py-1 ${activeTab === 'verification' ? 'text-slate-200 font-semibold' : ''}`}
        >
          KYC
        </button>
      </div>
    </header>
  );
};
