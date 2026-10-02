-- ==============================================================================
-- DENLIGHT IT SOLUTIONS - SUPABASE PERSISTENT SCHEMA & STORAGE CONFIGURATION
-- ==============================================================================
-- Copy and run this script in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create the `products` table for persistent image URLs and metadata
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  brand TEXT,
  model TEXT,
  price_ksh NUMERIC,
  deposit_ksh NUMERIC,
  image_url TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public Read Access (Anyone can browse products & images)
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
CREATE POLICY "Public products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Policy 2: Authenticated Insert Access (Admins can add products)
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy 3: Authenticated Update Access (Admins can update images & details)
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Policy 4: Authenticated Delete Access
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (true);

-- ==============================================================================
-- 2. Storage Bucket Setup (`product-images`)
-- ==============================================================================

-- Ensure the `product-images` storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy 1: Public Read (Anyone can view the images in the bucket)
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

-- Storage Policy 2: Authenticated Upload (Only logged-in admin can upload images)
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

-- Storage Policy 3: Authenticated Update (Only logged-in admin can update images)
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
CREATE POLICY "Authenticated users can update product images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images');

-- Storage Policy 4: Authenticated Delete (Only logged-in admin can remove images)
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');
