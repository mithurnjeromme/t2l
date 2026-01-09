-- ============================================
-- CRITICAL SECURITY FIX - ROW LEVEL SECURITY
-- ============================================
-- This SQL must be run IMMEDIATELY in your Supabase SQL Editor
-- to prevent unauthorized data access
-- ============================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawgpt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES (if any)
-- ============================================

-- Drop all policies from profiles
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON profiles';
  END LOOP;
END $$;

-- Drop all policies from lawyer_profiles
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'lawyer_profiles')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON lawyer_profiles';
  END LOOP;
END $$;

-- Drop all policies from consultations
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'consultations')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON consultations';
  END LOOP;
END $$;

-- Drop all policies from messages
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'messages')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON messages';
  END LOOP;
END $$;

-- Drop all policies from transactions
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'transactions')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON transactions';
  END LOOP;
END $$;

-- Drop all policies from wallet_balances
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'wallet_balances')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON wallet_balances';
  END LOOP;
END $$;

-- Drop all policies from lawgpt_sessions
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'lawgpt_sessions')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON lawgpt_sessions';
  END LOOP;
END $$;

-- Drop all policies from client_queries
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'client_queries')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON client_queries';
  END LOOP;
END $$;

-- Drop all policies from reviews
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON reviews';
  END LOOP;
END $$;

-- 3. CREATE SECURE RLS POLICIES FOR PROFILES TABLE
-- ============================================

-- DISABLE public viewing of profiles (this was the security leak!)
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 4. CREATE SECURE RLS POLICIES FOR LAWYER_PROFILES TABLE
-- ============================================

-- Lawyers can view their own profile
CREATE POLICY "Lawyers can view own profile"
ON lawyer_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Lawyers can update their own profile
CREATE POLICY "Lawyers can update own profile"
ON lawyer_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Lawyers can insert their own profile
CREATE POLICY "Lawyers can insert own profile"
ON lawyer_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Public can view ONLY active lawyer profiles (for lawyer search)
-- This is the ONLY table that should be publicly viewable
CREATE POLICY "Public can view active lawyers"
ON lawyer_profiles FOR SELECT
USING (is_active = true);

-- 5. CREATE SECURE RLS POLICIES FOR CONSULTATIONS TABLE
-- ============================================

-- Users can view consultations where they are client or lawyer
CREATE POLICY "Users can view own consultations"
ON consultations FOR SELECT
USING (
  auth.uid() = client_id OR 
  auth.uid() = lawyer_id
);

-- Clients can create consultations
CREATE POLICY "Clients can create consultations"
ON consultations FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- Users can update consultations where they are involved
CREATE POLICY "Users can update own consultations"
ON consultations FOR UPDATE
USING (
  auth.uid() = client_id OR 
  auth.uid() = lawyer_id
)
WITH CHECK (
  auth.uid() = client_id OR 
  auth.uid() = lawyer_id
);

-- 6. CREATE SECURE RLS POLICIES FOR MESSAGES TABLE
-- ============================================

-- Users can view messages in consultations they're part of
CREATE POLICY "Users can view consultation messages"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM consultations
    WHERE consultations.id = messages.consultation_id
    AND (consultations.client_id = auth.uid() OR consultations.lawyer_id = auth.uid())
  )
);

-- Users can send messages in consultations they're part of
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM consultations
    WHERE consultations.id = messages.consultation_id
    AND (consultations.client_id = auth.uid() OR consultations.lawyer_id = auth.uid())
  )
);

-- 7. CREATE SECURE RLS POLICIES FOR CLIENT_QUERIES TABLE
-- ============================================

-- Users can view their own queries
CREATE POLICY "Users can view own queries"
ON client_queries FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own queries
CREATE POLICY "Users can create own queries"
ON client_queries FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own queries
CREATE POLICY "Users can update own queries"
ON client_queries FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. CREATE SECURE RLS POLICIES FOR TRANSACTIONS TABLE
-- ============================================

-- Users can only view their own transactions
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- System can create transactions (via service role key in backend only)
CREATE POLICY "System can create transactions"
ON transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 9. CREATE SECURE RLS POLICIES FOR WALLET_BALANCES TABLE
-- ============================================

-- Users can only view their own wallet
CREATE POLICY "Users can view own wallet"
ON wallet_balances FOR SELECT
USING (auth.uid() = user_id);

-- System can update wallets (via service role key in backend only)
CREATE POLICY "System can update wallets"
ON wallet_balances FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- System can create wallets
CREATE POLICY "System can create wallets"
ON wallet_balances FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 10. CREATE SECURE RLS POLICIES FOR LAWGPT_SESSIONS TABLE
-- ============================================

-- Users can view their own LawGPT sessions
CREATE POLICY "Users can view own lawgpt sessions"
ON lawgpt_sessions FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own LawGPT sessions
CREATE POLICY "Users can create own lawgpt sessions"
ON lawgpt_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own LawGPT sessions
CREATE POLICY "Users can update own lawgpt sessions"
ON lawgpt_sessions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own LawGPT sessions
CREATE POLICY "Users can delete own lawgpt sessions"
ON lawgpt_sessions FOR DELETE
USING (auth.uid() = user_id);

-- 11. CREATE SECURE RLS POLICIES FOR REVIEWS TABLE
-- ============================================

-- Users can view public reviews
CREATE POLICY "Public reviews are viewable"
ON reviews FOR SELECT
USING (is_public = true);

-- Clients can create reviews for their consultations
CREATE POLICY "Clients can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- Users can view reviews in their consultations
CREATE POLICY "Users can view own reviews"
ON reviews FOR SELECT
USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- ============================================
-- 12. REVOKE PUBLIC ACCESS (CRITICAL!)
-- ============================================

-- Remove any public access that might exist
REVOKE ALL ON profiles FROM anon;
REVOKE ALL ON profiles FROM authenticated;
REVOKE ALL ON lawyer_profiles FROM anon;
REVOKE ALL ON consultations FROM anon;
REVOKE ALL ON messages FROM anon;
REVOKE ALL ON transactions FROM anon;
REVOKE ALL ON wallet_balances FROM anon;
REVOKE ALL ON lawgpt_sessions FROM anon;
REVOKE ALL ON client_queries FROM anon;
REVOKE ALL ON reviews FROM anon;

-- Grant only necessary permissions to authenticated users (RLS will control access)
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON lawyer_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON consultations TO authenticated;
GRANT SELECT, INSERT ON messages TO authenticated;
GRANT SELECT ON transactions TO authenticated;
GRANT SELECT ON wallet_balances TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON lawgpt_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON client_queries TO authenticated;
GRANT SELECT, INSERT ON reviews TO authenticated;

-- Allow public to view active lawyers only (controlled by RLS)
GRANT SELECT ON lawyer_profiles TO anon;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after applying the policies to verify RLS is working:

-- This should return TRUE for all tables
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND rowsecurity = true;

-- This should show all your policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public';

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. After running this SQL, users MUST be authenticated to access their data
-- 2. The anon key can still be public, but RLS will prevent unauthorized access
-- 3. All database operations will now require valid authentication
-- 4. Backend should use SERVICE_ROLE_KEY for admin operations
-- 5. Test thoroughly to ensure legitimate users can still access their data
