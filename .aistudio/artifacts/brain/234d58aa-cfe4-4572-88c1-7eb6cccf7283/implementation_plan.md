# Full-Stack Payment Gateway Architecture, Cloud Auth & Self-Serve Advertiser Platform

A comprehensive technical architecture analysis and execution plan to upgrade AdRewards Pro into an enterprise-grade micro-earnings platform with production payment gateways, cloud persistent authentication, and a self-serve advertiser deposit portal.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during the interactive interview phase:
> - **Primary Analysis Focus**: Full-stack production payment gateway architecture analysis (automated merchant settlement, webhook processing, idempotency, and fraud prevention).
> - **Backend & Persistence**: Cloud persistent database with secure user accounts, session authentication, and role-based access control (RBAC).
> - **Monetization Priority**: Self-serve Advertiser Dashboard enabling businesses to deposit advertising budgets, create video campaigns, set custom CPM bids, and monitor attention-verified impressions.

---

### 1. Overview & Core Concept

- **What It Does**: Transforms AdRewards Pro into a complete two-sided marketplace. Advertisers deposit campaign funds through payment gateways (Stripe/PayPal) and deploy video ads and research tasks. Verified users watch ads and complete tasks to earn real dollars. Automated compliance algorithms screen bot activity and disburse earnings directly to bank accounts and digital wallets.
- **Target Audience & Roles**:
  - *Earners*: Individuals completing micro-tasks and viewing ads with transparent 75% revenue share payouts.
  - *Advertisers*: Brands, app developers, and market researchers launching high-engagement campaigns with verified human attention.
  - *Compliance & Platform Admins*: Operators overseeing AML/KYC checks, payment gateway reserves, and ledger audits.
- **Key Value**: Closes the loop on real monetization by replacing simulated deposits with actual advertiser capital inflows, real-time balance escrow, and automated webhook-backed payouts.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Advertiser Campaign Launch & Deposit**:
   - Advertiser navigates to the new **Advertiser Hub**.
   - Configures campaign parameters: Title, Category, Target Duration (15s–30s), Total Budget ($50–$5,000), Target CPM Bid ($15.00–$35.00 CPM), and Post-View Comprehension Quiz.
   - Enters checkout flow powered by Stripe/PayPal Elements.
   - Upon successful deposit settlement, campaign is immediately scheduled into the active viewer pool.
2. **User Verified View & Incremental Earning**:
   - Viewer streams the ad in the 1080p Canvas Engine.
   - Window visibility and anti-bot attention are tracked to the millisecond.
   - Post-playback challenge is solved $\rightarrow$ wallet balance increments via smooth numerical tweening $\rightarrow$ double-entry ledger entry is logged.
3. **Automated Gateway Withdrawal & Settlement**:
   - Earner requests payout to PayPal, Stripe ACH, Wise, or USDC.
   - System performs automated velocity audit, tax form check (W-9/W-8BEN), and 2FA confirmation.
   - Dispatches payment intent to payout processor with idempotent transaction keys.
   - Generates official downloadable PDF/print disbursement voucher.

#### Visual Identity & Theme
- **Domain Aesthetic**: High-density financial dashboard following the `references/3_saas_dashboard.md` guidelines.
- **Color Palette**: Neutral dark canvas (`#020617` / `#0f172a`), hairline structure dividers (`#1e293b`), and intentional semantic accents:
  - *Emerald* (`#10b981`): Available funds, verified impressions, and successful payouts.
  - *Blue* (`#3b82f6`): Advertiser deposits and research tasks.
  - *Amber* (`#f59e0b`): Escrow holds, daily streaks, and pending gateway reviews.
- **Typography**: `Plus Jakarta Sans` for primary typography, paired with strict tabular monospace figures (`JetBrains Mono tabular-nums`) for all financial sums, transaction hashes, and timestamps.
- **Micro-Interactions**: Smooth 600ms counter tweening on balance updates, subtle equalizer bar audio animations, and zero-pill typographic metadata separators.

---

### 3. Key Product Decisions & Trade-Offs

#### Decision 1: Full-Stack Gateway Architecture (Stripe Connect & PayPal REST Payouts)
- **Chosen Approach**: Two-legged payment gateway architecture:
  - *Inflow (Advertisers)*: Stripe Payment Intents & PayPal Orders API with server-side webhook signature verification (`stripe-signature` / Webhook ID).
  - *Outflow (Earners)*: PayPal Payouts SDK and Stripe Connect Transfers with unique idempotency keys (`Idempotency-Key: tx_<hash>`) preventing double-payouts.
- **Why**: Protects platform liquidity. Payouts are mathematically bounded by funded advertiser escrow reserves.
- **Alternatives Considered**: Direct manual CSV batch payouts (rejected: high operational latency and prone to human error).

#### Decision 2: Self-Serve Advertiser Portal & Campaign Escrow
- **Chosen Approach**: Dedicated Advertiser Management Portal within the application:
  - Real-time campaign builder with budget allocation and targeting.
  - Live campaign performance analytics: Total Impressions, Verified Attention Rate (%), Completion Rate, and Remaining Budget Balance.
  - Dynamic Ad Pool injection: newly funded campaigns instantly appear in the earner's Ad Video Player and Task Hub.
- **Why**: Fulfills the user's priority to make the monetization 100% real and self-sustaining.

#### Decision 3: Persistent Database & Role-Based Authentication (RBAC)
- **Chosen Approach**: Structured cloud database schema with user authentication:
  - Roles: `earner`, `advertiser`, `compliance_admin`.
  - Collections: `users`, `campaigns`, `tasks`, `ledger_entries`, `payout_requests`, `advertiser_deposits`.
  - Client state synchronizes with offline-resilient local caching while maintaining server-authoritative balance checks.
- **Why**: Ensures auditability, prevents client-side tampering of balance values, and provides persistent cross-device access.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ADREWARDS PRO PLATFORM                            │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
┌──────────────┐              ┌──────────────┐              ┌──────────────┐
│  EARNER HUB  │              │ADVERTISER HUB│              │  ADMIN / KYC │
│──────────────│              │──────────────│              │──────────────│
│• Video Player│              │• Ad Creator  │              │• KYC Tiers   │
│• Tasks & Quiz│              │• Budget Fund │              │• Risk Scores │
│• Real Wallet │              │• Analytics   │              │• Gateways    │
│• Activity    │              │• Invoices    │              │• Tax W-9/W-8 │
└──────┬───────┘              └──────┬───────┘              └──────┬───────┘
       │                             │                             │
       └─────────────────────────────┼─────────────────────────────┘
                                     ▼
                   ┌───────────────────────────────────┐
                   │    APPLICATION STATE & LEDGER     │
                   │───────────────────────────────────│
                   │• Double-Entry Accounting Engine   │
                   │• SHA-256 Transaction Hasher       │
                   │• Daily Target & 3-Task Streak     │
                   │• 10% Referral Revenue Splitter    │
                   └─────────────────┬─────────────────┘
                                     │
       ┌─────────────────────────────┴─────────────────────────────┐
       ▼                                                           ▼
┌──────────────────────────────┐             ┌──────────────────────────────┐
│  PAYMENT GATEWAY CONNECTORS  │             │   PERSISTENT DATA SCHEMA     │
│──────────────────────────────│             │──────────────────────────────│
│• Stripe PaymentIntents (In)  │             │• users (uid, role, trust)    │
│• Stripe Connect Payouts (Out)│             │• campaigns (cpm, budget)     │
│• PayPal REST Payouts API     │             │• tasks (survey, slots)       │
│• Webhook Signature Verifier  │             │• transactions (ledger hash)  │
│• Idempotency Deduplication   │             │• payout_requests (status)    │
└──────────────────────────────┘             └──────────────────────────────┘
```

#### Proposed Component Implementations
1. **`src/components/AdvertiserPortal.tsx`**:
   - Campaign creation wizard (title, video poster, reward bid, quiz challenge).
   - Deposit checkout simulator & live gateway funding module.
   - Campaign telemetry: views delivered, completion rate, budget burn rate.
2. **`src/components/FullStackGatewayAnalysis.tsx`**:
   - Interactive system architecture explorer explaining webhook reconciliation, idempotency headers, payout reserve management, and fraud mitigation matrices.
3. **`src/context/AppContext.tsx`**:
   - Extended with advertiser campaigns state, active user session role switcher (`Viewer` vs `Advertiser` vs `Compliance Admin`), and dynamic campaign funding handlers.

---

### Step-by-Step Implementation Roadmap

1. **Step 1: Advertiser Campaign Creation & Funding Engine**:
   - Build `AdvertiserPortal.tsx` with full campaign configuration, budget funding simulator, and campaign management table.
   - Wire newly funded advertiser campaigns directly into the active `AdVideoPlayer` pool so user viewing dynamically consumes advertiser budget.
2. **Step 2: Full-Stack Gateway Architecture Inspector**:
   - Implement production gateway architecture visualizer demonstrating Stripe webhook lifecycles, PayPal batch payouts, and idempotency mechanisms.
3. **Step 3: Multi-Role Session & RBAC Switcher**:
   - Add role switcher in navigation (`Earner View`, `Advertiser View`, `Compliance View`) to allow seamless demonstration of both sides of the marketplace.
4. **Step 4: Verification & Build Compilation**:
   - Run `compile_applet` and `lint_applet` to verify clean build state and zero regressions.
