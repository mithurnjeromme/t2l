-- Check what tables exist and their columns
-- Run this first to see the actual table structure

-- List all tables in public schema
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'lawgpt_sessions', 'wallet_balances', 'transactions', 'client_queries')
ORDER BY table_name, ordinal_position;

-- If no results, check what tables actually exist
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
