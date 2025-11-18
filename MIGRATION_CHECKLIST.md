# ✅ Turn2Law Migration Checklist

**Track your progress through the complete migration and testing process**

---

## 📋 Phase 1: Initial Setup (30 minutes)

### Environment Setup
- [ ] Create Supabase account
- [ ] Create new Supabase project named "turn2law"
- [ ] Note down database password
- [ ] Wait for project provisioning (~2 minutes)
- [ ] Copy Project URL from Settings → API
- [ ] Copy anon/public key from Settings → API
- [ ] Create/update `.env.local` in frontend folder
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `NEXT_PUBLIC_BACKEND_URL` (optional)

### Database Setup
- [ ] Open Supabase dashboard
- [ ] Navigate to SQL Editor
- [ ] Open `TURN2LAW_COMPLETE_SCHEMA.sql` from project
- [ ] Copy entire contents
- [ ] Paste into SQL Editor
- [ ] Click "Run" (Cmd/Ctrl + Enter)
- [ ] Wait for "Success" message
- [ ] Verify no errors in output

### Code Setup
- [ ] Navigate to frontend folder in terminal
- [ ] Run `npm install` (if not already done)
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Verify app loads without errors

---

## 📋 Phase 2: Database Verification (15 minutes)

### Run Verification Queries
Open `DATABASE_VERIFICATION_QUERIES.sql` and run each query in Supabase SQL Editor:

- [ ] Query #1: Check all tables exist (should show 9 tables)
- [ ] Query #2: Verify profiles table structure
- [ ] Query #3: Verify lawyer_profiles table structure
- [ ] Query #4: Check foreign key relationships
- [ ] Query #5: Verify RLS is enabled (all tables should show true)
- [ ] Query #6: List all RLS policies
- [ ] Query #7: Check triggers (should show on_auth_user_created)
- [ ] Query #8: Verify indexes
- [ ] Query #20: **Run health check** (all should show ✅)

### Expected Results
- [ ] All 9 tables created: `profiles`, `lawyer_profiles`, `consultations`, `queries`, `transactions`, `wallet`, `lawgpt_sessions`, `lawgpt_messages`, `reviews`
- [ ] Trigger `on_auth_user_created` active
- [ ] RLS enabled on all tables
- [ ] Foreign keys reference `public.profiles` (NOT `auth.users`)
- [ ] Health check shows all green ✅

---

## 📋 Phase 3: Authentication Testing (45 minutes)

### Test Suite 1: Client Signup (10 minutes)

#### Test 1.1: Client Signup - Happy Path
- [ ] Navigate to http://localhost:3000/signup
- [ ] Click "Sign up as User" (should be selected by default)
- [ ] Fill form:
  - Name: `Test Client`
  - Email: `testclient1@example.com`
  - Password: `Test@123456`
  - Country Code: `+91`
  - Mobile: `9876543210`
  - City: `Mumbai`
- [ ] Click "Continue"
- [ ] See success alert
- [ ] Redirected to `/login`
- [ ] Check Supabase: Run `SELECT * FROM profiles WHERE email = 'testclient1@example.com';`
- [ ] Verify profile created with correct data
- [ ] Verify `user_type = 'client'`

#### Test 1.2: Client Login
- [ ] Navigate to http://localhost:3000/login
- [ ] Enter email: `testclient1@example.com`
- [ ] Enter password: `Test@123456`
- [ ] Click "Login"
- [ ] Login successful
- [ ] Redirected to home page

#### Test 1.3: LawGPT Access (Authenticated)
- [ ] Still logged in as client
- [ ] Navigate to http://localhost:3000/lawgpt
- [ ] Type message: `What is the punishment for theft in India?`
- [ ] Press Enter
- [ ] Message sent successfully
- [ ] AI responds with legal information
- [ ] Check console for no errors

#### Test 1.4: LawGPT Access (Unauthenticated)
- [ ] Log out (or use incognito window)
- [ ] Navigate to http://localhost:3000/lawgpt
- [ ] Type message: `What is the punishment for theft?`
- [ ] Press Enter
- [ ] Alert popup appears: "Please login or sign up to use LawGPT"
- [ ] Message NOT sent
- [ ] Clicking OK redirects to `/login`
- [ ] Clicking Cancel redirects to `/signup`

### Test Suite 2: Lawyer Signup (15 minutes)

#### Test 2.1: Lawyer Signup - Happy Path
- [ ] Log out if logged in
- [ ] Navigate to http://localhost:3000/signup
- [ ] Click "Sign up as Lawyer"
- [ ] Fill all fields:
  - Name: `Adv. Test Lawyer`
  - Email: `testlawyer1@example.com`
  - Password: `Lawyer@123456`
  - Country Code: `+91`
  - Mobile: `9123456789`
  - Bar Number: `MH/12345/2020`
  - Experience: `5`
  - Specialization: `Criminal Law`
  - Education: `LLB from Mumbai University`
  - Court Practice: `Mumbai High Court`
  - Languages: `English, Hindi, Marathi`
  - Consultation Fee: `2000`
  - Bio: `Experienced criminal lawyer with 5 years practice.`
- [ ] Click "Continue"
- [ ] Success alert shown
- [ ] Redirected to `/login`

#### Test 2.2: Verify Lawyer Profile Created
Run in Supabase SQL Editor:
```sql
-- Check profile
SELECT * FROM profiles WHERE email = 'testlawyer1@example.com';

-- Check lawyer profile
SELECT * FROM lawyer_profiles lp 
JOIN profiles p ON p.id = lp.user_id 
WHERE p.email = 'testlawyer1@example.com';
```

- [ ] Profile created with `user_type = 'lawyer'`
- [ ] Lawyer profile created with all fields
- [ ] `experience_years = 5` (not years_of_experience)
- [ ] All specialization, education, etc. match form input

#### Test 2.3: Lawyer Login & Access
- [ ] Login as lawyer: `testlawyer1@example.com` / `Lawyer@123456`
- [ ] Login successful
- [ ] Navigate to `/lawgpt` - works ✅
- [ ] Navigate to `/consult` - works ✅
- [ ] Navigate to `/documents` - works ✅

### Test Suite 3: Protected Routes (10 minutes)

#### Test 3.1: Consult Page (Authenticated)
- [ ] Log in as client
- [ ] Navigate to http://localhost:3000/consult
- [ ] Enter query: `I need help with a property dispute`
- [ ] Click Submit
- [ ] Success message shown
- [ ] Query submitted to backend
- [ ] Check Supabase: `SELECT * FROM queries ORDER BY created_at DESC LIMIT 1;`
- [ ] Query stored with correct user_id

#### Test 3.2: Consult Page (Unauthenticated)
- [ ] Log out
- [ ] Navigate to http://localhost:3000/consult
- [ ] Enter query: `Test query`
- [ ] Click Submit
- [ ] Alert popup: "Please login or sign up"
- [ ] Query NOT submitted

#### Test 3.3: Documents Page (Authenticated)
- [ ] Log in
- [ ] Navigate to http://localhost:3000/documents
- [ ] Select NDA document type
- [ ] Fill required fields
- [ ] Click Generate
- [ ] Document generation starts
- [ ] Document preview shown

#### Test 3.4: Documents Page (Unauthenticated)
- [ ] Log out
- [ ] Navigate to http://localhost:3000/documents
- [ ] Try to generate document
- [ ] Alert popup: "Please login or sign up"
- [ ] Document NOT generated

### Test Suite 4: Session Management (10 minutes)

#### Test 4.1: Session Persistence
- [ ] Log in
- [ ] Refresh page (F5)
- [ ] Still logged in ✅
- [ ] Navigate to different pages
- [ ] Still logged in ✅
- [ ] Close browser, reopen
- [ ] Still logged in ✅

#### Test 4.2: Logout
- [ ] Log in
- [ ] Click logout button (if implemented)
- [ ] Session cleared
- [ ] Try to access `/lawgpt`
- [ ] Should prompt to login

---

## 📋 Phase 4: Data Integrity Testing (30 minutes)

### Test Suite 5: Database Integrity

#### Test 5.1: No Orphaned Users
Run in Supabase:
```sql
-- Should return 0 rows
SELECT COUNT(*) FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;
```
- [ ] Query returns `0` (no orphaned auth users)

Run:
```sql
-- Should return 0 rows
SELECT COUNT(*) FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.id
WHERE au.id IS NULL;
```
- [ ] Query returns `0` (no orphaned profiles)

#### Test 5.2: Foreign Keys Correct
Run:
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
```
- [ ] `profiles.id` references `auth.users.id` ✅
- [ ] `lawyer_profiles.user_id` references `profiles.id` ✅
- [ ] `consultations.client_id` references `profiles.id` ✅
- [ ] `consultations.lawyer_id` references `profiles.id` ✅
- [ ] `queries.user_id` references `profiles.id` ✅
- [ ] NO foreign keys to `auth.users` except profiles.id ✅

#### Test 5.3: Lawyer Profiles Integrity
Run:
```sql
SELECT COUNT(*) FROM lawyer_profiles lp
LEFT JOIN profiles p ON p.id = lp.user_id
WHERE p.id IS NULL OR p.user_type != 'lawyer';
```
- [ ] Query returns `0` (all lawyer profiles have valid user_id)
- [ ] All referenced profiles have `user_type = 'lawyer'`

---

## 📋 Phase 5: Error Handling (20 minutes)

### Test Suite 6: Error Cases

#### Test 6.1: Duplicate Email
- [ ] Sign up with email: `duplicate@test.com`
- [ ] Try to sign up again with same email
- [ ] Error shown: "User already registered" or similar
- [ ] Signup blocked ✅

#### Test 6.2: Invalid Email
- [ ] Try to signup with email: `invalid-email`
- [ ] HTML5 validation blocks submission
- [ ] Error: "Please enter a valid email"

#### Test 6.3: Weak Password
- [ ] Try to signup with password: `123`
- [ ] Supabase rejects weak password
- [ ] Error message displayed

#### Test 6.4: Missing Required Fields
- [ ] Try to submit signup with empty name
- [ ] HTML5 validation: "This field is required"
- [ ] Form not submitted

#### Test 6.5: Special Characters
- [ ] Sign up with name: `O'Brien-Smith Jr.`
- [ ] Signup succeeds
- [ ] Name stored correctly
- [ ] No SQL errors

---

## 📋 Phase 6: RLS Security Testing (15 minutes)

### Test Suite 7: Row Level Security

#### Test 7.1: Public Profile Read
- [ ] Log out (unauthenticated)
- [ ] Run in Supabase: `SELECT * FROM profiles LIMIT 5;`
- [ ] Query succeeds (public read access) ✅

#### Test 7.2: Own Profile Update
- [ ] Log in as User A
- [ ] Try to update own profile via Supabase
- [ ] Update succeeds ✅

#### Test 7.3: Other Profile Update (Should Fail)
- [ ] Logged in as User A
- [ ] Try to update User B's profile
- [ ] Update blocked by RLS ❌
- [ ] Error: "Policy violation"

#### Test 7.4: Lawyer Profile Update
- [ ] Log in as Lawyer A
- [ ] Try to update own lawyer_profile
- [ ] Update succeeds ✅
- [ ] Try to update Lawyer B's profile
- [ ] Update blocked ❌

---

## 📋 Phase 7: End-to-End Scenarios (30 minutes)

### Scenario 1: Complete Client Journey
- [ ] Sign up as new client
- [ ] Verify email (check inbox)
- [ ] Log in
- [ ] Use LawGPT (ask 3 questions)
- [ ] Submit consultation query
- [ ] Generate NDA document
- [ ] Check all data in database
- [ ] Log out
- [ ] Log in again
- [ ] View chat history in LawGPT
- [ ] All working ✅

### Scenario 2: Complete Lawyer Journey
- [ ] Sign up as new lawyer
- [ ] Verify all lawyer-specific fields saved
- [ ] Log in
- [ ] Use LawGPT
- [ ] Check profile in database
- [ ] Verify lawyer_profiles entry exists
- [ ] All fields correct ✅

### Scenario 3: Concurrent Users
- [ ] Open two incognito windows
- [ ] Sign up different users simultaneously
- [ ] Both succeed
- [ ] Both can log in
- [ ] No race conditions ✅

---

## 📋 Phase 8: Performance & Load (Optional) (20 minutes)

### Basic Performance Tests
- [ ] Create 10 test users (5 clients, 5 lawyers)
- [ ] All profiles created correctly
- [ ] LawGPT works for all users
- [ ] No performance degradation
- [ ] Database queries remain fast

### Data Consistency
- [ ] Run verification Query #20 (health check)
- [ ] All ✅ green
- [ ] No orphaned data
- [ ] All relationships intact

---

## 📋 Phase 9: Documentation Review (10 minutes)

### Review All Documentation
- [ ] Read `QUICK_START.md`
- [ ] Read `AUTHENTICATION_AND_SCHEMA_GUIDE.md`
- [ ] Read `TESTING_GUIDE.md`
- [ ] Read `MIGRATION_SUMMARY.md`
- [ ] Review `ARCHITECTURE_DIAGRAMS.md`
- [ ] All documentation clear and accurate ✅

---

## 📋 Phase 10: Production Readiness (30 minutes)

### Pre-Production Checklist
- [ ] All tests above passed
- [ ] No critical bugs found
- [ ] Environment variables secured
- [ ] Database backup created
- [ ] RLS policies verified
- [ ] Indexes optimized
- [ ] Error handling tested
- [ ] Edge cases handled

### Production Setup
- [ ] Create production Supabase project
- [ ] Run schema in production
- [ ] Update production environment variables
- [ ] Deploy frontend to production
- [ ] Deploy backend to production
- [ ] Test in production environment
- [ ] Monitor for errors
- [ ] Set up error tracking (Sentry, etc.)

---

## 📊 Final Score

**Count your checkmarks:**
- Total possible: ~150 checks
- Your completed: _____ / 150

**Scoring:**
- 140-150: 🏆 Perfect! Ready for production
- 120-139: 🥇 Excellent! Minor fixes needed
- 100-119: 🥈 Good! Some testing required
- 80-99: 🥉 Okay! More testing needed
- <80: ⚠️ Needs attention

---

## 🎉 Completion Certificate

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║       TURN2LAW SUPABASE MIGRATION COMPLETE            ║
║                                                        ║
║  ✅ Database Schema Deployed                          ║
║  ✅ Authentication Implemented                        ║
║  ✅ Protected Routes Secured                          ║
║  ✅ All Tests Passed                                  ║
║  ✅ RLS Policies Verified                             ║
║  ✅ Data Integrity Confirmed                          ║
║                                                        ║
║  Completed by: _____________________                  ║
║  Date: _____________________                          ║
║  Score: _____ / 150                                   ║
║                                                        ║
║  Status: ✅ READY FOR PRODUCTION                      ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## 📝 Notes & Issues

**Issues Found During Testing:**
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

**Resolved:**
- [ ] Issue 1
- [ ] Issue 2
- [ ] Issue 3

**Outstanding:**
- [ ] _____________________________________________
- [ ] _____________________________________________

---

## 🚀 Next Steps After Completion

- [ ] Deploy to staging
- [ ] Run full test suite in staging
- [ ] Get stakeholder approval
- [ ] Deploy to production
- [ ] Monitor production for 48 hours
- [ ] Collect user feedback
- [ ] Plan next features from TODO list

---

**Checklist Version**: 1.0  
**Last Updated**: December 2024  
**Status**: Ready for Use ✅

**Good luck with testing! 🎉**
