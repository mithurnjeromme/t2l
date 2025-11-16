-- Create client_queries table to store all client queries
-- This table stores queries submitted by clients through the consult page
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS client_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_lawyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  
  -- Indexes for better query performance
  CONSTRAINT client_queries_pkey PRIMARY KEY (id)
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
ALTER TABLE client_queries ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own queries
CREATE POLICY "Users can view their own queries"
  ON client_queries FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own queries
CREATE POLICY "Users can insert their own queries"
  ON client_queries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own queries
CREATE POLICY "Users can update their own queries"
  ON client_queries FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow lawyers and admins to view all queries (you can customize this based on your needs)
CREATE POLICY "Lawyers can view all queries"
  ON client_queries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'lawyer'
    )
  );

-- Allow service role to do everything (for backend API)
CREATE POLICY "Service role has full access"
  ON client_queries
  USING (true)
  WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE client_queries IS 'Stores all client queries submitted through the consult page with user details';
