-- ============================================
-- LawGPT Sessions Table - Simplified Version
-- ============================================
-- This version works with custom backend authentication (not Supabase auth)
-- Run this in Supabase SQL Editor

-- Drop existing table if you need to start fresh (CAREFUL: This deletes data!)
-- DROP TABLE IF EXISTS lawgpt_sessions CASCADE;

-- Create the table
CREATE TABLE IF NOT EXISTS lawgpt_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_lawgpt_sessions_user_id ON lawgpt_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_lawgpt_sessions_updated_at ON lawgpt_sessions(updated_at DESC);

-- Disable Row Level Security (RLS)
-- We're using custom backend auth, not Supabase auth, so RLS won't work
ALTER TABLE lawgpt_sessions DISABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lawgpt_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lawgpt_sessions_updated_at_trigger ON lawgpt_sessions;
CREATE TRIGGER update_lawgpt_sessions_updated_at_trigger
  BEFORE UPDATE ON lawgpt_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_lawgpt_sessions_updated_at();

-- Verify the table was created
-- Run this after creating the table:
-- SELECT * FROM lawgpt_sessions;
