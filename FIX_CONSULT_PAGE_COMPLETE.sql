-- COMPREHENSIVE FIX FOR CONSULT PAGE ISSUES
-- Run these commands in Supabase SQL Editor

-- ============================================================================
-- PART 1: Fix Consultations Table Foreign Keys
-- ============================================================================

-- Step 1: Drop existing foreign key constraints that point to auth.users
ALTER TABLE IF EXISTS public.consultations 
  DROP CONSTRAINT IF EXISTS consultations_client_id_fkey CASCADE;

ALTER TABLE IF EXISTS public.consultations 
  DROP CONSTRAINT IF EXISTS consultations_lawyer_id_fkey CASCADE;

-- Step 2: Add new foreign key constraints to profiles table
ALTER TABLE IF EXISTS public.consultations 
  ADD CONSTRAINT consultations_client_id_fkey 
  FOREIGN KEY (client_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.consultations 
  ADD CONSTRAINT consultations_lawyer_id_fkey 
  FOREIGN KEY (lawyer_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Step 3: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_consultations_client_id ON public.consultations(client_id);
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer_id ON public.consultations(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);

-- ============================================================================
-- PART 2: Ensure client_queries Table Exists and is Properly Set Up
-- ============================================================================

-- Create client_queries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.client_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_id TEXT UNIQUE NOT NULL,
  query_text TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'matched', 'completed', 'cancelled')),
  matched_lawyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  matched_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for client_queries
CREATE INDEX IF NOT EXISTS idx_client_queries_user_id ON public.client_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_client_queries_status ON public.client_queries(status);
CREATE INDEX IF NOT EXISTS idx_client_queries_submitted_at ON public.client_queries(submitted_at DESC);

-- Enable RLS on client_queries
ALTER TABLE public.client_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_queries
DROP POLICY IF EXISTS "Users can view own queries" ON public.client_queries;
CREATE POLICY "Users can view own queries" ON public.client_queries
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own queries" ON public.client_queries;
CREATE POLICY "Users can insert own queries" ON public.client_queries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Lawyers can view matched queries" ON public.client_queries;
CREATE POLICY "Lawyers can view matched queries" ON public.client_queries
  FOR SELECT
  USING (
    auth.uid() = matched_lawyer_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'lawyer'
    )
  );

-- ============================================================================
-- PART 3: Add Updated_at Trigger for client_queries
-- ============================================================================

-- Create or replace the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for client_queries
DROP TRIGGER IF EXISTS update_client_queries_updated_at ON public.client_queries;
CREATE TRIGGER update_client_queries_updated_at
  BEFORE UPDATE ON public.client_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- PART 4: Verify Everything is Set Up Correctly
-- ============================================================================

-- Check foreign keys on consultations table
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE 
  tc.table_name = 'consultations' 
  AND tc.constraint_type = 'FOREIGN KEY';

-- Check if client_queries table exists and has correct structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'client_queries'
ORDER BY ordinal_position;

-- Count records in each table
SELECT 
  'profiles' as table_name, COUNT(*) as record_count FROM public.profiles
UNION ALL
SELECT 
  'consultations' as table_name, COUNT(*) as record_count FROM public.consultations
UNION ALL
SELECT 
  'client_queries' as table_name, COUNT(*) as record_count FROM public.client_queries;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Consult page database fixes completed successfully!';
  RAISE NOTICE '   - Consultations foreign keys updated to reference profiles';
  RAISE NOTICE '   - client_queries table created/verified';
  RAISE NOTICE '   - RLS policies enabled and configured';
  RAISE NOTICE '   - Indexes added for performance';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Next steps:';
  RAISE NOTICE '   1. Check the query results above to verify everything is set up';
  RAISE NOTICE '   2. Test the consult page in your application';
  RAISE NOTICE '   3. Submit a test query to verify it works end-to-end';
END $$;
