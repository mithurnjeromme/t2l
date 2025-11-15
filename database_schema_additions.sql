-- Turn2Law Additional Tables for Dashboard Productionization
-- Run this in Supabase SQL Editor after database_schema.sql

-- ==========================================
-- WALLET & TRANSACTIONS TABLES
-- ==========================================

-- Wallet Balances Table
CREATE TABLE IF NOT EXISTS public.wallet_balances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  pending_amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wallet_balances_user_id ON public.wallet_balances(user_id);

-- Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('credit', 'debit')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('success', 'pending', 'failed')) DEFAULT 'pending',
  payment_method TEXT,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- ==========================================
-- LAWGPT & AI TABLES
-- ==========================================

-- LawGPT Sessions Table
CREATE TABLE IF NOT EXISTS public.lawgpt_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lawgpt_sessions_user_id ON public.lawgpt_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_lawgpt_sessions_updated_at ON public.lawgpt_sessions(updated_at DESC);

-- ==========================================
-- BANK ACCOUNTS (FOR LAWYERS)
-- ==========================================

-- Bank Accounts Table
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  branch_name TEXT,
  account_type TEXT CHECK (account_type IN ('savings', 'current')) DEFAULT 'savings',
  is_default BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);

-- Ensure only one default bank account per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_bank_accounts_user_default 
  ON public.bank_accounts(user_id) 
  WHERE is_default = TRUE;

-- ==========================================
-- CASES/LEGAL MATTERS TABLE
-- ==========================================

-- Cases/Legal Matters Table
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lawyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  case_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  legal_area TEXT NOT NULL,
  case_type TEXT,
  court_name TEXT,
  filing_date DATE,
  next_hearing_date DATE,
  status TEXT CHECK (status IN ('pending', 'active', 'closed', 'won', 'lost', 'settled')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  documents JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON public.cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_lawyer_id ON public.cases(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_next_hearing_date ON public.cases(next_hearing_date);

-- ==========================================
-- NOTIFICATIONS TABLE
-- ==========================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all new tables
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawgpt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Wallet Balances Policies
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallet_balances;
CREATE POLICY "Users can view own wallet" ON public.wallet_balances
  FOR ALL USING (auth.uid() = user_id);

-- Transactions Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

-- LawGPT Sessions Policies
DROP POLICY IF EXISTS "Users can view own LawGPT sessions" ON public.lawgpt_sessions;
CREATE POLICY "Users can view own LawGPT sessions" ON public.lawgpt_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Bank Accounts Policies (Lawyers only)
DROP POLICY IF EXISTS "Lawyers can manage own bank accounts" ON public.bank_accounts;
CREATE POLICY "Lawyers can manage own bank accounts" ON public.bank_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Cases Policies
DROP POLICY IF EXISTS "Users can view cases they're involved in" ON public.cases;
CREATE POLICY "Users can view cases they're involved in" ON public.cases
  FOR ALL USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DROP TRIGGER IF EXISTS update_wallet_balances_updated_at ON public.wallet_balances;
CREATE TRIGGER update_wallet_balances_updated_at
  BEFORE UPDATE ON public.wallet_balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lawgpt_sessions_updated_at ON public.lawgpt_sessions;
CREATE TRIGGER update_lawgpt_sessions_updated_at
  BEFORE UPDATE ON public.lawgpt_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bank_accounts_updated_at ON public.bank_accounts;
CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cases_updated_at ON public.cases;
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create wallet balance for new users
CREATE OR REPLACE FUNCTION create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallet_balances (user_id, balance, total_earnings, total_spent, pending_amount)
  VALUES (NEW.id, 0.00, 0.00, 0.00, 0.00);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create wallet for new users
DROP TRIGGER IF EXISTS on_auth_user_created_create_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_create_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_wallet_for_new_user();

-- Function to update wallet balance on transaction
CREATE OR REPLACE FUNCTION update_wallet_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'success' THEN
    IF NEW.type = 'credit' THEN
      UPDATE public.wallet_balances
      SET 
        balance = balance + NEW.amount,
        total_earnings = total_earnings + NEW.amount
      WHERE user_id = NEW.user_id;
    ELSIF NEW.type = 'debit' THEN
      UPDATE public.wallet_balances
      SET 
        balance = balance - NEW.amount,
        total_spent = total_spent + NEW.amount
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update wallet on successful transaction
DROP TRIGGER IF EXISTS on_transaction_success_update_wallet ON public.transactions;
CREATE TRIGGER on_transaction_success_update_wallet
  AFTER INSERT OR UPDATE OF status ON public.transactions
  FOR EACH ROW
  WHEN (NEW.status = 'success')
  EXECUTE FUNCTION update_wallet_on_transaction();

-- ==========================================
-- INITIAL DATA / SEED (Optional)
-- ==========================================

-- You can add seed data here if needed for testing
-- Example:
-- INSERT INTO public.wallet_balances (user_id, balance) 
-- VALUES ('user-uuid-here', 1000.00);

-- ==========================================
-- STORAGE BUCKETS (For file uploads)
-- ==========================================

-- Create storage buckets if they don't exist
-- Run these in the Supabase Storage section:

-- For consultation documents
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('consultation-documents', 'consultation-documents', false)
-- ON CONFLICT (id) DO NOTHING;

-- For profile images
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('profile-images', 'profile-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- For case documents
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('case-documents', 'case-documents', false)
-- ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- VERIFICATION & CLEANUP
-- ==========================================

-- Verify all tables exist
SELECT 
  tablename, 
  schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'wallet_balances',
    'transactions',
    'lawgpt_sessions',
    'bank_accounts',
    'cases',
    'notifications'
  );

-- Verify RLS is enabled
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify indexes
SELECT 
  tablename, 
  indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

COMMENT ON TABLE public.wallet_balances IS 'Stores wallet balance and transaction summaries for all users';
COMMENT ON TABLE public.transactions IS 'Records all financial transactions (consultations, top-ups, withdrawals)';
COMMENT ON TABLE public.lawgpt_sessions IS 'Stores LawGPT chat sessions and message history';
COMMENT ON TABLE public.bank_accounts IS 'Stores bank account details for lawyer withdrawals';
COMMENT ON TABLE public.cases IS 'Stores legal cases/matters managed by clients and lawyers';
COMMENT ON TABLE public.notifications IS 'Stores user notifications for real-time updates';
