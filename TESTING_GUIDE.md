# 🧪 Turn2Law End-to-End Testing Guide

## 🎯 Purpose
This guide provides step-by-step instructions to test all authentication flows, protected routes, and database integrations.

---

## 📋 Pre-Testing Checklist

### Environment Setup
- [ ] Supabase project created
- [ ] `TURN2LAW_COMPLETE_SCHEMA.sql` executed in Supabase SQL Editor
- [ ] Environment variables configured:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_BACKEND_URL`
- [ ] Frontend running (`npm run dev`)
- [ ] Backend API running (if testing consult feature)

### Database Verification
- [ ] Run `DATABASE_VERIFICATION_QUERIES.sql` (Query #20 - Health Check)
- [ ] Verify all tables exist
- [ ] Verify RLS is enabled
- [ ] Verify triggers are active

---

## 🧪 Test Suite 1: Client Signup & Authentication

### Test 1.1: Client Signup - Happy Path
**Objective**: Verify successful client signup and profile creation

**Steps:**
1. Navigate to `http://localhost:3000/signup`
2. Ensure "Sign up as User" is selected
3. Fill in the form:
   - Name: `John Doe`
   - Email: `johndoe+test1@example.com`
   - Password: `Test@123456`
   - Country Code: `+91`
   - Mobile: `9876543210`
   - City: `Mumbai`
4. Click "Continue"

**Expected Results:**
- ✅ Success alert: "Client registration successful! Please check your email to verify your account."
- ✅ Redirect to `/login`
- ✅ Check Supabase:
  ```sql
  -- Should create entry in auth.users
  SELECT * FROM auth.users WHERE email = 'johndoe+test1@example.com';
  
  -- Should auto-create profile
  SELECT * FROM profiles WHERE email = 'johndoe+test1@example.com';
  ```
- ✅ Profile should have:
  - `full_name` = "John Doe"
  - `user_type` = "client"
  - `phone` = "+919876543210"
  - `city` = "Mumbai"
- ✅ Email verification email sent to inbox

**Failure Scenarios:**
- If profile not created → Check trigger `on_auth_user_created`
- If auth user created but no profile → Check trigger function `handle_new_user()`

---

### Test 1.2: Client Login
**Objective**: Verify client can login successfully

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter:
   - Email: `johndoe+test1@example.com`
   - Password: `Test@123456`
3. Click "Login"

**Expected Results:**
- ✅ Successful login
- ✅ Redirect to `/` (landing page)
- ✅ Session stored in browser (check localStorage/cookies)
- ✅ Check console logs for: `[Supabase Auth] Sign in successful`

---

### Test 1.3: Protected Route - LawGPT (Authenticated)
**Objective**: Verify authenticated user can access LawGPT

**Prerequisites**: Logged in as client from Test 1.2

**Steps:**
1. Navigate to `http://localhost:3000/lawgpt`
2. Type a message: `What is the punishment for theft in India?`
3. Press Enter or click Send

**Expected Results:**
- ✅ Message appears in chat
- ✅ AI responds with legal information
- ✅ Chat saved to database
- ✅ Check Supabase:
  ```sql
  SELECT * FROM lawgpt_sessions WHERE user_id = '<user_id>';
  ```
- ✅ Message count incremented (max 5 per day)

---

### Test 1.4: Protected Route - LawGPT (Unauthenticated)
**Objective**: Verify unauthenticated users are blocked from using LawGPT

**Prerequisites**: Logged out (clear session/cookies)

**Steps:**
1. Navigate to `http://localhost:3000/lawgpt`
2. Type a message: `What is the punishment for theft in India?`
3. Press Enter or click Send

**Expected Results:**
- ✅ Message NOT sent
- ✅ Alert popup: "Please login or sign up to use LawGPT."
- ✅ Two options: OK (go to login) or Cancel (go to signup)
- ✅ Clicking OK redirects to `/login`
- ✅ Clicking Cancel redirects to `/signup`

---

### Test 1.5: Protected Route - Consult (Authenticated)
**Objective**: Verify authenticated user can submit consultation query

**Prerequisites**: Logged in as client

**Steps:**
1. Navigate to `http://localhost:3000/consult`
2. Enter query: `I need help with a property dispute case`
3. Click Send or press Enter

**Expected Results:**
- ✅ Query submitted successfully
- ✅ Success message displayed
- ✅ Redirect to landing page after 5 seconds
- ✅ Check Supabase:
  ```sql
  SELECT * FROM queries WHERE user_id = '<user_id>' ORDER BY created_at DESC LIMIT 1;
  ```
- ✅ Query stored with user_id reference

---

### Test 1.6: Protected Route - Consult (Unauthenticated)
**Objective**: Verify unauthenticated users are blocked from submitting queries

**Prerequisites**: Logged out

**Steps:**
1. Navigate to `http://localhost:3000/consult`
2. Enter query: `I need help with a property dispute case`
3. Click Send or press Enter

**Expected Results:**
- ✅ Alert popup: "Please login or sign up first to submit your query."
- ✅ Two options: OK (go to login) or Cancel (go to signup)
- ✅ Query NOT submitted to backend

---

### Test 1.7: Protected Route - Documents (Authenticated)
**Objective**: Verify authenticated user can generate documents

**Prerequisites**: Logged in as client

**Steps:**
1. Navigate to `http://localhost:3000/documents`
2. Select document type: "NDA"
3. Fill in required fields
4. Click "Generate"

**Expected Results:**
- ✅ Document generation starts
- ✅ AI generates document content
- ✅ Document preview displayed
- ✅ User can download/copy document

---

### Test 1.8: Protected Route - Documents (Unauthenticated)
**Objective**: Verify unauthenticated users are blocked from generating documents

**Prerequisites**: Logged out

**Steps:**
1. Navigate to `http://localhost:3000/documents`
2. Select document type: "NDA"
3. Fill in required fields
4. Click "Generate"

**Expected Results:**
- ✅ Alert popup: "Please login or sign up to generate documents."
- ✅ Two options: OK (go to login) or Cancel (go to signup)
- ✅ Document NOT generated

---

## 🧪 Test Suite 2: Lawyer Signup & Profile Creation

### Test 2.1: Lawyer Signup - Happy Path
**Objective**: Verify successful lawyer signup and lawyer profile creation

**Steps:**
1. Navigate to `http://localhost:3000/signup`
2. Click "Sign up as Lawyer"
3. Fill in the form:
   - Name: `Adv. Priya Sharma`
   - Email: `priya.sharma+test1@example.com`
   - Password: `Lawyer@123456`
   - Country Code: `+91`
   - Mobile: `9123456789`
   - Bar Number: `MH/12345/2015`
   - Experience: `8`
   - Specialization: `Family Law`
   - Education: `LLB from Mumbai University`
   - Court Practice: `Mumbai High Court`
   - Languages: `English, Hindi, Marathi`
   - Consultation Fee: `1500`
   - Bio: `Experienced family law attorney with 8+ years of practice.`
4. Click "Continue"

**Expected Results:**
- ✅ Success alert: "Lawyer registration successful! Please check your email to verify your account."
- ✅ Redirect to `/login`
- ✅ Check Supabase:
  ```sql
  -- Should create entry in auth.users
  SELECT * FROM auth.users WHERE email = 'priya.sharma+test1@example.com';
  
  -- Should auto-create profile
  SELECT * FROM profiles WHERE email = 'priya.sharma+test1@example.com';
  
  -- Should create lawyer_profiles entry
  SELECT * FROM lawyer_profiles lp 
  JOIN profiles p ON p.id = lp.user_id 
  WHERE p.email = 'priya.sharma+test1@example.com';
  ```
- ✅ Profile should have:
  - `full_name` = "Adv. Priya Sharma"
  - `user_type` = "lawyer"
  - `phone` = "+919123456789"
- ✅ Lawyer profile should have:
  - `bar_number` = "MH/12345/2015"
  - `experience_years` = 8
  - `specialization` = "Family Law"
  - `education` = "LLB from Mumbai University"
  - `court_practice` = "Mumbai High Court"
  - `languages` = "English, Hindi, Marathi"
  - `consultation_fee` = 1500.00
  - `bio` = "Experienced family law attorney with 8+ years of practice."
  - `verified` = false (default)
  - `is_active` = true (default)

**Failure Scenarios:**
- If `lawyer_profiles` not created → Check signup form code (lines 251-270)
- If field name error → Verify schema field names match

---

### Test 2.2: Lawyer Login & Access
**Objective**: Verify lawyer can login and access protected routes

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Login with lawyer credentials
3. Try accessing `/lawgpt`, `/consult`, `/documents`

**Expected Results:**
- ✅ Lawyer can login successfully
- ✅ Lawyer can access all protected routes
- ✅ Lawyer-specific features work (if any)

---

## 🧪 Test Suite 3: Data Integrity & Relationships

### Test 3.1: Foreign Key Constraints
**Objective**: Verify all foreign keys reference correct tables

**Steps:**
1. Run query:
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
```

**Expected Results:**
- ✅ `profiles.id` references `auth.users.id`
- ✅ `lawyer_profiles.user_id` references `profiles.id`
- ✅ `consultations.client_id` references `profiles.id`
- ✅ `consultations.lawyer_id` references `profiles.id`
- ✅ `queries.user_id` references `profiles.id`
- ✅ NO foreign keys pointing to `auth.users` except `profiles.id`

---

### Test 3.2: Orphaned Users Check
**Objective**: Verify no orphaned auth users or profiles exist

**Steps:**
1. Run queries:
```sql
-- Check for auth users without profiles
SELECT COUNT(*) FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- Check for profiles without auth users
SELECT COUNT(*) FROM public.profiles p
LEFT JOIN auth.users au ON au.id = p.id
WHERE au.id IS NULL;
```

**Expected Results:**
- ✅ Both queries return `0`
- ✅ No orphaned users
- ✅ No orphaned profiles

---

### Test 3.3: Lawyer Profiles Integrity
**Objective**: Verify all lawyer profiles have valid user references

**Steps:**
1. Run query:
```sql
SELECT 
  lp.id,
  lp.user_id,
  p.user_type,
  p.email
FROM lawyer_profiles lp
LEFT JOIN profiles p ON p.id = lp.user_id
WHERE p.id IS NULL OR p.user_type != 'lawyer';
```

**Expected Results:**
- ✅ Query returns `0 rows`
- ✅ All lawyer profiles have valid user_id
- ✅ All referenced profiles have `user_type = 'lawyer'`

---

## 🧪 Test Suite 4: RLS & Security

### Test 4.1: RLS Policy - Profile Read
**Objective**: Verify anyone can read profiles (public)

**Steps:**
1. Logout (unauthenticated)
2. Run query in Supabase:
```sql
SELECT * FROM profiles LIMIT 5;
```

**Expected Results:**
- ✅ Query succeeds
- ✅ Returns profile data
- ✅ Public read access confirmed

---

### Test 4.2: RLS Policy - Profile Update (Own)
**Objective**: Verify users can only update their own profile

**Steps:**
1. Login as User A
2. Try to update User A's profile (should succeed)
3. Try to update User B's profile (should fail)

**Expected Results:**
- ✅ User can update own profile
- ✅ User CANNOT update other profiles
- ✅ RLS blocks unauthorized updates

---

### Test 4.3: RLS Policy - Lawyer Profile Update
**Objective**: Verify lawyers can only update their own lawyer profile

**Steps:**
1. Login as Lawyer A
2. Try to update Lawyer A's lawyer_profile (should succeed)
3. Try to update Lawyer B's lawyer_profile (should fail)

**Expected Results:**
- ✅ Lawyer can update own lawyer profile
- ✅ Lawyer CANNOT update other lawyer profiles

---

## 🧪 Test Suite 5: Error Handling

### Test 5.1: Duplicate Email
**Objective**: Verify duplicate email signup is blocked

**Steps:**
1. Sign up with email: `test@example.com`
2. Try to sign up again with same email: `test@example.com`

**Expected Results:**
- ✅ Second signup fails
- ✅ Error message: "User already registered" or similar
- ✅ Unique constraint enforced

---

### Test 5.2: Invalid Email Format
**Objective**: Verify email validation

**Steps:**
1. Try to signup with: `invalid-email`

**Expected Results:**
- ✅ HTML5 validation blocks submission
- ✅ Error: "Please enter a valid email address"

---

### Test 5.3: Weak Password
**Objective**: Verify password strength requirements

**Steps:**
1. Try to signup with password: `123`

**Expected Results:**
- ✅ Supabase Auth rejects weak password
- ✅ Error message displayed

---

### Test 5.4: Missing Required Fields
**Objective**: Verify all required fields are enforced

**Steps:**
1. Leave name field empty
2. Try to submit signup form

**Expected Results:**
- ✅ HTML5 validation blocks submission
- ✅ "This field is required" message

---

## 🧪 Test Suite 6: Session Management

### Test 6.1: Session Persistence
**Objective**: Verify session persists across page reloads

**Steps:**
1. Login
2. Refresh page
3. Check authentication status

**Expected Results:**
- ✅ User remains logged in after refresh
- ✅ Session retrieved from Supabase

---

### Test 6.2: Session Expiry
**Objective**: Verify expired sessions are handled

**Steps:**
1. Login
2. Manually clear session from localStorage
3. Try to access protected route

**Expected Results:**
- ✅ User redirected to login
- ✅ "Please login" message displayed

---

### Test 6.3: Logout
**Objective**: Verify logout clears session

**Steps:**
1. Login
2. Click logout button
3. Try to access protected routes

**Expected Results:**
- ✅ Session cleared
- ✅ User redirected to login when accessing protected routes
- ✅ Cannot access LawGPT, Consult, Documents without login

---

## 🧪 Test Suite 7: Edge Cases

### Test 7.1: Special Characters in Name
**Steps:**
1. Signup with name: `O'Brien-Smith Jr.`

**Expected Results:**
- ✅ Signup succeeds
- ✅ Name stored correctly
- ✅ No SQL injection or parsing errors

---

### Test 7.2: International Phone Number
**Steps:**
1. Signup with country code: `+44` and mobile: `7911123456`

**Expected Results:**
- ✅ Phone number stored as `+447911123456`
- ✅ No validation errors

---

### Test 7.3: Long Bio (Lawyer)
**Steps:**
1. Enter 1000+ character bio during lawyer signup

**Expected Results:**
- ✅ Bio stored successfully
- ✅ No truncation (TEXT field)

---

### Test 7.4: Concurrent Signups
**Steps:**
1. Open two browser tabs
2. Simultaneously signup with different emails

**Expected Results:**
- ✅ Both signups succeed
- ✅ No race condition errors
- ✅ Both profiles created correctly

---

## 📊 Test Results Template

Use this template to track your testing:

```
TEST RUN: [Date]
TESTER: [Name]

✅ PASSED | ❌ FAILED | ⚠️ PARTIAL

Test Suite 1: Client Signup & Authentication
[ ] 1.1 Client Signup - Happy Path
[ ] 1.2 Client Login
[ ] 1.3 LawGPT (Authenticated)
[ ] 1.4 LawGPT (Unauthenticated)
[ ] 1.5 Consult (Authenticated)
[ ] 1.6 Consult (Unauthenticated)
[ ] 1.7 Documents (Authenticated)
[ ] 1.8 Documents (Unauthenticated)

Test Suite 2: Lawyer Signup & Profile
[ ] 2.1 Lawyer Signup - Happy Path
[ ] 2.2 Lawyer Login & Access

Test Suite 3: Data Integrity
[ ] 3.1 Foreign Key Constraints
[ ] 3.2 Orphaned Users Check
[ ] 3.3 Lawyer Profiles Integrity

Test Suite 4: RLS & Security
[ ] 4.1 Profile Read
[ ] 4.2 Profile Update (Own)
[ ] 4.3 Lawyer Profile Update

Test Suite 5: Error Handling
[ ] 5.1 Duplicate Email
[ ] 5.2 Invalid Email Format
[ ] 5.3 Weak Password
[ ] 5.4 Missing Required Fields

Test Suite 6: Session Management
[ ] 6.1 Session Persistence
[ ] 6.2 Session Expiry
[ ] 6.3 Logout

Test Suite 7: Edge Cases
[ ] 7.1 Special Characters in Name
[ ] 7.2 International Phone Number
[ ] 7.3 Long Bio
[ ] 7.4 Concurrent Signups

ISSUES FOUND:
1. [Issue description]
2. [Issue description]

NOTES:
- [Any observations]
```

---

## 🚨 Common Issues & Solutions

### Issue: Profile not created after signup
**Solution**: Check trigger `on_auth_user_created` is active:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

### Issue: Lawyer profile not created
**Solution**: Check signup form code (line 258-270) and verify field names match schema

### Issue: "Profile not found" error
**Solution**: Run orphaned users cleanup:
```sql
-- Find orphaned auth users
SELECT * FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- Create missing profiles (adjust as needed)
-- Then re-test signup flow
```

### Issue: Foreign key violation
**Solution**: Verify all foreign keys reference `public.profiles`, not `auth.users`

---

## ✅ Testing Complete

After completing all tests, you should have:
- ✅ Verified all authentication flows work
- ✅ Confirmed protected routes are secure
- ✅ Validated database schema and relationships
- ✅ Tested RLS policies
- ✅ Verified error handling
- ✅ Confirmed session management

**Next Steps:**
1. Deploy to staging environment
2. Run tests again in staging
3. Fix any issues found
4. Deploy to production
5. Monitor for any errors

---

**Created**: December 2024  
**Status**: Ready for testing  
**Last Updated**: [Date]
