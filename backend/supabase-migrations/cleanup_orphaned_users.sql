-- Utility: Clean up orphaned Supabase Auth users
-- Use this when you've deleted profiles but auth users still exist

-- ============================================
-- OPTION 1: Find orphaned auth users (users without profiles)
-- ============================================

-- This query shows auth users that don't have a corresponding profile
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created,
  au.last_sign_in_at,
  CASE 
    WHEN p.id IS NULL THEN '❌ NO PROFILE'
    ELSE '✅ HAS PROFILE'
  END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- ============================================
-- OPTION 2: Delete a specific user from Supabase Auth
-- ============================================

-- Replace 'user-uuid-here' with the actual user ID
-- DELETE FROM auth.users WHERE id = 'user-uuid-here';

-- WARNING: This will permanently delete the user from Supabase Auth
-- They will need to sign up again


-- ============================================
-- OPTION 3: Delete ALL users (DANGEROUS - Testing only!)
-- ============================================

-- UNCOMMENT ONLY IF YOU WANT TO DELETE ALL USERS
-- This is useful for testing/development environments
-- DO NOT USE IN PRODUCTION

-- DELETE FROM auth.users;

-- After running this, all users are gone and can sign up fresh


-- ============================================
-- OPTION 4: Create missing profiles for orphaned users
-- ============================================

-- If you have auth users without profiles, this will create profiles for them
-- Useful if the trigger failed or profiles were accidentally deleted

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  user_type,
  phone,
  city,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Unknown User'),
  COALESCE(au.raw_user_meta_data->>'user_type', 'client'),
  au.raw_user_meta_data->>'phone',
  au.raw_user_meta_data->>'city',
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL; -- Only create profiles for users without one

-- Verify the profiles were created
SELECT COUNT(*) as profiles_created FROM public.profiles;


-- ============================================
-- OPTION 5: Check if profile trigger is working
-- ============================================

-- Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- If no results, the trigger doesn't exist - run create_profile_trigger.sql


-- ============================================
-- RECOMMENDED WORKFLOW FOR TESTING
-- ============================================

-- 1. View current state
SELECT 'Auth Users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Profiles', COUNT(*) FROM public.profiles;

-- 2. Find orphaned users
SELECT au.email, au.id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 3. Delete specific orphaned user (replace email)
-- DELETE FROM auth.users WHERE email = 'test@example.com';

-- 4. Or create missing profile (if you want to keep the auth user)
-- Run OPTION 4 above

-- 5. Verify cleanup
SELECT 'Auth Users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Profiles', COUNT(*) FROM public.profiles;


-- ============================================
-- QUICK FIX FOR YOUR CURRENT ISSUE
-- ============================================

-- Find the problematic user
SELECT email, id FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Delete them (copy the ID from above and replace below)
-- DELETE FROM auth.users WHERE email = 'your-test-email@example.com';

-- Now you can sign up fresh with that email
