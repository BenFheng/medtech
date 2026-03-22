-- Add fields to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS timing_schedule TEXT DEFAULT 'AM' CHECK (timing_schedule IN ('AM', 'PM', 'AM/PM')),
  ADD COLUMN IF NOT EXISTS evidence_level TEXT DEFAULT 'B' CHECK (evidence_level IN ('A', 'B', 'C')),
  ADD COLUMN IF NOT EXISTS citation_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dosage_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS dosage_unit TEXT,
  ADD COLUMN IF NOT EXISTS dosage_form TEXT,
  ADD COLUMN IF NOT EXISTS price_per_month NUMERIC(10,2) DEFAULT 0;

-- Supplement interactions table
CREATE TABLE IF NOT EXISTS public.supplement_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplement_a UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  supplement_b UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('synergy', 'antagonism', 'caution')),
  mechanism TEXT NOT NULL,
  recommendation TEXT,
  evidence_level TEXT DEFAULT 'Moderate',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interactions_a ON public.supplement_interactions(supplement_a);
CREATE INDEX IF NOT EXISTS idx_interactions_b ON public.supplement_interactions(supplement_b);

-- User protocols table
CREATE TABLE IF NOT EXISTS public.user_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  protocol_name TEXT NOT NULL,
  primary_focus TEXT NOT NULL,
  friction_points TEXT[] DEFAULT '{}',
  assessment_answers JSONB DEFAULT '{}',
  recommended_stack UUID[] DEFAULT '{}',
  total_price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_protocols_user ON public.user_protocols(user_id);

-- Pre-made stacks table
CREATE TABLE IF NOT EXISTS public.stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  target_demographic TEXT,
  product_ids UUID[] DEFAULT '{}',
  monthly_price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Health metrics table
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('sleep', 'steps', 'hrv', 'weight', 'mood', 'energy', 'skin_quality')),
  value NUMERIC NOT NULL,
  unit TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'apple_health', 'oura', 'garmin')),
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_metrics_user ON public.health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_type ON public.health_metrics(metric_type);

-- Organizations table (B2B)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  admin_user_id UUID REFERENCES public.users(user_id),
  employee_count INTEGER DEFAULT 0,
  plan_tier TEXT DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'growth', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Organization members table
CREATE TABLE IF NOT EXISTS public.org_members (
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  PRIMARY KEY (org_id, user_id)
);

-- Add subscription fields to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'paused', 'cancelled', 'past_due')),
  ADD COLUMN IF NOT EXISTS delivery_address JSONB,
  ADD COLUMN IF NOT EXISTS next_delivery_date TIMESTAMPTZ;

-- RLS policies for new tables
ALTER TABLE public.supplement_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Interactions viewable by everyone" ON public.supplement_interactions FOR SELECT USING (true);
CREATE POLICY "Protocols viewable by owner" ON public.user_protocols FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Protocols insertable by owner" ON public.user_protocols FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Stacks viewable by everyone" ON public.stacks FOR SELECT USING (true);
CREATE POLICY "Health metrics viewable by owner" ON public.health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Health metrics insertable by owner" ON public.health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Orders insertable by owner" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
