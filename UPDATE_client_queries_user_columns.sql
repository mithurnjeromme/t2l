-- UPDATE client_queries table to add user tracking columns
-- This adds user information to the existing client_queries table
-- Run this in Supabase SQL Editor

-- Add new columns for user tracking
ALTER TABLE public.client_queries 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_phone TEXT,
ADD COLUMN IF NOT EXISTS assigned_lawyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_queries_user_id ON public.client_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_client_queries_assigned_lawyer ON public.client_queries(assigned_lawyer_id);

-- Update RLS policies to allow authenticated users
DROP POLICY IF EXISTS "Authenticated users can insert queries" ON public.client_queries;
DROP POLICY IF EXISTS "Users can view their own queries" ON public.client_queries;

-- Allow authenticated users to insert queries
CREATE POLICY "Authenticated users can insert queries"
  ON public.client_queries 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Allow users to view their own queries
CREATE POLICY "Users can view their own queries"
  ON public.client_queries 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Add comments
COMMENT ON COLUMN public.client_queries.user_id IS 'User who submitted the query';
COMMENT ON COLUMN public.client_queries.user_name IS 'Full name of the user';
COMMENT ON COLUMN public.client_queries.user_email IS 'Email of the user';
COMMENT ON COLUMN public.client_queries.user_phone IS 'Phone number of the user';
COMMENT ON COLUMN public.client_queries.assigned_lawyer_id IS 'Lawyer assigned to handle this query';
