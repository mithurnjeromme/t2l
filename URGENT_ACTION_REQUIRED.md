# 🚨 URGENT: Database Access Issue - ACTION REQUIRED

## Current Problem

You're getting these errors in the dashboard:
```
Error fetching consultations: {}
Error fetching wallet balance: {}
```

## Root Cause Identified

✅ Backend code is updated correctly  
✅ Database schema is correct  
❌ **Backend cannot access Supabase database** due to **"Invalid API key"** error

## What This Means

The backend is trying to create database records when you register, but Supabase is rejecting the requests because the **Service Role Key** is invalid.

## Immediate Action Required

### Go to Supabase Dashboard and Get Fresh Keys

1. **Visit:** https://supabase.com/dashboard
2. **Login** to your account
3. **Select project:** `vjfpqtyinumanvpgqlbj`
4. **Go to:** Settings → API
5. **Scroll down to "Project API keys" section** (NOT "JWT Settings" section!)
6. **Copy these 3 values:**
   - **Project URL** (at the top)
   - **anon public** key (first key in the list)
   - **service_role secret** key (second key in the list) ⚠️ MOST IMPORTANT
   
   ⚠️ **DO NOT use "Legacy JWT Secret"** - that's in a different section!

**Visual Guide:**
```
Settings → API
├── Configuration
│   └── Project URL: https://vjfpqtyinumanvpgqlbj.supabase.co
│
└── Project API keys  ← LOOK HERE!
    ├── anon public: eyJ... [Show] [Copy]
    └── service_role secret: eyJ... [Show] [Copy]  ← THIS ONE!

❌ IGNORE THIS SECTION:
└── JWT Settings
    └── JWT Secret (Legacy): xxx  ← NOT THIS!
```

### Update Your Backend .env File

Open: `/backend/.env`

Replace with your NEW keys from Supabase:
```bash
SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
SUPABASE_ANON_KEY=eyJ...your-new-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-new-service-role-key...
```

**⚠️ WARNING:** Make sure you copy the **service_role** key, NOT the anon key again!

### Restart Backend

```bash
cd backend
pkill -f node
npm run dev
```

### Test If It's Fixed

```bash
curl http://localhost:3001/api/auth/test/db-check
```

Should return:
```json
{
  "success": true,
  "results": {
    "usersTable": { "accessible": true },  ← Should be true!
    "walletBalancesTable": { "accessible": true }  ← Should be true!
  }
}
```

### Try Creating a New Account

Go to `/signup` and create a new account.

Check backend console logs - you should see:
```
✅ Creating user record in database for: [uuid]
✅ User record created successfully
✅ Creating wallet balance for user: [uuid]
✅ Wallet balance created successfully
```

Dashboard should now load without errors! 🎉

## Why This Happened

The Service Role Key in your `.env` might be:
- From a different Supabase project
- Expired or revoked
- Incorrectly copied (with extra spaces/line breaks)
- Actually the anon key instead of service_role key

## Quick Verification

To check if you have the right key type, decode it:

The service_role key when decoded should contain:
```json
{
  "role": "service_role"  ← THIS is what you need!
}
```

If it says `"role": "anon"`, you copied the wrong key!

## What Happens After Fixing

Once you have the correct service_role key:

✅ New user registration → automatically creates database records  
✅ Existing user login → automatically creates missing records  
✅ Dashboard loads all data properly  
✅ No more "Error fetching..." messages  
✅ Everything works!

## Documentation

Full guides created:
1. `/backend/docs/DATABASE_FIX_COMPLETE.md` - Complete implementation details
2. `/backend/docs/TROUBLESHOOTING_DB_ACCESS.md` - Step-by-step troubleshooting
3. This file - Quick action guide

## Need Help?

If after updating the keys it still doesn't work:
1. Run: `curl http://localhost:3001/api/auth/test/db-check`
2. Share the output
3. Check backend console for error messages
4. Verify you can manually create records in Supabase Table Editor

---
**Priority:** 🔴 HIGH  
**Action:** Update Supabase Service Role Key in `/backend/.env`  
**Time:** 5 minutes  
**Status:** Waiting for fresh API keys from Supabase Dashboard
