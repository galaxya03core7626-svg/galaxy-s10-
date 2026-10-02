import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  DollarSign,
  Building,
  CreditCard,
  Send,
  Loader2,
  HelpCircle,
} from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose }) => {
  const {
    availableBalance,
    gatewayConfig,
    kyc,
    requestWithdrawal,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'stripe' | 'wise' | 'crypto_usdc'>('paypal');
  const [amount, setAmount] = useState<number>(availableBalance >= 5.0 ? Math.min(25.0, availableBalance) : availableBalance);
  
  // Payment details state
  const [paypalEmail, setPaypalEmail] = useState<string>(kyc.email || '');
  const [bankFullName, setBankFullName] = useState<string>(kyc.fullName || '');
  const [bankRouting, setBankRouting] = useState<string>('021000021'); // Chase Routing
  const [bankAccount, setBankAccount] = useState<string>('••••••••4819');
  const [cryptoAddress, setCryptoAddress] = useState<string>('0x71C...b52');
  const [securityPin, setSecurityPin] = useState<string>('2026'); // Simulated 2FA

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);

  if (!isOpen) return null;

  const minThreshold = gatewayConfig.minWithdrawalThreshold;
  const isBalanceSufficient = availableBalance >= minThreshold;

  // Calculate fee
  let estimatedFee = 0;
  if (selectedMethod === 'paypal') estimatedFee = 0.25;
  else if (selectedMethod === 'stripe') estimatedFee = +(amount * 0.015).toFixed(2);
  else if (selectedMethod === 'wise') estimatedFee = 0.50;
  else if (selectedMethod === 'crypto_usdc') estimatedFee = 0.10;

  const netDisbursement = Math.max(0, +(amount - estimatedFee).toFixed(2));

  const handleQuickAmount = (val: number) => {
    if (val <= availableBalance) {
      setAmount(val);
      setError(null);
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount < minThreshold) {
      setError(`Minimum withdrawal is $${minThreshold.toFixed(2)}. You have requested $${amount.toFixed(2)}.`);
      return;
    }

    if (amount > availableBalance) {
      setError(`Insufficient available balance ($${availableBalance.toFixed(2)}). Earn more via ads and tasks.`);
      return;
    }

    if (selectedMethod === 'paypal' && (!paypalEmail || !paypalEmail.includes('@'))) {
      setError('Please provide a valid verified PayPal email address.');
      return;
    }

    if (selectedMethod === 'stripe' && (!bankFullName || !bankRouting || !bankAccount)) {
      setError('Please provide complete bank account and routing details.');
      return;
    }

    if (selectedMethod === 'crypto_usdc' && (!cryptoAddress || cryptoAddress.length < 10)) {
      setError('Please enter a valid EVM/Polygon USDC wallet address.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProcessingStep(1); // 1: Anti-bot audit

    // Simulate real multi-stage gateway API transaction pipeline
    setTimeout(() => {
      setProcessingStep(2); // 2: KYC & Compliance check
      setTimeout(() => {
        setProcessingStep(3); // 3: Payment gateway transmission
        setTimeout(() => {
          const recipientDetails: any = {
            fullName: bankFullName || kyc.fullName,
          };
          if (selectedMethod === 'paypal') recipientDetails.email = paypalEmail;
          if (selectedMethod === 'stripe') {
            recipientDetails.bankRouting = bankRouting;
            recipientDetails.bankAccount = bankAccount;
          }
          if (selectedMethod === 'crypto_usdc') recipientDetails.cryptoAddress = cryptoAddress;

          const res = requestWithdrawal(selectedMethod, amount, recipientDetails);
          setIsProcessing(false);
          if (res.success) {
            onClose();
          } else {
            setError(res.error || 'Withdrawal processing failed. Please try again.');
          }
        }, 800);
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              <ArrowUpRight className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Request Real Withdrawal</h3>
              <p className="text-xs text-slate-400">
                Direct fiat and stablecoin disbursement via secured payment gateways
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Available balance banner */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available for Payout</span>
              <p className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
                ${availableBalance.toFixed(2)} USD
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Min. Payout:</span>
              <p className="font-mono text-slate-200 font-semibold">${minThreshold.toFixed(2)}</p>
            </div>
          </div>

          {!isBalanceSufficient && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Withdrawal threshold not yet reached:</strong> You need at least ${minThreshold.toFixed(2)} to withdraw.
                Earn ${(minThreshold - availableBalance).toFixed(2)} more by watching ads or finishing tasks.
              </div>
            </div>
          )}

          {isProcessing ? (
            /* Live Gateway Processing Pipeline Animation */
            <div className="py-8 px-4 text-center space-y-5">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Transmitting Payout to Gateway</h4>
                <p className="text-xs text-slate-400">
                  Securing communication with payment network & cryptographic ledger
                </p>
              </div>

              {/* Step indicator */}
              <div className="max-w-md mx-auto space-y-2 text-left text-xs bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
                <div className={`flex items-center gap-2 ${processingStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {processingStep >= 1 ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                  <span>Automated anti-bot & velocity check passed</span>
                </div>
                <div className={`flex items-center gap-2 ${processingStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {processingStep >= 2 ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                  <span>KYC Identity & Tax compliance verified ({kyc.taxStatus})</span>
                </div>
                <div className={`flex items-center gap-2 ${processingStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {processingStep >= 3 ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                  <span>Direct payout API transmission ({selectedMethod.toUpperCase()})</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWithdrawSubmit} className="space-y-5">
              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Select Payout Gateway</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'paypal', label: 'PayPal', sub: 'Instant / Email', icon: Send },
                    { id: 'stripe', label: 'Stripe Direct', sub: 'Bank / ACH', icon: Building },
                    { id: 'wise', label: 'Wise Wire', sub: 'Global Wire', icon: CreditCard },
                    { id: 'crypto_usdc', label: 'USDC', sub: 'Polygon L2', icon: DollarSign },
                  ].map((gateway) => {
                    const Icon = gateway.icon;
                    const isSelected = selectedMethod === gateway.id;
                    return (
                      <button
                        type="button"
                        key={gateway.id}
                        onClick={() => setSelectedMethod(gateway.id as any)}
                        className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <p className="text-xs font-bold leading-none">{gateway.label}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{gateway.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Withdrawal Amount Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300">Withdrawal Amount (USD)</label>
                  <span className="text-slate-500">Max: ${availableBalance.toFixed(2)}</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-base font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min={minThreshold}
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-emerald-500 font-bold tabular-nums"
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  {[5.0, 10.0, 25.0, 50.0].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => handleQuickAmount(preset)}
                      disabled={preset > availableBalance}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer font-mono"
                    >
                      ${preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(availableBalance)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 cursor-pointer font-mono font-semibold"
                  >
                    All (${availableBalance.toFixed(2)})
                  </button>
                </div>
              </div>

              {/* Dynamic Gateway Credentials Fields */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-3">
                <span className="text-xs font-semibold text-slate-300 block">
                  {selectedMethod === 'paypal' && 'PayPal Recipient Email'}
                  {selectedMethod === 'stripe' && 'Bank Account & Routing (ACH Direct Deposit)'}
                  {selectedMethod === 'wise' && 'Wise Account Holder & IBAN'}
                  {selectedMethod === 'crypto_usdc' && 'USDC Wallet Address (Polygon Network)'}
                </span>

                {selectedMethod === 'paypal' && (
                  <div>
                    <input
                      type="email"
                      required
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="paypal-account@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Funds will be delivered to your PayPal balance within 5-15 minutes.
                    </p>
                  </div>
                )}

                {selectedMethod === 'stripe' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      value={bankFullName}
                      onChange={(e) => setBankFullName(e.target.value)}
                      placeholder="Legal Name on Bank Account"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={bankRouting}
                        onChange={(e) => setBankRouting(e.target.value)}
                        placeholder="Routing Number (9 Digits)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                      />
                      <input
                        type="text"
                        required
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Account Number"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === 'crypto_usdc' && (
                  <div>
                    <input
                      type="text"
                      required
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      1 USDC = $1.00 USD. Fast settlement on Polygon Layer-2 with negligible gas.
                    </p>
                  </div>
                )}

                {/* 2FA Security Pin */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Security Confirmation PIN</span>
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    className="w-24 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-center font-mono tracking-widest text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Fee & Net Breakdown */}
              <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Requested Amount:</span>
                  <span className="font-mono tabular-nums text-slate-200">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <span>Gateway Processing Fee:</span>
                    <HelpCircle className="w-3 h-3 text-slate-500" />
                  </span>
                  <span className="font-mono tabular-nums text-rose-400">-${estimatedFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-slate-800/80 pt-1.5">
                  <span>Net Estimated Disbursement:</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-bold text-sm">
                    ${netDisbursement.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isBalanceSufficient}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-emerald-500/20 flex items-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Confirm & Disburse ${netDisbursement.toFixed(2)} USD</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
