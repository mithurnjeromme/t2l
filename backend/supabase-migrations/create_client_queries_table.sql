-- Create client_queries table to store all client queries
-- This table stores queries submitted by clients through the consult page
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.client_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_lawyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_client_queries_user_id ON client_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_client_queries_status ON client_queries(status);
CREATE INDEX IF NOT EXISTS idx_client_queries_submitted_at ON client_queries(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_queries_assigned_lawyer ON client_queries(assigned_lawyer_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_client_queries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER client_queries_updated_at
  BEFORE UPDATE ON client_queries
  FOR EACH ROW
  EXECUTE FUNCTION update_client_queries_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.client_queries ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert queries
CREATE POLICY "Authenticated users can insert queries"
  ON public.client_queries FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to view their own queries
CREATE POLICY "Users can view their own queries"
  ON public.client_queries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow service role full access (for backend API with service_role key)
CREATE POLICY "Service role has full access"
  ON public.client_queries
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE client_queries IS 'Stores all client queries submitted through the consult page with user details';
