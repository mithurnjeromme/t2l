-- COMPREHENSIVE FIX FOR CONSULT PAGE ISSUES (SAFE VERSION)
-- This version safely handles existing tables and columns
-- Run these commands in Supabase SQL Editor

-- ============================================================================
-- PART 1: Fix Consultations Table Foreign Keys
-- ============================================================================

DO $$ 
BEGIN
  -- Step 1: Drop existing foreign key constraints that point to auth.users
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultations_client_id_fkey' 
    AND table_name = 'consultations'
  ) THEN
    ALTER TABLE public.consultations DROP CONSTRAINT consultations_client_id_fkey CASCADE;
    RAISE NOTICE 'Dropped consultations_client_id_fkey';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultations_lawyer_id_fkey' 
    AND table_name = 'consultations'
  ) THEN
    ALTER TABLE public.consultations DROP CONSTRAINT consultations_lawyer_id_fkey CASCADE;
    RAISE NOTICE 'Dropped consultations_lawyer_id_fkey';
  END IF;

  -- Step 2: Add new foreign key constraints to profiles table
  ALTER TABLE public.consultations 
    ADD CONSTRAINT consultations_client_id_fkey 
    FOREIGN KEY (client_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;
  RAISE NOTICE 'Added consultations_client_id_fkey to profiles';

  ALTER TABLE public.consultations 
    ADD CONSTRAINT consultations_lawyer_id_fkey 
    FOREIGN KEY (lawyer_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;
  RAISE NOTICE 'Added consultations_lawyer_id_fkey to profiles';

END $$;

-- Step 3: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_consultations_client_id ON public.consultations(client_id);
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer_id ON public.consultations(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);

-- ============================================================================
-- PART 2: Update client_queries Table Structure (Safe)
-- ============================================================================

-- Add columns that might be missing (will skip if they already exist)
DO $$ 
BEGIN
  -- Add matched_lawyer_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'client_queries' 
    AND column_name = 'matched_lawyer_id'
  ) THEN
    ALTER TABLE public.client_queries 
      ADD COLUMN matched_lawyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added matched_lawyer_id column';
  ELSE
    RAISE NOTICE 'Column matched_lawyer_id already exists';
  END IF;

  -- Add matched_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'client_queries' 
    AND column_name = 'matched_at'
  ) THEN
    ALTER TABLE public.client_queries 
      ADD COLUMN matched_at TIMESTAMPTZ;
    RAISE NOTICE 'Added matched_at column';
  ELSE
    RAISE NOTICE 'Column matched_at already exists';
  END IF;

  -- Update user_id foreign key to point to profiles if it points to auth.users
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu 
      ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_name = 'client_queries'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND tc.constraint_name LIKE '%user_id%'
    AND ccu.table_name = 'users'
    AND ccu.table_schema = 'auth'
  ) THEN
    -- Drop the old constraint
    ALTER TABLE public.client_queries 
      DROP CONSTRAINT IF EXISTS client_queries_user_id_fkey CASCADE;
    
    -- Add new constraint to profiles
    ALTER TABLE public.client_queries 
      ADD CONSTRAINT client_queries_user_id_fkey 
      FOREIGN KEY (user_id) 
      REFERENCES public.profiles(id) 
      ON DELETE CASCADE;
    RAISE NOTICE 'Updated user_id foreign key to reference profiles';
  ELSE
    RAISE NOTICE 'user_id foreign key already references profiles or does not exist';
  END IF;

END $$;

-- Add indexes for client_queries
CREATE INDEX IF NOT EXISTS idx_client_queries_user_id ON public.client_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_client_queries_status ON public.client_queries(status);
CREATE INDEX IF NOT EXISTS idx_client_queries_submitted_at ON public.client_queries(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_queries_matched_lawyer ON public.client_queries(matched_lawyer_id);

-- ============================================================================
-- PART 3: Enable RLS and Set Up Policies
-- ============================================================================

-- Enable RLS on client_queries
ALTER TABLE public.client_queries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own queries" ON public.client_queries;
DROP POLICY IF EXISTS "Users can insert own queries" ON public.client_queries;
DROP POLICY IF EXISTS "Lawyers can view matched queries" ON public.client_queries;
DROP POLICY IF EXISTS "Lawyers can view all queries" ON public.client_queries;

-- RLS Policies for client_queries
CREATE POLICY "Users can view own queries" ON public.client_queries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queries" ON public.client_queries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own queries" ON public.client_queries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Lawyers can view all queries" ON public.client_queries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'lawyer'
    )
  );

CREATE POLICY "Lawyers can update matched queries" ON public.client_queries
  FOR UPDATE
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
-- PART 4: Add Updated_at Trigger
-- ============================================================================

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for client_queries if it doesn't exist
DROP TRIGGER IF EXISTS update_client_queries_updated_at ON public.client_queries;
CREATE TRIGGER update_client_queries_updated_at
  BEFORE UPDATE ON public.client_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- PART 5: Verify Everything is Set Up Correctly
-- ============================================================================

-- Check foreign keys on consultations table
DO $$
DECLARE
  fk_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CONSULTATIONS TABLE FOREIGN KEYS ===';
  FOR fk_record IN
    SELECT
      kcu.column_name, 
      ccu.table_name AS foreign_table_name
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
    WHERE 
      tc.table_name = 'consultations' 
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name IN ('client_id', 'lawyer_id')
  LOOP
    RAISE NOTICE '  % -> %', fk_record.column_name, fk_record.foreign_table_name;
  END LOOP;
END $$;

-- Check client_queries table structure
DO $$
DECLARE
  col_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CLIENT_QUERIES TABLE COLUMNS ===';
  FOR col_record IN
    SELECT 
      column_name, 
      data_type,
      CASE WHEN is_nullable = 'YES' THEN 'NULL' ELSE 'NOT NULL' END as nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'client_queries'
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE '  % (%) %', col_record.column_name, col_record.data_type, col_record.nullable;
  END LOOP;
END $$;

-- Count records in each table
DO $$
DECLARE
  profiles_count INTEGER;
  consultations_count INTEGER;
  queries_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profiles_count FROM public.profiles;
  SELECT COUNT(*) INTO consultations_count FROM public.consultations;
  SELECT COUNT(*) INTO queries_count FROM public.client_queries;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== TABLE RECORD COUNTS ===';
  RAISE NOTICE '  profiles: %', profiles_count;
  RAISE NOTICE '  consultations: %', consultations_count;
  RAISE NOTICE '  client_queries: %', queries_count;
END $$;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================================';
  RAISE NOTICE '✅ Consult page database fixes completed successfully!';
  RAISE NOTICE '====================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes applied:';
  RAISE NOTICE '  ✓ Consultations foreign keys updated to reference profiles';
  RAISE NOTICE '  ✓ client_queries table updated/verified';
  RAISE NOTICE '  ✓ RLS policies enabled and configured';
  RAISE NOTICE '  ✓ Indexes added for performance';
  RAISE NOTICE '  ✓ Triggers configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Check the verification output above';
  RAISE NOTICE '  2. Test the consult page in your application';
  RAISE NOTICE '  3. Submit a test query to verify end-to-end';
  RAISE NOTICE '';
  RAISE NOTICE '====================================================';
END $$;
