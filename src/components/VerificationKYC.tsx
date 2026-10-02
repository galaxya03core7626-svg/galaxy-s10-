import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  UserCheck,
  Upload,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  Globe,
  Award,
} from 'lucide-react';

export const VerificationKYC: React.FC = () => {
  const { kyc, updateKYC } = useApp();
  const [activeTierTab, setActiveTierTab] = useState<number>(2);
  const [idFileUploaded, setIdFileUploaded] = useState<boolean>(true);
  const [taxName, setTaxName] = useState<string>(kyc.fullName);
  const [taxNumber, setTaxNumber] = useState<string>('•••-••-8492'); // Masked SSN / TIN
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    updateKYC({
      taxStatus: 'w9_verified',
      tier: 3,
      trustScore: 99,
    });
    setSaveSuccess('Form W-9 Tax Certification verified and linked to payment processor.');
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleSimulateIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFileUploaded(true);
      updateKYC({
        isIdVerified: true,
        trustScore: 98,
      });
      setSaveSuccess('Government ID photo processed and biometric liveness verified.');
      setTimeout(() => setSaveSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Robust User Verification & Compliance</span>
            <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
              Tier {kyc.tier} Verified
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real dollar payouts require standard identity verification (KYC/AML) and tax certification to comply with payment gateway regulations.
          </p>
        </div>

        {/* Live Trust Score badge */}
        <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
          <Award className="w-5 h-5 text-purple-400" />
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Account Trust Score
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                {kyc.trustScore}%
              </span>
              <span className="text-xs text-emerald-400 font-medium font-mono">Low Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Anti-Bot Screen</h4>
            <p className="text-xs text-slate-400 mt-1">
              Active tab attention verified. Automated CAPTCHA & keystroke velocity in nominal parameters.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Payment Gateway Trust</h4>
            <p className="text-xs text-slate-400 mt-1">
              PayPal Payouts & Stripe Connect pre-authorization cleared for instant disbursements.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Tax Documentation</h4>
            <p className="text-xs text-slate-400 mt-1">
              IRS W-9 compliance certificate active. Threshold reporting up to $600/year authorized.
            </p>
          </div>
        </div>
      </div>

      {/* KYC Tier Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { tier: 1, title: 'Tier 1: Contact & SMS' },
            { tier: 2, title: 'Tier 2: Government ID & Liveness' },
            { tier: 3, title: 'Tier 3: Tax Certification (W-9 / W-8)' },
          ].map((tab) => (
            <button
              key={tab.tier}
              onClick={() => setActiveTierTab(tab.tier)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTierTab === tab.tier
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Tier 1 Content */}
        {activeTierTab === 1 && (
          <div className="space-y-4 max-w-lg text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-white font-semibold">Primary Email Address</p>
                  <p className="text-slate-400 font-mono">{kyc.email}</p>
                </div>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-white font-semibold">Mobile Phone (2FA SMS)</p>
                  <p className="text-slate-400 font-mono">{kyc.phone}</p>
                </div>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">Country Jurisdiction</p>
                  <p className="text-slate-400">{kyc.country}</p>
                </div>
              </div>
              <span className="text-slate-400 font-mono">United States</span>
            </div>
          </div>
        )}

        {/* Tier 2 Content */}
        {activeTierTab === 2 && (
          <div className="space-y-4 max-w-xl text-xs">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Government Photo ID Verification</h4>
                  <p className="text-slate-400 mt-0.5">
                    Passport, Driver's License, or National Identity Card
                  </p>
                </div>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Active
                </span>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl text-center space-y-2 bg-slate-900/50">
                <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="text-slate-300 font-medium">Verified ID: State Driver's License (Alex Vance)</p>
                <p className="text-slate-500 text-[11px]">
                  Encrypted AES-256 storage · Complies with FinCEN customer due diligence rules
                </p>

                <label className="inline-block mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer">
                  <span>Re-upload Document</span>
                  <input type="file" accept="image/*,.pdf" onChange={handleSimulateIdUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tier 3 Content */}
        {activeTierTab === 3 && (
          <form onSubmit={handleSaveTax} className="space-y-4 max-w-lg text-xs">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Form W-9 Tax Certification (US)</h4>
                <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </span>
              </div>
              <p className="text-slate-400">
                Payment processors are required by the IRS to collect taxpayer identification numbers before issuing 1099-K tax statements.
              </p>

              <div className="space-y-2 pt-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Legal Name</label>
                  <input
                    type="text"
                    value={taxName}
                    onChange={(e) => setTaxName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Taxpayer ID (SSN / EIN)</label>
                  <input
                    type="text"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Save & Update Tax Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
