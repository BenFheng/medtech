-- Add shop filter columns to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'Individual Supplements',
  ADD COLUMN IF NOT EXISTS safe_for TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;
