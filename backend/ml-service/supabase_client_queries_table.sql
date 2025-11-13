-- Create client_queries table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.client_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query_id VARCHAR(50) UNIQUE NOT NULL,
    query_text TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    assigned_lawyer_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_client_queries_status ON public.client_queries(status);
CREATE INDEX IF NOT EXISTS idx_client_queries_submitted_at ON public.client_queries(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_queries_query_id ON public.client_queries(query_id);

-- Enable Row Level Security
ALTER TABLE public.client_queries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert (for backend API)
CREATE POLICY "Allow service role to insert queries" ON public.client_queries
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow service role to select queries (for admin dashboard)
CREATE POLICY "Allow service role to select queries" ON public.client_queries
    FOR SELECT
    USING (true);

-- Create policy to allow service role to update queries (for status updates)
CREATE POLICY "Allow service role to update queries" ON public.client_queries
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_queries_updated_at 
    BEFORE UPDATE ON public.client_queries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to service role
GRANT ALL ON public.client_queries TO service_role;
GRANT ALL ON public.client_queries TO authenticated;

COMMENT ON TABLE public.client_queries IS 'Stores client legal consultation queries submitted through the website';
COMMENT ON COLUMN public.client_queries.query_id IS 'Unique query identifier (e.g., Q1731456789)';
COMMENT ON COLUMN public.client_queries.query_text IS 'Full text of the client legal query';
COMMENT ON COLUMN public.client_queries.status IS 'Query status: pending, assigned, contacted, resolved';
COMMENT ON COLUMN public.client_queries.assigned_lawyer_id IS 'ID of lawyer assigned to handle this query';
