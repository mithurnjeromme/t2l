-- Supabase Table Schema for Client Queries
-- This table stores all client queries submitted from the consult page

CREATE TABLE IF NOT EXISTS client_queries (
  id BIGSERIAL PRIMARY KEY,
  query_id TEXT UNIQUE NOT NULL,
  query_text TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_queries_query_id ON client_queries(query_id);
CREATE INDEX IF NOT EXISTS idx_client_queries_status ON client_queries(status);
CREATE INDEX IF NOT EXISTS idx_client_queries_submitted_at ON client_queries(submitted_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE client_queries ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert queries (from ML service)
CREATE POLICY "Allow service role to insert queries"
ON client_queries
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service role to read all queries (for admin dashboard)
CREATE POLICY "Allow service role to read queries"
ON client_queries
FOR SELECT
TO service_role
USING (true);

-- Allow service role to update query status
CREATE POLICY "Allow service role to update queries"
ON client_queries
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE client_queries IS 'Stores all client queries submitted from the consult page';
COMMENT ON COLUMN client_queries.query_id IS 'Unique identifier for the query (e.g., Q1763209931)';
COMMENT ON COLUMN client_queries.query_text IS 'The actual legal query/case description from the client';
COMMENT ON COLUMN client_queries.submitted_at IS 'ISO timestamp when the query was submitted';
COMMENT ON COLUMN client_queries.status IS 'Query status: pending, assigned, in_progress, completed';
