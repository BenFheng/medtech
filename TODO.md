# Vanguard Supplement Platform — Build-Out TODO

## Tonight's Priority: Core Infrastructure & Key Features

---

### 1. Supabase Database Setup
- [x] Run migrations via `supabase db push --linked`
- [x] Create Supabase client utility (`src/lib/supabase.ts`) with browser + server helpers
- [x] Add env vars to `.env.local`
- [x] Set up Clerk → Supabase user sync (`/api/webhooks/clerk` route)
- [x] Persist assessment results to Supabase (dashboard auto-saves to `user_protocols` via `/api/protocols/save`)
- [x] Create `user_protocols` table to store each user's recommended stack, assessment answers, and protocol focus
- [x] Create `supplement_interactions` table to store synergy/antagonism data from `SUPPLEMENT_INTERACTIONS.md` (see Section 6 below)

---

### 2. Product Catalog & Supplement Data Migration
- [x] Seed script for `products` table (`supabase/seed_products.sql`) — all 28 supplements
  - Map fields: `name`, `description` (from `dosage.form`), `unit_cost` (from `pricePerMonth`), `category_tags` (from `category`, `targets`, `symptoms`)
- [x] Create `supplement_interactions` table schema:
  ```
  id, supplement_a (FK→products), supplement_b (FK→products),
  interaction_type ENUM('synergy','antagonism','caution'),
  mechanism TEXT, recommendation TEXT, evidence_level TEXT
  ```
- [x] Seed script for interaction data (`supabase/seed_interactions.sql`) — 20 synergy pairs and 10 antagonism pairs
- [x] Add `timing_schedule` field to products (`AM`, `PM`, `AM/PM`)
- [x] Add `evidence_level` and `citation_count` fields to products

---

### 3. Dashboard Enhancements (Currently single-view, needs tabs)
- [x] **My Stack tab** (exists as StackView — enhance it):
  - Add "Swap Compound" button per supplement card → opens modal with alternative suggestions
  - Show synergy indicators between supplements in the stack (green link icons)
  - Show antagonism warnings with timing separation advice (e.g., "Take 2h apart from Zinc")
  - Add AM/PM timeline view (visual schedule of when to take each supplement)
- [x] **Protocol Insights tab** (new):
  - Why each supplement was chosen — map back to assessment friction points
  - Interaction map visualization (which supplements enhance each other)
  - Evidence cards per supplement (evidence level badge, citation count, one-line mechanism)
- [x] **Biomarker Tracking tab** (new — currently hardcoded "Optimal"):
  - Manual logging: weight, sleep hours, energy level (1-10), mood (1-10), skin quality (1-10)
  - Weekly trend charts (use Recharts or Chart.js)
  - "Cellular Refresh" countdown tied to actual protocol start date (currently hardcoded to 14 days)
  - Goal tracking against baseline (set at assessment time)
- [x] **Order & Subscription tab** (new):
  - Current subscription status and next delivery date
  - Order history from `orders` table
  - Modify stack / pause / cancel subscription controls
  - Monthly cost breakdown per supplement

---

### 4. E-Commerce & Subscription Flow
- [x] Integrate Stripe for payments (subscription billing)
  - Create `/api/checkout` route — generates Stripe Checkout session
  - Create `/api/webhooks/stripe` route — handles `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`
- [x] Build checkout page (`/checkout`):
  - Stack summary with per-supplement pricing
  - Monthly total calculation
  - Delivery address form
  - Payment via Stripe Elements or Checkout redirect
- [x] Subscription management:
  - Pause/resume subscription
  - Update payment method
  - Change delivery frequency (monthly / bi-monthly)
- [x] Write order to `orders` table on successful payment (Stripe webhook inserts into Supabase)

---

### 5. Missing Pages (referenced in navbar/footer but not built)

#### 5a. Science Pages
- [x] `/science` — landing page: "The Science Behind Vanguard"
  - Hero section explaining clinical authority (2 doctors on founding team)
  - Evidence tiers explanation (A/B/C rating system)
  - Links to methodology, studies, whitepapers
- [x] `/science/methodology` — how supplement selection algorithm works
  - Assessment → Scoring → Conflict detection → Stack assembly pipeline
  - Doctor oversight and formulation process
- [x] `/science/studies` — evidence library
  - Filterable list of supplements with evidence level, citation count
  - Link to PubMed/PMC sources per supplement
- [x] `/science/whitepapers` — downloadable PDFs (placeholder for doctor-authored content)

#### 5b. Account & Support
- [x] `/account` — user profile management
  - Personal info (from Clerk + `users` table)
  - Retake assessment button
  - Assessment history
  - Linked devices / wearables (future)
  - Notification preferences
- [x] `/support` — FAQ + contact form
  - Common questions about supplements, shipping, billing
  - Contact form → sends email or creates support ticket

#### 5c. Legal Pages
- [x] `/legal/privacy` — privacy policy (PDPA/GDPR compliant)
- [x] `/legal/terms` — terms of service
- [x] `/legal/disclaimer` — medical disclaimer
  - "Not medical advice" — structure/function claims only
  - "Consult your physician" — especially for medication interactions
  - Doctor credentials and scope of practice

---

### 6. Supplement Interaction Engine (Backend)
- [x] Create `/api/interactions` route:
  - `GET /api/interactions?supplements=id1,id2,...` — returns all interactions between given supplements
  - Response includes synergies, antagonisms, and timing separation rules
- [x] Create `/api/recommend` route (move client-side `recommend.ts` logic to server):
  - Accepts assessment payload
  - Returns scored, conflict-checked stack
  - Stores recommendation in `user_protocols` table
- [x] Add timing separation rules to recommendation output:
  - If stack contains Zinc + Magnesium → flag "separate by 2h"
  - If stack contains L-Tryptophan + user takes SSRIs → hard block with warning
  - If stack contains Vitamin K2 + user takes blood thinners → hard block with warning
- [x] Add copper supplementation auto-include rule:
  - If Zinc >25mg/day is in stack, auto-suggest 1-2mg copper to prevent deficiency

---

### 7. Pre-Made Stack Bundles (from business_idea.md)
- [x] Create `stacks` table: `id`, `name`, `description`, `target_demographic`, `product_ids[]`, `monthly_price`
- [x] Seed 3 flagship stacks:
  - **"Deep Work" Stack (Ages 25-40)**: L-Theanine, Alpha-GPC, Lion's Mane, Bacopa, Rhodiola, B-Complex, Omega-3, Creatine
  - **"Executive Resilience" Stack (Ages 36-50)**: Ashwagandha, Magnesium, NMN, CoQ10, Omega-3, Vitamin D3+K2, B-Complex, Rhodiola
  - **"Boardroom Radiance" Stack (Ages 40+)**: Collagen Peptides, Vitamin C, Phytoceramides, Hyaluronic Acid, Astaxanthin, NMN, Omega-3, CoQ10
- [x] Build `/protocols` page displaying these stacks as purchasable bundles
  - Card per stack with target audience, included supplements, monthly price
  - "Customize This Stack" button → pre-fills assessment with relevant focus area
  - Bundle discount (10-15% off individual pricing)

---

### 8. Wearable & Health Data Integration (Future — Scaffold Now)
- [x] Create `/api/integrations` route scaffold
- [x] Design `health_metrics` table:
  ```
  id, user_id (FK→users), metric_type ('sleep','steps','hrv','weight','mood','energy'),
  value NUMERIC, unit TEXT, source ('manual','apple_health','oura','garmin'),
  recorded_at TIMESTAMPTZ
  ```
- [x] Add Apple HealthKit integration placeholder (PWA Web API or native bridge)
- [x] Add manual metric input form on Biomarker Tracking dashboard tab

---

### 9. B2B Corporate Wellness Portal (Future — Scaffold Now)
- [x] Design `organizations` table: `id`, `name`, `admin_user_id`, `employee_count`, `plan_tier`
- [x] Design `org_members` table: `org_id`, `user_id`, `role`
- [x] Create `/corporate` landing page with:
  - Value prop for HR departments
  - "Request a Demo" form
  - Case study placeholders
  - Corporate pricing tiers

---

### 10. Content & SEO
- [x] Create blog scaffold (`/blog`, `/blog/[slug]`)
  - MDX-based or CMS-driven articles
  - Topics: "How to fix brain fog at 3 PM", "The science of sleep stacks", "Supplements for screen fatigue"
- [x] Add structured data (JSON-LD) for product pages (protocols, home page)
- [x] Add OpenGraph meta tags for social sharing (layout + all server-rendered pages)
- [x] Create email capture component for newsletter signup (on landing page + blog)

---

## Setup Instructions (remaining manual steps)

### Step 1: Supabase Project
```bash
# If not already done, install Supabase CLI
npm install -g supabase

# Login and link your project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Push both migrations
supabase db push --linked
```

### Step 2: Seed the database
```bash
# Run these in your Supabase SQL Editor (Dashboard → SQL Editor → New Query):
# 1. Paste contents of supabase/seed_products.sql → Run
# 2. Paste contents of supabase/seed_interactions.sql → Run
```

### Step 3: Environment Variables
Add these to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

### Step 4: Configure Clerk Webhook
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`
4. Copy the signing secret → add as `CLERK_WEBHOOK_SECRET` in `.env.local`

### Step 5: Configure Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the signing secret → add as `STRIPE_WEBHOOK_SECRET` in `.env.local`

---

## Quick Reference: What's Already Built

- Landing page with hero, value props, CTAs
- 4-step assessment wizard (focus → friction points → biometrics → current supplements/meds)
- 28-supplement database with interaction mapping
- Client-side recommendation algorithm (scoring + conflict detection)
- Server-side recommendation API (`/api/recommend`)
- Dashboard with 4 tabs: My Stack, Protocol Insights, Biomarker Tracking, Order & Subscription
- Swap compound modal with conflict detection
- AM/PM timeline view
- Checkout page with Stripe integration
- Clerk authentication (sign-in, sign-up, protected routes)
- Clerk → Supabase user sync webhook
- Assessment persistence to Supabase
- Science pages (landing, methodology, studies, whitepapers)
- Account page with retake assessment, notifications, wearable placeholder
- Support page with FAQ + contact form
- Legal pages (privacy, terms, disclaimer)
- Pre-made protocol bundles (Deep Work, Executive Resilience, Boardroom Radiance)
- Corporate wellness portal with pricing tiers and demo request
- Blog scaffold with 5 articles and newsletter signup
- JSON-LD structured data on product/protocol pages
- OpenGraph meta tags on all pages
- Responsive design with Material Design 3 tokens
- Framer Motion animations

## Research Artifacts

- `SUPPLEMENT_INTERACTIONS.md` — Full interaction guide with synergy/antagonism pairs, timing schedules, drug interaction warnings, and evidence-based sources
- `src/data/supplements.json` — 28 supplements with dosage, targets, symptoms, interactions, evidence levels, pricing
- `supabase/migrations/20260321_create_core_tables.sql` — Users, Products, Orders tables with RLS policies
- `supabase/migrations/20260321_extend_tables.sql` — All extended tables (user_protocols, supplement_interactions, stacks, health_metrics, organizations, org_members)
- `supabase/seed_products.sql` — INSERT statements for all 28 supplements
- `supabase/seed_interactions.sql` — INSERT statements for 20 synergy + 10 antagonism pairs
