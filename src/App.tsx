import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AdVideoPlayer } from './components/AdVideoPlayer';
import { TaskManager } from './components/TaskManager';
import { WalletCard } from './components/WalletCard';
import { LedgerTable } from './components/LedgerTable';
import { WithdrawalModal } from './components/WithdrawalModal';
import { PayoutReceiptModal } from './components/PayoutReceiptModal';
import { VerificationKYC } from './components/VerificationKYC';
import { GatewaySettings } from './components/GatewaySettings';
import { EconomicsTransparency } from './components/EconomicsTransparency';
import { ReferralSection } from './components/ReferralSection';
import { AdvertiserPortal } from './components/AdvertiserPortal';
import { FullStackGatewayAnalysis } from './components/FullStackGatewayAnalysis';
import { NotificationToast } from './components/NotificationToast';
import { TaskModal } from './components/TaskModal';
import { MicroTask } from './types';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    latestReceipt,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
  } = useApp();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<MicroTask | null>(null);

  const handleOpenWithdraw = () => {
    setIsWithdrawOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onOpenWithdraw={handleOpenWithdraw}
            onOpenTaskModal={(task) => setSelectedTaskForModal(task)}
          />
        )}

        {activeTab === 'ads' && (
          <div className="space-y-6">
            <AdVideoPlayer />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <TaskManager />
          </div>
        )}

        {activeTab === 'advertiser' && (
          <div className="space-y-6">
            <AdvertiserPortal />
          </div>
        )}

        {activeTab === 'gateway-analysis' && (
          <div className="space-y-6">
            <FullStackGatewayAnalysis />
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-6">
            <ReferralSection />
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-8">
            <WalletCard onOpenWithdraw={handleOpenWithdraw} />
            <LedgerTable />
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="space-y-8">
            <WalletCard onOpenWithdraw={handleOpenWithdraw} />
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Disbursement Portal</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Request instant payouts directly to your PayPal account, Stripe ACH bank direct deposit, Wise wire, or USDC stablecoin.
              </p>
              <button
                onClick={handleOpenWithdraw}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Open Real Withdrawal Window
              </button>
            </div>
            <LedgerTable />
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-6">
            <VerificationKYC />
          </div>
        )}

        {activeTab === 'gateways' && (
          <div className="space-y-6">
            <GatewaySettings />
          </div>
        )}

        {activeTab === 'transparency' && (
          <div className="space-y-6">
            <EconomicsTransparency />
          </div>
        )}
      </main>

      {/* Notification Toast System */}
      <NotificationToast />

      {/* Global Modals */}
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />

      <PayoutReceiptModal
        receipt={latestReceipt}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {selectedTaskForModal && (
        <TaskModal
          task={selectedTaskForModal}
          onClose={() => setSelectedTaskForModal(null)}
        />
      )}

      {/* Footer conforming to domain rules */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">AdRewards Pro</span>
            <span>—</span>
            <span>Two-Sided Micro-Earnings & Production Payment Engine</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('gateway-analysis')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Gateway Architecture
            </button>
            <button
              onClick={() => setActiveTab('advertiser')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Advertiser Deposit Portal
            </button>
            <button
              onClick={() => setActiveTab('transparency')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              75/25 Economics
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              KYC & Anti-Fraud
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
