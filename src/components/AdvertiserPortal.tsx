import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdCampaign } from '../types';
import {
  Megaphone,
  PlusCircle,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  CreditCard,
  Lock,
  Pause,
  Play,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const AdvertiserPortal: React.FC = () => {
  const { ads, setActiveTab, addNotification } = useApp();

  // Campaign creation modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [sponsor, setSponsor] = useState<string>('');
  const [category, setCategory] = useState<string>('Fintech & SaaS');
  const [tagline, setTagline] = useState<string>('');
  const [duration, setDuration] = useState<number>(15);
  const [grossCPM, setGrossCPM] = useState<number>(24.0);
  const [budgetUSD, setBudgetUSD] = useState<number>(100.0);
  const [quizQuestion, setQuizQuestion] = useState<string>('');
  const [correctOption, setCorrectOption] = useState<string>('');
  const [wrongOption1, setWrongOption1] = useState<string>('');
  const [wrongOption2, setWrongOption2] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  // Stripe card checkout fields
  const [cardHolder, setCardHolder] = useState<string>('Alex Vance (Apex Corp)');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('842');
  const [cardZip, setCardZip] = useState<string>('94103');

  const [isProcessingDeposit, setIsProcessingDeposit] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);

  // Computations
  const userReward = +(grossCPM * 0.75 / 100).toFixed(2); // 75% revenue share to viewer
  const estimatedViews = Math.floor(budgetUSD / (grossCPM / 1000));

  const totalFundedBudget = ads.reduce((sum, a) => sum + (a.budgetUSD || 250), 0);
  const totalDeliveredViews = ads.reduce((sum, a) => sum + (a.impressionsDelivered || 85), 0);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sponsor || !quizQuestion || !correctOption) return;

    setIsProcessingDeposit(true);

    // Simulate real gateway funding handshake (Stripe / PayPal)
    setTimeout(() => {
      const newAd: AdCampaign = {
        id: `ad_adv_${Date.now()}`,
        title,
        sponsor,
        category,
        durationSeconds: duration,
        rewardUSD: userReward > 0 ? userReward : 0.18,
        grossCPM,
        videoUrl: '',
        posterUrl: '/src/assets/images/sponsor_fintech_card_1790969508934.jpg',
        tagline,
        sponsorUrl: 'https://example.com',
        budgetUSD,
        spentUSD: 0,
        impressionsDelivered: 0,
        status: 'active',
        createdAt: new Date().toISOString().substring(0, 10),
        verificationQuestion: {
          question: quizQuestion,
          correctOption,
          options: [correctOption, wrongOption1 || 'Basic Free Tier', wrongOption2 || 'Monthly plan only'],
        },
      };

      // Add to ads in storage
      const saved = localStorage.getItem('adrewards_ads');
      const currentList: AdCampaign[] = saved ? JSON.parse(saved) : ads;
      localStorage.setItem('adrewards_ads', JSON.stringify([newAd, ...currentList]));

      addNotification({
        type: 'advertiser_deposit',
        title: 'Campaign Funded & Live',
        message: `$${budgetUSD.toFixed(2)} USD deposited via ${paymentMethod.toUpperCase()}. "${title}" is live in earner queue.`,
        actionTab: 'ads',
        actionLabel: 'Preview Stream',
      });

      setIsProcessingDeposit(false);
      setDepositSuccess(true);
      setTimeout(() => {
        setDepositSuccess(false);
        setIsModalOpen(false);
        window.location.reload();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Self-Serve Advertiser Hub & Escrow Pool</span>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
              Inbound Capital Portal
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Deposit ad campaign budgets via Stripe or PayPal. Every dollar funded enters escrow and is distributed directly to human-verified viewers at custom CPM bids.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch Campaign & Deposit Funds</span>
        </button>
      </div>

      {/* Advertiser Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Total Escrow Backing</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            ${totalFundedBudget.toFixed(2)} USD
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">100% gateway-cleared capital</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Views Delivered</span>
          <p className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {totalDeliveredViews} Verified
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active tab verified attention</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Average CPM Bid</span>
          <p className="text-2xl font-bold font-mono text-blue-400 mt-1 tabular-nums">
            $24.50 CPM
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">75% paid to viewers ($0.18/view)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Attention Verification</span>
          <p className="text-2xl font-bold font-mono text-purple-400 mt-1 tabular-nums">
            99.6%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Zero bot/background tab fraud</p>
        </div>
      </div>

      {/* Campaigns Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Active Advertiser Video Campaigns ({ads.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-Time Impression Escrow</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Campaign & Sponsor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Duration</th>
                <th className="py-3 px-4 text-right">Advertiser CPM</th>
                <th className="py-3 px-4 text-right">Viewer Net Share</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold text-white truncate">{ad.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{ad.sponsor}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {ad.category}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                    {ad.durationSeconds}s
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-blue-400 tabular-nums">
                    ${ad.grossCPM.toFixed(2)} CPM
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                    +${ad.rewardUSD.toFixed(2)} USD
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Live In Pool</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveTab('ads')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline underline-offset-2"
                    >
                      Preview Stream
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Creation & Stripe Deposit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-blue-400" />
                  <span>Launch Self-Serve Video Campaign</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fund advertising budget via Stripe-integrated checkout and define attention-verification questions
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {depositSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Deposit Successful & Campaign Live!</h4>
                <p className="text-xs text-slate-300">
                  ${budgetUSD.toFixed(2)} USD deposited into platform escrow via Stripe. Campaign added to active earner viewing rotation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Campaign Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. NextGen Cloud AI Workstation"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Sponsor / Company Name</label>
                    <input
                      type="text"
                      required
                      value={sponsor}
                      onChange={(e) => setSponsor(e.target.value)}
                      placeholder="e.g. HyperScale Tech Inc."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Tagline / Key Value Offer</label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Deploy container clusters in under 5 seconds with zero server management."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Duration (Seconds)</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value={15}>15 Seconds</option>
                      <option value={20}>20 Seconds</option>
                      <option value={30}>30 Seconds</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">CPM Bid ($ USD)</label>
                    <input
                      type="number"
                      step="1.0"
                      min="15.0"
                      max="50.0"
                      value={grossCPM}
                      onChange={(e) => setGrossCPM(parseFloat(e.target.value) || 24)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Deposit Budget ($ USD)</label>
                    <input
                      type="number"
                      step="10.0"
                      min="25.0"
                      max="5000.0"
                      value={budgetUSD}
                      onChange={(e) => setBudgetUSD(parseFloat(e.target.value) || 100)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Comprehension Quiz Builder */}
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Attention Verification Challenge</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Define a question tested after the ad finishes to guarantee viewers paid full attention.
                  </p>

                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      value={quizQuestion}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                      placeholder="e.g. How fast does HyperScale deploy container clusters?"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={correctOption}
                        onChange={(e) => setCorrectOption(e.target.value)}
                        placeholder="Correct answer (e.g. Under 5 seconds)"
                        className="bg-slate-900 border border-emerald-500/40 rounded-lg p-2 text-white placeholder:text-slate-600 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={wrongOption1}
                        onChange={(e) => setWrongOption1(e.target.value)}
                        placeholder="Distractor 1 (e.g. 1 hour)"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder:text-slate-600 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={wrongOption2}
                        onChange={(e) => setWrongOption2(e.target.value)}
                        placeholder="Distractor 2 (e.g. 24 hours)"
                        className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder:text-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Stripe-Integrated Card Checkout Element */}
                <div className="bg-slate-950/80 border border-blue-500/30 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <h4 className="font-bold text-white text-xs">Stripe Payment Element (Direct Escrow Deposit)</h4>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      256-bit TLS Encrypted
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-1">Name on Corporate Card</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-slate-400 font-semibold block mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-[11px] text-slate-400 font-semibold block mb-1">Expiry</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 font-semibold block mb-1">CVC</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economics summary */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Verified Views:</span>
                    <span className="font-mono text-white font-bold">{estimatedViews} views</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Earner Payout per View (75%):</span>
                    <span className="font-mono text-emerald-400 font-bold">${userReward.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-white font-bold border-t border-slate-800/80 pt-1">
                    <span>Total Stripe Charge Due:</span>
                    <span className="font-mono text-blue-400 text-xs font-bold">${budgetUSD.toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingDeposit}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isProcessingDeposit ? 'Processing 3D Secure Deposit...' : `Pay $${budgetUSD.toFixed(2)} via Stripe`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
