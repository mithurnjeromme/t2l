-- ============================================================================
-- TURN2LAW COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This is the ONLY SQL file you need to run in Supabase
-- Run this ONCE in your Supabase SQL Editor
-- 
-- This schema is designed to work with Supabase Auth
-- All user references point to auth.users (Supabase's authentication table)
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 1: PROFILES TABLE (Core User Data)
-- ============================================================================
-- This extends Supabase Auth with application-specific user data

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'lawyer')),
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ============================================================================
-- PART 2: AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================
-- This trigger automatically creates a profile when a user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, user_type, city)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'city', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PART 3: LAWYER PROFILES (Extended Data for Lawyers)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lawyer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bar_number TEXT,
  experience_years INTEGER,
  specialization TEXT,
  education TEXT,
  court_practice TEXT,
  languages TEXT,
  bio TEXT,
  consultation_fee DECIMAL(10,2) DEFAULT 0.00,
  profile_image_url TEXT,
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lawyer_profiles
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON public.lawyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_specialization ON public.lawyer_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_verified ON public.lawyer_profiles(verified);

-- Enable RLS
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Lawyer profiles are viewable by everyone" ON public.lawyer_profiles;
CREATE POLICY "Lawyer profiles are viewable by everyone" 
  ON public.lawyer_profiles FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Lawyers can update own profile" ON public.lawyer_profiles;
CREATE POLICY "Lawyers can update own profile" 
  ON public.lawyer_profiles FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================================================
-- PART 4: CONSULTATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  legal_area TEXT NOT NULL,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  consultation_type TEXT DEFAULT 'video' CHECK (consultation_type IN ('video', 'phone', 'chat', 'in_person')),
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 30,
  fee DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for consultations
CREATE INDEX IF NOT EXISTS idx_consultations_client_id ON public.consultations(client_id);
CREATE INDEX IF NOT EXISTS idx_consultations_lawyer_id ON public.consultations(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);

-- Enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own consultations" ON public.consultations;
CREATE POLICY "Users can view own consultations" 
  ON public.consultations FOR SELECT 
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

DROP POLICY IF EXISTS "Users can create consultations" ON public.consultations;
CREATE POLICY "Users can create consultations" 
  ON public.consultations FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Users can update own consultations" ON public.consultations;
CREATE POLICY "Users can update own consultations" 
  ON public.consultations FOR UPDATE 
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- ============================================================================
-- PART 5: CLIENT QUERIES (Consultation Requests)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.client_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id TEXT UNIQUE NOT NULL,
  query_text TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'matched', 'completed', 'cancelled')),
  matched_lawyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  matched_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for client_queries
CREATE INDEX IF NOT EXISTS idx_client_queries_user_id ON public.client_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_client_queries_status ON public.client_queries(status);
CREATE INDEX IF NOT EXISTS idx_client_queries_submitted_at ON public.client_queries(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_queries_matched_lawyer ON public.client_queries(matched_lawyer_id);

-- Enable RLS
ALTER TABLE public.client_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own queries" ON public.client_queries;
CREATE POLICY "Users can view own queries" 
  ON public.client_queries FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own queries" ON public.client_queries;
CREATE POLICY "Users can insert own queries" 
  ON public.client_queries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own queries" ON public.client_queries;
CREATE POLICY "Users can update own queries" 
  ON public.client_queries FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Lawyers can view all queries" ON public.client_queries;
CREATE POLICY "Lawyers can view all queries" 
  ON public.client_queries FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'lawyer'
    )
  );

-- ============================================================================
-- PART 6: MESSAGES (Chat for consultations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
  file_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_consultation_id ON public.messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view messages in their consultations" ON public.messages;
CREATE POLICY "Users can view messages in their consultations" 
  ON public.messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations 
      WHERE consultations.id = consultation_id 
      AND (consultations.client_id = auth.uid() OR consultations.lawyer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can send messages in their consultations" ON public.messages;
CREATE POLICY "Users can send messages in their consultations" 
  ON public.messages FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.consultations 
      WHERE consultations.id = consultation_id 
      AND (consultations.client_id = auth.uid() OR consultations.lawyer_id = auth.uid())
    )
  );

-- ============================================================================
-- PART 7: REVIEWS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID UNIQUE NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_consultation_id ON public.reviews(consultation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_lawyer_id ON public.reviews(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Public reviews are viewable by everyone" 
  ON public.reviews FOR SELECT 
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can view reviews in their consultations" ON public.reviews;
CREATE POLICY "Users can view reviews in their consultations" 
  ON public.reviews FOR SELECT 
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

DROP POLICY IF EXISTS "Clients can create reviews" ON public.reviews;
CREATE POLICY "Clients can create reviews" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

-- ============================================================================
-- PART 8: WALLET BALANCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wallet_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  pending_amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for wallet_balances
CREATE INDEX IF NOT EXISTS idx_wallet_balances_user_id ON public.wallet_balances(user_id);

-- Enable RLS
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallet_balances;
CREATE POLICY "Users can view own wallet" 
  ON public.wallet_balances FOR ALL 
  USING (auth.uid() = user_id);

-- Auto-create wallet for new users
CREATE OR REPLACE FUNCTION public.create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallet_balances (user_id, balance, total_earnings, total_spent, pending_amount)
  VALUES (NEW.id, 0.00, 0.00, 0.00, 0.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_create_wallet ON public.profiles;
CREATE TRIGGER on_profile_created_create_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_wallet_for_new_user();

-- ============================================================================
-- PART 9: TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('success', 'pending', 'failed')),
  payment_method TEXT,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================================================
-- PART 10: LAWGPT SESSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lawgpt_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lawgpt_sessions
CREATE INDEX IF NOT EXISTS idx_lawgpt_sessions_user_id ON public.lawgpt_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_lawgpt_sessions_updated_at ON public.lawgpt_sessions(updated_at DESC);

-- Enable RLS
ALTER TABLE public.lawgpt_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage own LawGPT sessions" ON public.lawgpt_sessions;
CREATE POLICY "Users can manage own LawGPT sessions" 
  ON public.lawgpt_sessions FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================================================
-- PART 11: TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_lawyer_profiles_updated_at ON public.lawyer_profiles;
CREATE TRIGGER update_lawyer_profiles_updated_at
  BEFORE UPDATE ON public.lawyer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_client_queries_updated_at ON public.client_queries;
CREATE TRIGGER update_client_queries_updated_at
  BEFORE UPDATE ON public.client_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wallet_balances_updated_at ON public.wallet_balances;
CREATE TRIGGER update_wallet_balances_updated_at
  BEFORE UPDATE ON public.wallet_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_lawgpt_sessions_updated_at ON public.lawgpt_sessions;
CREATE TRIGGER update_lawgpt_sessions_updated_at
  BEFORE UPDATE ON public.lawgpt_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- PART 12: VERIFICATION
-- ============================================================================

-- List all tables
DO $$
DECLARE
  table_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '====================================================';
  RAISE NOTICE '✅ TURN2LAW DATABASE SCHEMA SETUP COMPLETE';
  RAISE NOTICE '====================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  FOR table_record IN
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename
  LOOP
    RAISE NOTICE '  ✓ %', table_record.tablename;
  END LOOP;
  RAISE NOTICE '';
  RAISE NOTICE 'All tables have:';
  RAISE NOTICE '  ✓ Row Level Security (RLS) enabled';
  RAISE NOTICE '  ✓ Proper foreign keys to auth.users → profiles';
  RAISE NOTICE '  ✓ Indexes for performance';
  RAISE NOTICE '  ✓ Triggers for updated_at columns';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Test signup - should auto-create profile';
  RAISE NOTICE '  2. Test login - should retrieve profile';
  RAISE NOTICE '  3. Test consult page - should submit queries';
  RAISE NOTICE '  4. Test all protected routes';
  RAISE NOTICE '';
  RAISE NOTICE '====================================================';
END $$;
