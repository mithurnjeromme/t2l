# Turn2Law Dashboard Productionization Plan

## Overview
Complete refactoring of client and lawyer dashboards to remove all mock data, connect to Supabase with real-time CRUD, and implement proper auth-based access control.

---

## Current State Analysis

### Issues Identified:
1. **Mock Data Usage:**
   - Client wallet: Hardcoded balance (₹5,250), mock transactions
   - Lawyer wallet: Hardcoded balance (₹125,000), mock transactions, mock bank accounts
   - Dashboard stats: All showing zeros or mock data
   - No real-time data fetching from Supabase

2. **localStorage Dependencies:**
   - Client dashboard: Uses localStorage for user/token only (✓ Good)
   - Lawyer dashboard: Uses localStorage for user/token only (✓ Good)
   - Wallet pages: Use localStorage for auth (acceptable)

3. **Missing Supabase Integration:**
   - No real-time subscriptions
   - No CRUD operations for consultations, cases, messages
   - No wallet transactions sync with Supabase
   - No LawGPT history persistence
   - No profile updates to database

4. **Feature Visibility Issues:**
   - Both dashboards show all features regardless of user type
   - Need to restrict lawyer dashboard to only LawGPT and Document Drafting
   - Client dashboard should show all three pillars

5. **Missing Database Tables:**
   - `wallet_balances` table
   - `transactions` table  
   - `lawgpt_sessions` table
   - `bank_accounts` table (for lawyers)
   - Cases/matters table

---

## Implementation Plan

### Phase 1: Supabase Setup ✅

**Created:** `/src/lib/supabase.ts`
- Comprehensive Supabase client with TypeScript types
- Authentication helpers
- User profile CRUD
- Lawyer profile CRUD
- Consultation CRUD with real-time
- Message CRUD with subscriptions
- Wallet & transaction management
- LawGPT session persistence
- Statistics aggregation functions
- Recent activity feed

**Required Package:**
```bash
npm install @supabase/supabase-js
```

### Phase 2: Database Schema Updates

**Need to create/update these tables in Supabase:**

```sql
-- Wallet Balances Table
CREATE TABLE public.wallet_balances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  pending_amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE public.transactions (
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LawGPT Sessions Table
CREATE TABLE public.lawgpt_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank Accounts Table (for lawyers)
CREATE TABLE public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawgpt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own wallet" ON public.wallet_balances
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own LawGPT sessions" ON public.lawgpt_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Lawyers can view own bank accounts" ON public.bank_accounts
  FOR ALL USING (auth.uid() = user_id);
```

### Phase 3: Client Dashboard Refactor

**File:** `/frontend/src/app/dashboard/client/page.tsx`

**Changes:**
1. Replace all mock data with Supabase queries
2. Implement real-time stats:
   - Total consultations from `consultations` table
   - Active cases count
   - Wallet balance from `wallet_balances`
   - Success rate calculation
3. Fetch and display recent activity
4. Connect Quick Actions to real data
5. Implement profile editing with Supabase updates
6. Add loading states and error handling
7. Real-time updates using Supabase subscriptions

**Features to show (Client sees ALL three pillars):**
- ✅ Lawyer Consultation
- ✅ LawGPT AI Assistant
- ✅ Document Drafting

### Phase 4: Lawyer Dashboard Refactor

**File:** `/frontend/src/app/dashboard/lawyer/page.tsx`

**Changes:**
1. Replace all mock data with Supabase queries
2. Implement real-time stats:
   - Total clients (unique from consultations)
   - Monthly earnings from transactions
   - Total consultations
   - Success rating from reviews
3. Fetch recent client interactions
4. Connect to lawyer profile in Supabase
5. Update profile editing with Supabase
6. Add real-time consultation notifications
7. **Restrict features to ONLY:**
   - ✅ LawGPT (for legal research)
   - ✅ Document Drafting
   - ❌ Remove/hide Lawyer Consultation (lawyers don't book consultations)

### Phase 5: Client Wallet Refactor

**File:** `/frontend/src/app/dashboard/client/wallet/page.tsx`

**Changes:**
1. Fetch real wallet balance from `wallet_balances` table
2. Fetch transaction history from `transactions` table
3. Integrate Razorpay for real payments
4. Save all transactions to Supabase
5. Update wallet balance in real-time
6. Add transaction filters (date, type, status)
7. Implement receipt download
8. Real-time balance updates via subscriptions

### Phase 6: Lawyer Wallet Refactor

**File:** `/frontend/src/app/dashboard/lawyer/wallet/page.tsx`

**Changes:**
1. Fetch real wallet balance and earnings
2. Fetch transaction history (consultation fees)
3. Implement withdrawal to bank account
4. Fetch/manage bank accounts from Supabase
5. Calculate monthly earnings from transactions
6. Show client payment history
7. Add analytics dashboard
8. Real-time earning notifications

### Phase 7: LawGPT Integration

**File:** `/frontend/src/app/lawgpt/page.tsx` (Already cleaned, need to add Supabase)

**Changes:**
1. Replace localStorage with `lawgpt_sessions` table
2. Save all chat sessions to Supabase
3. Load previous sessions on mount
4. Auto-save messages in real-time
5. Allow session management (rename, delete)
6. Share session history across devices

### Phase 8: Messages & Real-time Chat

**Files:** 
- `/frontend/src/lib/messages-context.tsx` (Already cleaned, need Supabase)
- Consultation detail pages

**Changes:**
1. Replace localStorage with `messages` table
2. Implement real-time message subscriptions
3. Save all messages to Supabase
4. Show unread message counts
5. Notification for new messages
6. File/image upload to Supabase Storage

---

## Feature Access Control

### Client Dashboard Features:
- ✅ Find Lawyers (Consultation booking)
- ✅ LawGPT AI Assistant
- ✅ Document Drafting
- ✅ My Consultations (view bookings)
- ✅ My Cases (legal matters)
- ✅ Wallet (top-up, transactions)
- ✅ Profile Management

### Lawyer Dashboard Features:
- ✅ LawGPT AI Assistant (legal research)
- ✅ Document Drafting (for clients)
- ✅ My Consultations (incoming bookings)
- ✅ Client Management
- ✅ Earnings & Analytics
- ✅ Wallet (earnings, withdrawals)
- ✅ Profile Management
- ❌ Find Lawyers (hidden - lawyers don't book consultations)

---

## Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

## Testing Checklist

### Client Dashboard:
- [ ] Stats load from Supabase
- [ ] Recent activity shows real data
- [ ] Profile editing updates database
- [ ] Wallet balance is accurate
- [ ] Consultations list is real
- [ ] Cases list is real
- [ ] Real-time updates work
- [ ] Loading states work
- [ ] Error handling works

### Lawyer Dashboard:
- [ ] Stats load from Supabase
- [ ] Client list is accurate
- [ ] Earnings calculations correct
- [ ] Profile updates save
- [ ] Only LawGPT & Drafting visible
- [ ] Consultation bookings appear
- [ ] Real-time notifications work

### Wallet:
- [ ] Balance loads from database
- [ ] Transactions display correctly
- [ ] Add money updates balance
- [ ] Withdrawals work (lawyer)
- [ ] Razorpay integration works
- [ ] Receipt download works
- [ ] Real-time balance updates

### LawGPT:
- [ ] Sessions persist to database
- [ ] Chat history loads
- [ ] Messages auto-save
- [ ] Session management works
- [ ] Available across devices

### Messages:
- [ ] Messages save to database
- [ ] Real-time updates work
- [ ] Notifications appear
- [ ] File uploads work
- [ ] Unread counts accurate

---

## Next Steps

1. ✅ Install Supabase package
2. ✅ Create Supabase client library
3. 🔄 Run database schema updates in Supabase
4. 🔄 Refactor Client Dashboard
5. 🔄 Refactor Lawyer Dashboard
6. 🔄 Refactor Wallet pages
7. 🔄 Integrate LawGPT persistence
8. 🔄 Implement real-time messaging
9. 🔄 Add error boundaries
10. 🔄 Test all features
11. 🔄 Deploy to production

---

## Code Quality Standards

- ✅ No mock data anywhere
- ✅ All localStorage limited to auth + theme only
- ✅ All CRUD operations via Supabase
- ✅ Real-time subscriptions for live updates
- ✅ Proper TypeScript types
- ✅ Error handling and loading states
- ✅ Responsive design
- ✅ Accessibility (a11y)
- ✅ Performance optimized
- ✅ SEO friendly

---

## Performance Optimizations

1. **Data Fetching:**
   - Use React Query or SWR for caching
   - Implement pagination for large lists
   - Lazy load images
   - Debounce search inputs

2. **Real-time:**
   - Throttle subscription updates
   - Batch database writes
   - Use presence tracking efficiently

3. **Bundle Size:**
   - Code splitting by route
   - Dynamic imports for heavy components
   - Tree-shake unused exports
   - Optimize images

---

## Security Considerations

1. **Row Level Security (RLS):**
   - All tables have RLS enabled
   - Users can only access their own data
   - Consultations visible to both parties

2. **Authentication:**
   - JWT tokens managed by Supabase
   - Automatic token refresh
   - Secure logout clears all data

3. **Payments:**
   - Razorpay server-side verification
   - All transactions logged
   - Webhook signature validation

4. **Data Validation:**
   - Input sanitization
   - Type checking
   - SQL injection prevention (via Supabase)

---

## Monitoring & Analytics

1. **Error Tracking:**
   - Implement Sentry or similar
   - Log all API errors
   - Track failed transactions

2. **Usage Analytics:**
   - Track feature usage
   - Monitor performance metrics
   - A/B testing capability

3. **Business Metrics:**
   - Consultation booking rate
   - Wallet top-up amounts
   - User retention
   - LawGPT usage

---

**Status:** Ready for implementation
**Priority:** High - Production blocker
**Estimated Time:** 8-12 hours for full implementation
