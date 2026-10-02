import React, { useState } from 'react';
import {
  Server,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  RefreshCw,
  Layers,
  Database,
  Key,
  FileCheck,
} from 'lucide-react';

export const FullStackGatewayAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'webhooks' | 'idempotency' | 'compliance'>('architecture');
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const runWebhookSimulation = () => {
    setIsSimulating(true);
    setSimulationLog([]);

    const steps = [
      '1. Inbound Webhook Received: POST /api/webhooks/stripe-payouts',
      '2. Cryptographic Header Check: Verifying stripe-signature against WHSEC_LIVE_...',
      '3. Signature Validated: HMAC-SHA256 digest match (0.4ms)',
      '4. Idempotency Check: Querying processed_events collection for evt_3N84910294...',
      '5. Event is Unique: Unprocessed payment_intent.succeeded detected ($100.00 USD)',
      '6. Double-Entry Ledger Entry Created: TX_ESCROW_INFLOW_99182 (SHA-256: 0x8a9b...)',
      '7. Campaign Escrow Pool Credited: +$100.00 USD available for earner impressions',
      '8. HTTP 200 OK Response returned to Stripe within 140ms SLA',
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationLog((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 220);
    });
  };

  const runIdempotencyTest = () => {
    setIsSimulating(true);
    setSimulationLog([]);

    const steps = [
      '1. Earner submits payout request: $10.00 USD via PayPal Payouts',
      '2. Client generates Idempotency-Key: payout_req_99281_0x8f2a...',
      '3. Network retry occurs: Duplicate HTTP request received with identical key',
      '4. Middleware Intercept: Cache hit on Idempotency-Key in Redis cluster',
      '5. Second payout aborted: Replayed cached response payload',
      '6. Audit Result: Exactly ONE payment dispatched. Zero duplicate debit.',
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationLog((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 240);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Production Payment Gateway Architecture & Compliance Audit</span>
            <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
              Technical Specification
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Complete architectural blueprint detailing inbound advertiser checkout, outbound payout pipelines, idempotency guarantees, and automated tax compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runWebhookSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Stripe Webhook</span>
          </button>
          <button
            onClick={runIdempotencyTest}
            disabled={isSimulating}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Idempotency Lock</span>
          </button>
        </div>
      </div>

      {/* Real-time simulation terminal if running */}
      {simulationLog.length > 0 && (
        <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-400">
            <span className="font-bold flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gateway Engine Lifecycle Output</span>
            </span>
            <span>{isSimulating ? 'Executing...' : 'Complete (200 OK)'}</span>
          </div>
          {simulationLog.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'architecture', label: '1. Two-Sided Gateway Architecture', icon: Layers },
          { id: 'webhooks', label: '2. Webhook & Signature Verification', icon: Zap },
          { id: 'idempotency', label: '3. Idempotency & Deduplication', icon: Lock },
          { id: 'compliance', label: '4. IRS W-9 / AML Compliance', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Two-Sided Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Full-Stack Two-Sided Capital Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real micro-earning platforms cannot disburse funds out of thin air. The payment architecture enforces a mathematically backed <strong>Escrow Liquidity Model</strong> where outbound earner withdrawals are bounded by funded advertiser balances.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/70 border border-blue-500/30 p-4 rounded-xl space-y-2 text-xs">
                <span className="text-blue-400 font-bold uppercase tracking-wider block">
                  Inflow Pipeline (Advertisers)
                </span>
                <p className="text-slate-300 font-semibold">Stripe PaymentIntents & PayPal Orders v2</p>
                <ul className="space-y-1.5 text-slate-400 text-[11px] list-disc list-inside">
                  <li>Advertiser deposits campaign budget ($50 - $5,000)</li>
                  <li>3D Secure 2.0 SCA (Strong Customer Authentication)</li>
                  <li>Settled funds lock into platform campaign escrow</li>
                  <li>Funds unlock per verified 15s-30s human view at CPM bid</li>
                </ul>
              </div>

              <div className="bg-slate-950/70 border border-emerald-500/30 p-4 rounded-xl space-y-2 text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block">
                  Outflow Pipeline (Earners)
                </span>
                <p className="text-slate-300 font-semibold">PayPal Payouts REST & Stripe Connect Transfers</p>
                <ul className="space-y-1.5 text-slate-400 text-[11px] list-disc list-inside">
                  <li>User reaches minimum $5.00 withdrawable threshold</li>
                  <li>Pre-flight checks: Bot score $\ge 90$, KYC Tier 2 cleared</li>
                  <li>Idempotent API dispatch to recipient PayPal / Bank ACH</li>
                  <li>Cryptographic receipt hash generated and logged to ledger</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Webhooks & Security */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Cryptographic Webhook Reconciliation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Payment networks inform our servers of payment status changes asynchronously. To prevent spoofing, incoming payloads must be cryptographically verified using HMAC signatures.
            </p>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto">
              <pre className="text-[11px] leading-relaxed">
{`// Express.js Production Webhook Endpoint with Stripe Signature Verification
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // 1. Verify HMAC-SHA256 signature with secret
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(\`Webhook Signature Verification Failed: \${err.message}\`);
  }

  // 2. Handle successful deposit event idempotently
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await creditCampaignEscrow({
      campaignId: paymentIntent.metadata.campaignId,
      amountUSD: paymentIntent.amount_received / 100,
      gatewayRef: paymentIntent.id
    });
  }

  res.json({ received: true });
});`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Idempotency */}
      {activeTab === 'idempotency' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Idempotency & Double-Spend Prevention</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If an earner double-clicks "Withdraw" or a network blip occurs during gateway transmission, idempotency keys ensure the payment processor only executes the transaction once.
            </p>

            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Idempotency Key Protocol:</span>
              </div>
              <p className="text-slate-300 font-mono text-[11px]">
                Header: <code>Idempotency-Key: payout_&lt;user_id&gt;_&lt;tx_hash&gt;</code>
              </p>
              <p className="text-slate-400 text-[11px]">
                Stripe and PayPal deduplicate all calls with the same key for 24 hours. The second request returns the exact original transaction voucher without deducting balance again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Compliance */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">IRS Form W-9 / W-8BEN & AML Compliance Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under US IRS Section 6050W regulations and global FinCEN guidelines, payout processors must track cumulative annual user earnings to enforce 1099-K reporting thresholds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">Tier 1: Up to $599.99</span>
                <p className="text-slate-400 text-[11px]">
                  Basic email and mobile SMS 2FA verification. Instant payouts authorized.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Tier 2: Government ID</span>
                <p className="text-slate-400 text-[11px]">
                  Driver's License / Passport biometric liveness validation. Payout limit raised to $5,000.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-purple-400 font-bold block mb-1">Tier 3: $600+ Tax Filing</span>
                <p className="text-slate-400 text-[11px]">
                  Form W-9 (US TIN) or Form W-8BEN (International) required before additional payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
