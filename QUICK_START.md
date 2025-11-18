# ⚡ Quick Start Guide - Turn2Law

**Get up and running in 10 minutes!**

---

## 1️⃣ Create Supabase Project (3 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create new project:
   - Name: `turn2law`
   - Database Password: *[save this]*
   - Region: Choose closest to you
4. Wait for project to provision (~2 minutes)

---

## 2️⃣ Setup Database (2 minutes)

1. In Supabase dashboard, click **SQL Editor**
2. Click **"New query"**
3. Open `TURN2LAW_COMPLETE_SCHEMA.sql` from your project
4. Copy **entire contents** and paste into SQL Editor
5. Click **Run** (or press `Cmd/Ctrl + Enter`)
6. Wait for success message ✅

---

## 3️⃣ Get API Keys (1 minute)

1. In Supabase dashboard, click **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## 4️⃣ Configure Environment (2 minutes)

1. In your project root, create/update `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend (if running locally)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

2. Save the file

---

## 5️⃣ Install & Run (2 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

**Open**: http://localhost:3000

---

## ✅ Verify Setup (1 minute)

1. Open Supabase **SQL Editor**
2. Run this quick health check:

```sql
-- Quick Health Check
WITH table_check AS (
  SELECT COUNT(*) as count FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('profiles', 'lawyer_profiles', 'consultations', 'queries', 'transactions', 'wallet', 'lawgpt_sessions', 'lawgpt_messages', 'reviews')
),
trigger_check AS (
  SELECT COUNT(*) as count FROM information_schema.triggers
  WHERE trigger_name = 'on_auth_user_created'
)
SELECT 
  table_check.count as tables_created,
  CASE WHEN table_check.count = 9 THEN '✅ All tables created' ELSE '❌ Missing tables' END as status,
  trigger_check.count as trigger_count,
  CASE WHEN trigger_check.count = 1 THEN '✅ Trigger active' ELSE '❌ Trigger missing' END as trigger_status
FROM table_check, trigger_check;
```

**Expected Result:**
```
tables_created: 9 | status: ✅ All tables created
trigger_count: 1  | trigger_status: ✅ Trigger active
```

---

## 🧪 Test It! (5 minutes)

### Test 1: Sign Up as Client
1. Go to http://localhost:3000/signup
2. Fill the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test@123456`
   - Mobile: `9876543210`
   - City: `Mumbai`
3. Click "Continue"
4. Should redirect to login ✅

### Test 2: Login
1. Go to http://localhost:3000/login
2. Enter the email and password from above
3. Click "Login"
4. Should redirect to home page ✅

### Test 3: Try LawGPT
1. Go to http://localhost:3000/lawgpt
2. Type a message: `What is the punishment for theft?`
3. Press Enter
4. Should get AI response ✅

### Test 4: Verify Database
Run in Supabase SQL Editor:
```sql
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;
```

Should show your test user ✅

---

## 🎉 You're Done!

If all tests passed, you're ready to go! 🚀

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to Supabase"
- ✅ Check `.env.local` has correct URL and key
- ✅ Restart dev server: `npm run dev`

### Issue: "Profile not found"
- ✅ Check trigger is active (run health check query above)
- ✅ Try signing up again

### Issue: "Can't send message in LawGPT"
- ✅ Make sure you're logged in
- ✅ Check console for auth errors

### Issue: SQL errors when running schema
- ✅ Make sure you copied the ENTIRE file
- ✅ Run it in one go, don't run parts separately

---

## 📚 Next Steps

1. ✅ Read `AUTHENTICATION_AND_SCHEMA_GUIDE.md` for details
2. ✅ Run full tests from `TESTING_GUIDE.md`
3. ✅ Review `DATABASE_VERIFICATION_QUERIES.sql` for debugging
4. ✅ Check `MIGRATION_SUMMARY.md` for complete overview

---

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Supabase Docs**: https://supabase.com/docs
- **Local App**: http://localhost:3000
- **Backend API**: http://localhost:8000 (if running)

---

## 📞 Need Help?

1. Check the troubleshooting section above
2. Review console logs in browser (F12)
3. Check Supabase logs in dashboard
4. Run verification queries from `DATABASE_VERIFICATION_QUERIES.sql`
5. Read the detailed guides in the project

---

**Setup Time**: ~10 minutes  
**Difficulty**: Easy 🟢  
**Status**: Ready to use! ✅

**Happy coding! 🎉**
