-- ALTER existing client_queries table to add user information
-- This modifies the existing table to include user details
-- Run this in Supabase SQL Editor

-- First, check if the columns already exist before adding them
DO $$ 
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'client_queries' 
                 AND column_name = 'user_id') THEN
    ALTER TABLE public.client_queries 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add user_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'client_queries' 
                 AND column_name = 'user_name') THEN
    ALTER TABLE public.client_queries 
    ADD COLUMN user_name TEXT;
  END IF;

  -- Add user_email column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'client_queries' 
                 AND column_name = 'user_email') THEN
    ALTER TABLE public.client_queries 
    ADD COLUMN user_email TEXT;
  END IF;

  -- Add user_phone column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'client_queries' 
                 AND column_name = 'user_phone') THEN
    ALTER TABLE public.client_queries 
    ADD COLUMN user_phone TEXT;
  END IF;

  -- Add assigned_lawyer_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'client_queries' 
                 AND column_name = 'assigned_lawyer_id') THEN
    ALTER TABLE public.client_queries 
    ADD COLUMN assigned_lawyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add notes column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'client_queries' 
                 AND column_name = 'notes') THEN
    ALTER TABLE public.client_queries 
    ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_queries_user_id ON public.client_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_client_queries_assigned_lawyer ON public.client_queries(assigned_lawyer_id);

-- Update RLS policies to include user-based access
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can insert queries" ON public.client_queries;
DROP POLICY IF EXISTS "Users can view their own queries" ON public.client_queries;

-- Allow authenticated users to insert their queries
CREATE POLICY "Authenticated users can insert queries"
  ON public.client_queries FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to view their own queries
CREATE POLICY "Users can view their own queries"
  ON public.client_queries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Service role still has full access (already exists from previous schema)

-- Add comments
COMMENT ON COLUMN public.client_queries.user_id IS 'User who submitted the query (references auth.users)';
COMMENT ON COLUMN public.client_queries.user_name IS 'Full name of the user';
COMMENT ON COLUMN public.client_queries.user_email IS 'Email of the user';
COMMENT ON COLUMN public.client_queries.user_phone IS 'Phone number of the user';
COMMENT ON COLUMN public.client_queries.assigned_lawyer_id IS 'Lawyer assigned to handle this query';
COMMENT ON COLUMN public.client_queries.notes IS 'Internal notes for admins/lawyers';
