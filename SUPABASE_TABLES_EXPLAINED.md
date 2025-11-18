# Supabase Tables Explained

## Your Question: "Profiles table has data but Users table is empty - is this okay?"

### **YES, this is 100% CORRECT! ✅**

Here's why:

## Supabase Table Structure

### 1. **`auth.users` Table** (The "Users" table you see)
- **Located in**: `auth` schema (Supabase's internal authentication schema)
- **Purpose**: Stores authentication credentials (email, password hashes, etc.)
- **Managed by**: Supabase Auth system automatically
- **You should NOT directly modify this table**
- **Data stored**:
  - `id` (UUID)
  - `email`
  - `encrypted_password`
  - `email_confirmed_at`
  - `created_at`
  - `updated_at`
  - `raw_user_meta_data` (our custom fields like full_name, user_type)

### 2. **`public.profiles` Table** (Your application's user profiles)
- **Located in**: `public` schema (your application's main schema)
- **Purpose**: Stores user profile information for your application
- **Managed by**: Your application + database trigger
- **Data stored**:
  - `id` (references auth.users.id)
  - `email`
  - `full_name`
  - `user_type` (client/lawyer)
  - `phone`
  - `city`
  - `created_at`
  - `updated_at`

## How They Work Together

```
User Signs Up
     ↓
Supabase creates record in auth.users
     ↓
Database trigger fires
     ↓
Automatically creates matching record in public.profiles
```

## Why You See This

When you look at Supabase dashboard:
- **Auth → Users**: Shows `auth.users` table (authentication data)
- **Table Editor → profiles**: Shows `public.profiles` table (application data)

**Both tables should have the SAME users**, just different information!

## What You Should Check

Go to Supabase Dashboard:

1. **Check Auth Users**:
   - Navigate to: **Authentication → Users**
   - You should see users here with their emails

2. **Check Profiles Table**:
   - Navigate to: **Table Editor → profiles**
   - You should see the same users here

If you see users in profiles but the Table Editor shows "users" as empty, it's because:
- There's NO `public.users` table (and that's correct!)
- You might be looking at the wrong table view
- The actual auth users are in the **Authentication** section, not Table Editor

## Current Setup (Correct ✅)

```
Supabase
├── Authentication (auth schema)
│   └── Users (auth.users) ← Supabase manages this
│
└── Table Editor (public schema)
    ├── profiles ← Your app uses this
    ├── lawgpt_sessions
    ├── client_queries
    └── (other tables)
```

## What Happens on Signup

1. User fills signup form with:
   - email: "user@example.com"
   - password: "password123"
   - full_name: "John Doe"
   - user_type: "client"

2. Supabase Auth creates in `auth.users`:
   ```sql
   id: "550e8400-e29b-41d4-a716-446655440000"
   email: "user@example.com"
   encrypted_password: "$2a$..."
   raw_user_meta_data: {
     "full_name": "John Doe",
     "user_type": "client"
   }
   ```

3. Database trigger automatically creates in `public.profiles`:
   ```sql
   id: "550e8400-e29b-41d4-a716-446655440000" (same as auth.users.id)
   email: "user@example.com"
   full_name: "John Doe"
   user_type: "client"
   ```

## Important Notes

- **Never query `auth.users` directly** - use Supabase Auth API
- **Always query `public.profiles`** for user information in your app
- **The IDs match** - `profiles.id` = `auth.users.id`
- **Both should have the same number of users**

## Verification Query

Run this in Supabase SQL Editor to see your users:

```sql
-- See all users in profiles
SELECT * FROM public.profiles;

-- See auth users (limited fields)
SELECT id, email, created_at 
FROM auth.users;

-- See if they match (should return same count)
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.profiles) as profiles_count;
```

---

**TL;DR**: You're seeing it correctly! Supabase Auth manages `auth.users` (in Authentication section), and your app uses `public.profiles` (in Table Editor). Both should have the same users. ✅
