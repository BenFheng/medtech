-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  user_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone_code TEXT DEFAULT '+65',
  phone_number TEXT,
  address_postal TEXT,
  address_block TEXT,
  address_street TEXT,
  address_unit TEXT,
  address_building TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users viewable by self" ON public.users
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users updatable by self" ON public.users
  FOR UPDATE USING (auth.uid()::text = user_id);
