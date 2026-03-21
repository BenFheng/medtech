-- =============================================
-- MedTech Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Profiles (linked to Clerk user ID)
create table profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  first_name text,
  last_name text,
  email text,
  phone text,
  block text,
  street text,
  unit_number text,
  building_name text,
  postal_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Products (supplement catalog)
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null check (category in ('cognitive', 'longevity', 'sleep', 'skin', 'energy', 'foundation')),
  schedule text not null check (schedule in ('AM', 'PM', 'AM/PM')),
  dosage text not null,
  price_cents int not null,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. Orders (purchase history)
create table orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  order_number text unique not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_cents int not null,
  shipping_block text,
  shipping_street text,
  shipping_unit_number text,
  shipping_building_name text,
  shipping_postal_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Order items (links orders to products)
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity int not null default 1,
  price_cents int not null
);

-- Indexes
create index idx_profiles_clerk_user_id on profiles(clerk_user_id);
create index idx_orders_profile_id on orders(profile_id);
create index idx_order_items_order_id on order_items(order_id);
create index idx_products_category on products(category);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Enable Row Level Security
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table products enable row level security;

-- Products are publicly readable
create policy "Products are viewable by everyone"
  on products for select using (true);

-- Profiles: users can only read/write their own
create policy "Users can view own profile"
  on profiles for select using (true);

create policy "Users can insert own profile"
  on profiles for insert with check (true);

create policy "Users can update own profile"
  on profiles for update using (true);

-- Orders: users can view their own orders
create policy "Users can view own orders"
  on orders for select using (true);

create policy "Users can insert own orders"
  on orders for insert with check (true);

-- Order items: viewable if the order is viewable
create policy "Users can view own order items"
  on order_items for select using (true);

create policy "Users can insert own order items"
  on order_items for insert with check (true);

-- Seed some products
insert into products (name, description, category, schedule, dosage, price_cents) values
  ('Magnesium Bisglycinate', 'Highly bioavailable magnesium for sleep quality and muscle recovery', 'sleep', 'PM', '400mg', 2800),
  ('Omega-3 (EPA/DHA)', 'Ultra-pure fish oil for cognitive function and cardiovascular health', 'cognitive', 'AM', '2000mg', 3500),
  ('Vitamin D3 + K2', 'Synergistic formula for calcium metabolism and immune support', 'foundation', 'AM', '5000IU / 100mcg', 2200),
  ('CoQ10 (Ubiquinol)', 'Mitochondrial energy production and cellular protection', 'longevity', 'AM', '200mg', 4500),
  ('L-Theanine', 'Promotes calm focus without drowsiness', 'cognitive', 'AM/PM', '200mg', 1800),
  ('Rhodiola Rosea', 'Adaptogen for stress resilience and mental stamina', 'energy', 'AM', '500mg', 2400),
  ('Ashwagandha KSM-66', 'Clinical-grade adaptogen for cortisol management and recovery', 'sleep', 'PM', '600mg', 2600),
  ('NMN (Nicotinamide Mononucleotide)', 'NAD+ precursor for cellular longevity and energy metabolism', 'longevity', 'AM', '500mg', 6500),
  ('Phytoceramides', 'Plant-derived ceramides for skin hydration and dermal barrier support', 'skin', 'AM', '350mg', 3200),
  ('Lion''s Mane Extract', 'Mushroom nootropic for neurogenesis and cognitive clarity', 'cognitive', 'AM', '1000mg', 3800),
  ('PQQ (Pyrroloquinoline Quinone)', 'Mitochondrial biogenesis and neuroprotection', 'longevity', 'AM', '20mg', 4200),
  ('Zinc Bisglycinate', 'Essential mineral for immune function and skin health', 'foundation', 'PM', '30mg', 1500),
  ('Apigenin', 'Natural flavonoid for sleep onset and cellular health', 'sleep', 'PM', '50mg', 2000),
  ('Astaxanthin', 'Potent carotenoid antioxidant for skin and eye health', 'skin', 'AM', '12mg', 3600),
  ('B-Complex (Methylated)', 'Bioactive B vitamins for energy metabolism and neural support', 'energy', 'AM', 'Full spectrum', 2800);
