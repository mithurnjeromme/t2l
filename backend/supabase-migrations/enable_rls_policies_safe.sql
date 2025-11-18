-- Migration: Enable Row Level Security (RLS) - SAFE VERSION
-- This version only enables RLS on tables that we know exist
-- Run check_table_columns.sql first to see what tables you have

-- ============================================
-- 1. PROFILES TABLE
-- ============================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view lawyer profiles" ON public.profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Public can view lawyer profiles (for lawyer search/listing)
CREATE POLICY "Public can view lawyer profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_type = 'lawyer');

-- ============================================
-- 2. LAWGPT_SESSIONS TABLE
-- ============================================

-- Enable RLS on lawgpt_sessions table
ALTER TABLE public.lawgpt_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own sessions" ON public.lawgpt_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.lawgpt_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.lawgpt_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.lawgpt_sessions;

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
ON public.lawgpt_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
ON public.lawgpt_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
ON public.lawgpt_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
ON public.lawgpt_sessions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- VERIFY RLS IS ENABLED
-- ============================================

-- Check which tables have RLS enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'lawgpt_sessions')
ORDER BY tablename;

-- List all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Success message
SELECT 'RLS enabled successfully on profiles and lawgpt_sessions tables!' as status;
