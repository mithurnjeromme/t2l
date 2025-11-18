-- Migration: Enable Row Level Security (RLS) on all tables
-- This ensures users can only access their own data

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
-- 3. WALLET_BALANCES TABLE (if exists)
-- ============================================

-- Check if table exists first
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'wallet_balances') THEN
    -- Enable RLS
    ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallet_balances;
    DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallet_balances;
    
    -- Users can view their own wallet
    CREATE POLICY "Users can view own wallet"
    ON public.wallet_balances
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
    
    -- Users can update their own wallet (for transactions)
    CREATE POLICY "Users can update own wallet"
    ON public.wallet_balances
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================
-- 4. TRANSACTIONS TABLE (if exists)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
    -- Enable RLS
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
    DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
    
    -- Users can view their own transactions
    CREATE POLICY "Users can view own transactions"
    ON public.transactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
    
    -- Users can insert their own transactions
    CREATE POLICY "Users can insert own transactions"
    ON public.transactions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================
-- 5. CLIENT_QUERIES TABLE (if exists)
-- ============================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'client_queries') THEN
    -- Enable RLS
    ALTER TABLE public.client_queries ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view own queries" ON public.client_queries;
    DROP POLICY IF EXISTS "Users can insert own queries" ON public.client_queries;
    DROP POLICY IF EXISTS "Lawyers can view queries assigned to them" ON public.client_queries;
    
    -- Clients can view their own queries
    CREATE POLICY "Users can view own queries"
    ON public.client_queries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = client_id);
    
    -- Clients can insert their own queries
    CREATE POLICY "Users can insert own queries"
    ON public.client_queries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = client_id);
    
    -- Lawyers can view queries assigned to them
    CREATE POLICY "Lawyers can view queries assigned to them"
    ON public.client_queries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = lawyer_id);
  END IF;
END $$;

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
  AND tablename IN ('profiles', 'lawgpt_sessions', 'wallet_balances', 'transactions', 'client_queries')
ORDER BY tablename;

-- List all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
