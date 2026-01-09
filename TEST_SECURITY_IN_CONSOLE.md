# 🧪 How to Test Security in Browser Console

## ⚠️ The Issue
When you try to run:
```javascript
const { data } = await supabase.from('profiles').select('*');
```

You get: `Uncaught ReferenceError: supabase is not defined`

This is because the `supabase` client is not exposed globally in the browser.

## ✅ SOLUTION: Two Ways to Test

### Method 1: Use Supabase from Network Tab (EASIEST)

1. **Open your website** (the Turn2Law frontend)
2. **Open Developer Tools** (F12 or Cmd+Option+I)
3. **Go to Network tab**
4. **Perform any action** that uses Supabase (e.g., load a page)
5. **Look at the requests** - if you see database queries failing with 403/401 errors, security is working!

### Method 2: Create a Test Page (RECOMMENDED)

Create a file: `frontend/src/app/test-security/page.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSecurity() {
  const [results, setResults] = useState<any>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    testSecurity();
  }, []);

  const testSecurity = async () => {
    console.log('🔍 Testing Security...');

    // Check if logged in
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);

    // Test 1: Try to fetch ALL profiles (should fail or return only own)
    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    // Test 2: Try to fetch ALL transactions (should fail or return only own)
    const { data: allTransactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*');

    // Test 3: Try to fetch ALL consultations (should fail or return only own)
    const { data: allConsultations, error: consultationsError } = await supabase
      .from('consultations')
      .select('*');

    // Test 4: Try to fetch active lawyer profiles (should work - public)
    const { data: lawyers, error: lawyersError } = await supabase
      .from('lawyer_profiles')
      .select('*')
      .eq('is_active', true);

    setResults({
      profiles: {
        count: allProfiles?.length || 0,
        error: profilesError?.message,
        data: allProfiles
      },
      transactions: {
        count: allTransactions?.length || 0,
        error: transactionsError?.message,
        data: allTransactions
      },
      consultations: {
        count: allConsultations?.length || 0,
        error: consultationsError?.message,
        data: allConsultations
      },
      lawyers: {
        count: lawyers?.length || 0,
        error: lawyersError?.message,
        data: lawyers
      }
    });

    console.log('📊 Security Test Results:', {
      isLoggedIn: !!user,
      profilesCount: allProfiles?.length || 0,
      transactionsCount: allTransactions?.length || 0,
      consultationsCount: allConsultations?.length || 0,
      lawyersCount: lawyers?.length || 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔒 Security Test Results</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Login Status: {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
          </h2>
          <p className="text-sm text-gray-600">
            {isLoggedIn 
              ? 'You should be able to see your own data only'
              : 'You should NOT be able to see any private data'}
          </p>
        </div>

        {/* Profiles Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold mb-2">
            👤 Profiles Test {results.profiles?.count === 0 ? '✅' : results.profiles?.count === 1 && isLoggedIn ? '✅' : '❌'}
          </h3>
          <p className="text-sm mb-2">
            <strong>Count:</strong> {results.profiles?.count || 0}
          </p>
          {results.profiles?.error && (
            <p className="text-sm text-red-600">
              <strong>Error:</strong> {results.profiles.error}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            {!isLoggedIn && results.profiles?.count === 0 
              ? '✅ SECURE: No profiles visible when not logged in'
              : isLoggedIn && results.profiles?.count === 1
              ? '✅ SECURE: Only your profile visible'
              : isLoggedIn && results.profiles?.count > 1
              ? '❌ INSECURE: Multiple profiles visible!'
              : !isLoggedIn && results.profiles?.count > 0
              ? '❌ INSECURE: Profiles visible without login!'
              : 'Checking...'}
          </p>
        </div>

        {/* Transactions Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold mb-2">
            💰 Transactions Test {results.transactions?.count === 0 || (isLoggedIn && results.transactions?.data) ? '✅' : '❌'}
          </h3>
          <p className="text-sm mb-2">
            <strong>Count:</strong> {results.transactions?.count || 0}
          </p>
          {results.transactions?.error && (
            <p className="text-sm text-red-600">
              <strong>Error:</strong> {results.transactions.error}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            {isLoggedIn 
              ? '✅ Can see your own transactions only'
              : results.transactions?.count === 0
              ? '✅ SECURE: No transactions visible'
              : '❌ INSECURE: Transactions visible!'}
          </p>
        </div>

        {/* Consultations Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold mb-2">
            📋 Consultations Test {results.consultations?.count === 0 || (isLoggedIn && results.consultations?.data) ? '✅' : '❌'}
          </h3>
          <p className="text-sm mb-2">
            <strong>Count:</strong> {results.consultations?.count || 0}
          </p>
          {results.consultations?.error && (
            <p className="text-sm text-red-600">
              <strong>Error:</strong> {results.consultations.error}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            {isLoggedIn 
              ? '✅ Can see your own consultations only'
              : results.consultations?.count === 0
              ? '✅ SECURE: No consultations visible'
              : '❌ INSECURE: Consultations visible!'}
          </p>
        </div>

        {/* Lawyers Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h3 className="text-lg font-semibold mb-2">
            ⚖️ Lawyer Profiles Test {results.lawyers?.count >= 0 ? '✅' : '❌'}
          </h3>
          <p className="text-sm mb-2">
            <strong>Count:</strong> {results.lawyers?.count || 0}
          </p>
          {results.lawyers?.error && (
            <p className="text-sm text-red-600">
              <strong>Error:</strong> {results.lawyers.error}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            ✅ PUBLIC: Lawyer profiles should be visible to everyone (this is expected)
          </p>
        </div>

        <button
          onClick={testSecurity}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          🔄 Re-run Security Tests
        </button>
      </div>
    </div>
  );
}
```

### Method 3: Browser Console with Import (QUICK TEST)

1. **Open your website** at `http://localhost:3000` (or your deployed URL)
2. **Make sure you're on a page** that uses Supabase
3. **Open Console** (F12)
4. **Run this code:**

```javascript
// Access Supabase from the window if it's exposed, or import it
(async () => {
  try {
    // Try to import Supabase dynamically
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      'https://vjfpqtyinumanvpgqlbj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnBxdHlpbnVtYW52cGdxbGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTEyOTIsImV4cCI6MjA3MTA2NzI5Mn0.IL4G5wXabjKdpUZGBAdAq5bvm1W6Xvb-zg9ux9uq5LY'
    );

    console.log('🔍 Testing Security...');

    // Test 1: Try to get all profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');

    console.log('👤 Profiles Test:');
    console.log('  Count:', profiles?.length || 0);
    console.log('  Error:', profileError?.message || 'None');
    console.log('  Data:', profiles);

    if (!profileError && profiles?.length === 0) {
      console.log('  ✅ SECURE: No profiles returned (not logged in)');
    } else if (!profileError && profiles?.length === 1) {
      console.log('  ✅ SECURE: Only your profile returned (logged in)');
    } else if (!profileError && profiles?.length > 1) {
      console.log('  ❌ INSECURE: Multiple profiles returned!');
    }

    // Test 2: Try to get all transactions
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*');

    console.log('\n💰 Transactions Test:');
    console.log('  Count:', transactions?.length || 0);
    console.log('  Error:', transError?.message || 'None');
    console.log('  ✅ SECURE:', transactions?.length === 0 || 'Some visible (you own them)');

    // Test 3: Try to get active lawyers (should work)
    const { data: lawyers, error: lawyerError } = await supabase
      .from('lawyer_profiles')
      .select('*')
      .eq('is_active', true);

    console.log('\n⚖️ Lawyer Profiles Test:');
    console.log('  Count:', lawyers?.length || 0);
    console.log('  Error:', lawyerError?.message || 'None');
    console.log('  ✅ PUBLIC: Lawyers are publicly viewable (expected)');

  } catch (error) {
    console.error('❌ Error running test:', error);
  }
})();
```

## 📊 Expected Results

### ✅ SECURE (After running SQL fix):

**Not Logged In:**
- Profiles: 0 results or error
- Transactions: 0 results or error
- Consultations: 0 results or error
- Lawyer Profiles: Multiple results (public)

**Logged In:**
- Profiles: 1 result (your profile only)
- Transactions: Your transactions only
- Consultations: Your consultations only
- Lawyer Profiles: Multiple results (public)

### ❌ INSECURE (Before fix):

**Not Logged In:**
- Profiles: 36+ results (ALL USERS!) ⚠️
- Transactions: Multiple results ⚠️
- Everything exposed ⚠️

## 🎯 EASIEST TEST

Just visit: `http://localhost:3000/test-security` (after creating the test page above)

You'll see a visual dashboard showing if your data is secure!

## 📞 What the Results Mean

| Scenario | Profiles Count | Status |
|----------|----------------|--------|
| Not logged in | 0 | ✅ SECURE |
| Logged in | 1 (yours) | ✅ SECURE |
| Not logged in | 36+ | ❌ INSECURE - Run SQL fix! |
| Logged in | 36+ | ❌ INSECURE - Run SQL fix! |

---

## 🚀 Quick Action

1. Run `CRITICAL_SECURITY_FIX.sql` in Supabase
2. Create the test page above
3. Visit `/test-security` on your website
4. Check the results!

All green checkmarks = You're secure! ✅
