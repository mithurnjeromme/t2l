# 🎨 Turn2Law Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TURN2LAW SYSTEM                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   USER BROWSER      │
│  (localhost:3000)   │
└──────────┬──────────┘
           │
           ├── Public Routes (No Auth Required)
           │   ├── /              (Landing Page)
           │   ├── /login         (Login Form)
           │   └── /signup        (Signup Form)
           │
           ├── Protected Routes (Auth Required) 🔒
           │   ├── /lawgpt        (AI Legal Assistant)
           │   ├── /consult       (Consultation Form)
           │   └── /documents     (Document Generator)
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                               │
│                                                                       │
│  ┌─────────────────┐     ┌──────────────────┐                       │
│  │  Auth Helpers   │     │  Supabase Client │                       │
│  │  supabase-auth  │────▶│    supabase.ts   │                       │
│  └─────────────────┘     └─────────┬────────┘                       │
│                                    │                                 │
└────────────────────────────────────┼─────────────────────────────────┘
                                     │
                                     │ HTTPS / JWT
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SUPABASE (Backend as a Service)                  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  AUTHENTICATION (auth.users)                                  │   │
│  │  - Email/Password                                             │   │
│  │  - Session Management                                         │   │
│  │  - JWT Token Generation                                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                           │                                           │
│                           │ Trigger: on_auth_user_created             │
│                           ▼                                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  DATABASE (PostgreSQL)                                        │   │
│  │                                                               │   │
│  │  ┌────────────────┐      ┌──────────────────┐               │   │
│  │  │   profiles     │◀─────│  auth.users      │               │   │
│  │  │  (core user    │      │  (Supabase Auth) │               │   │
│  │  │   data)        │      └──────────────────┘               │   │
│  │  └───────┬────────┘                                          │   │
│  │          │                                                   │   │
│  │          ├──────────────┐                                    │   │
│  │          │              │                                    │   │
│  │          ▼              ▼                                    │   │
│  │  ┌──────────────┐  ┌─────────────────┐                     │   │
│  │  │lawyer_profiles│  │ consultations   │                     │   │
│  │  │              │  │    queries       │                     │   │
│  │  │              │  │    wallet        │                     │   │
│  │  │              │  │  lawgpt_sessions │                     │   │
│  │  └──────────────┘  └─────────────────┘                     │   │
│  │                                                               │   │
│  │  🔒 Row Level Security (RLS) - All tables protected          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ API Calls
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND API (Optional)                           │
│                     (localhost:8000)                                  │
│                                                                       │
│  - Consult Query Handler                                             │
│  - LawGPT AI Service (turn2law-lawgpt-2.onrender.com)               │
│  - Document Generation                                               │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### User Signup Flow

```
┌─────────┐
│  USER   │
└────┬────┘
     │
     │ 1. Fills signup form
     │    (name, email, password, etc.)
     ▼
┌──────────────────┐
│  Signup Page     │
│  /signup         │
└────┬─────────────┘
     │
     │ 2. Calls signUpWithEmail()
     │    with user data
     ▼
┌──────────────────────┐
│  supabase-auth.ts    │
│  (Auth Helper)       │
└────┬─────────────────┘
     │
     │ 3. supabase.auth.signUp()
     │    Creates auth user
     ▼
┌──────────────────────────────────────┐
│  Supabase Auth                       │
│  - Creates entry in auth.users       │
│  - Stores encrypted password         │
│  - Stores metadata (full_name, etc.) │
└────┬─────────────────────────────────┘
     │
     │ 4. TRIGGER: on_auth_user_created
     │    Fires automatically
     ▼
┌────────────────────────────────────────┐
│  handle_new_user() Function            │
│  - Reads auth.users metadata          │
│  - Creates profile in public.profiles │
└────┬───────────────────────────────────┘
     │
     │ 5. Profile created ✅
     │
     ├─── For Client:
     │    └─> Done! Profile ready
     │
     └─── For Lawyer:
          │ 6. Frontend creates lawyer_profiles
          │    entry with additional data
          ▼
     ┌──────────────────────────┐
     │  public.lawyer_profiles  │
     │  - bar_number            │
     │  - experience_years      │
     │  - specialization        │
     │  - etc.                  │
     └──────────────────────────┘
          │
          │ 7. Lawyer profile complete ✅
          ▼
     ┌─────────────────┐
     │  Success! 🎉    │
     │  Redirect login │
     └─────────────────┘
```

---

## 🔒 Protected Route Access Flow

### Accessing LawGPT (or any protected route)

```
┌─────────┐
│  USER   │
└────┬────┘
     │
     │ 1. Navigates to /lawgpt
     ▼
┌───────────────────────────┐
│  LawGPT Page              │
│  useEffect() runs on load │
└────┬──────────────────────┘
     │
     │ 2. Calls getSession()
     ▼
┌──────────────────────┐
│  supabase-auth.ts    │
│  getSession()        │
└────┬─────────────────┘
     │
     │ 3. Checks Supabase session
     ▼
┌─────────────────────────────────┐
│  Supabase                       │
│  Returns session or null        │
└────┬───────────────┬────────────┘
     │               │
     │ Session       │ No Session
     │ Found ✅      │ Found ❌
     ▼               ▼
┌────────────┐  ┌─────────────────────┐
│ Authorized │  │  Unauthorized       │
│            │  │                     │
│ - Set user │  │ - Block access      │
│ - Load     │  │ - Show login prompt │
│   history  │  │                     │
│ - Enable   │  │ User tries to send: │
│   sending  │  │ ├─ Alert popup      │
│            │  │ ├─ Redirect /login  │
└────────────┘  │ └─ OR /signup       │
                └─────────────────────┘
```

---

## 📊 Database Schema Relationships

```
┌────────────────────┐
│   auth.users       │ ◀─── Managed by Supabase Auth
│  (Supabase Auth)   │
│                    │
│  - id (UUID) PK    │
│  - email           │
│  - encrypted_pwd   │
│  - metadata        │
└─────────┬──────────┘
          │
          │ FK: profiles.id → auth.users.id
          │ ON DELETE CASCADE
          ▼
┌────────────────────────────────────┐
│       public.profiles              │ ◀─── Core user data
│    (Extended user info)            │
│                                    │
│  - id (UUID) PK ────────────┐     │
│  - email (UNIQUE)           │     │
│  - full_name                │     │
│  - phone                    │     │
│  - user_type ───────────┐   │     │
│  - city                 │   │     │
│  - created_at           │   │     │
│  - updated_at           │   │     │
└─────────────────────────┼───┼─────┘
                          │   │
       ┌──────────────────┘   └────────────────────┐
       │                                            │
       │ For user_type = 'lawyer'                  │
       ▼                                            │
┌────────────────────────────────┐                 │
│   public.lawyer_profiles       │                 │
│   (Lawyer-specific data)       │                 │
│                                │                 │
│  - id (UUID) PK                │                 │
│  - user_id (UUID) UNIQUE ◀─────┘                 │
│      FK → profiles.id                            │
│  - bar_number                                    │
│  - experience_years                              │
│  - specialization                                │
│  - consultation_fee                              │
│  - bio                                           │
│  - verified                                      │
│  - rating                                        │
└────────────────────────────────┘                 │
                                                   │
                                                   │ FK: *.user_id → profiles.id
                  ┌────────────────────────────────┤
                  │                                │
                  ▼                                ▼
┌──────────────────────────┐      ┌─────────────────────────┐
│   consultations          │      │   queries               │
│                          │      │                         │
│  - client_id ◀───────────┼──────┤  - user_id ◀────────────┤
│  - lawyer_id ◀───────────┤      │  - query                │
│  - status                │      │  - timestamp            │
│  - fee                   │      └─────────────────────────┘
└──────────────────────────┘
                  │
                  │ FK → profiles.id
                  ▼
┌──────────────────────────┐      ┌─────────────────────────┐
│   lawgpt_sessions        │      │   wallet                │
│                          │      │                         │
│  - user_id ◀─────────────┼──────┤  - user_id ◀────────────┤
│  - title                 │      │  - balance              │
│  - messages              │      └─────────────────────────┘
└──────────────────────────┘

🔒 ALL TABLES HAVE RLS ENABLED
```

---

## 🔄 Automatic Profile Creation

```
┌──────────────────────────────────────────────────────────────┐
│  USER SIGNS UP                                               │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ supabase.auth.signUp({
                   │   email, password,
                   │   options: { data: { full_name, user_type, ... }}
                   │ })
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  SUPABASE AUTH                                               │
│  1. Creates entry in auth.users                             │
│  2. Stores metadata in raw_user_meta_data field              │
│  3. Returns user object + session                            │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ TRIGGER: on_auth_user_created
                   │ (AFTER INSERT ON auth.users)
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  FUNCTION: handle_new_user()                                 │
│                                                              │
│  BEGIN                                                       │
│    INSERT INTO public.profiles (                            │
│      id,                    ← NEW.id (same as auth.users)   │
│      email,                 ← NEW.email                     │
│      full_name,             ← metadata->>'full_name'         │
│      phone,                 ← metadata->>'phone'             │
│      user_type,             ← metadata->>'user_type'         │
│      city                   ← metadata->>'city'              │
│    )                                                         │
│  END;                                                        │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ Profile created automatically! ✅
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  public.profiles                                             │
│  ✅ New profile entry exists with same ID as auth.users      │
│  ✅ All metadata copied from signup form                     │
│  ✅ user_type set to 'client' or 'lawyer'                    │
└──────────────────────────────────────────────────────────────┘
                   │
                   │ IF user_type = 'lawyer'
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND                                                    │
│  Additional step: Insert into lawyer_profiles                │
│  (bar_number, experience, specialization, etc.)              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  ✅ COMPLETE PROFILE SETUP                                   │
│  - auth.users entry                                          │
│  - profiles entry                                            │
│  - lawyer_profiles entry (if lawyer)                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Row Level Security (RLS) Flow

```
┌─────────────────┐
│  USER REQUEST   │
│  (Authenticated)│
└────┬────────────┘
     │
     │ SELECT * FROM profiles WHERE id = 'xxx';
     ▼
┌─────────────────────────────────────────────────┐
│  SUPABASE RLS ENGINE                            │
│                                                 │
│  1. Extract user ID from JWT token             │
│  2. Apply RLS policies to query                │
│  3. Rewrite query with security checks         │
└────┬────────────────────────────────────────────┘
     │
     │ Checks RLS Policy:
     │ "Users can update own profile"
     │ USING (auth.uid() = id)
     ▼
┌──────────────────────────────┐
│  Policy Evaluation           │
│                              │
│  auth.uid() = 'user-123'     │
│  profiles.id = 'user-123'    │
│                              │
│  Match? ✅ YES               │
└────┬─────────────────────────┘
     │
     │ ALLOW ACCESS
     ▼
┌──────────────────┐
│  Query Succeeds  │
│  Returns data ✅ │
└──────────────────┘


ALTERNATIVE FLOW (Unauthorized):

┌─────────────────┐
│  USER REQUEST   │
│  (User A)       │
└────┬────────────┘
     │
     │ UPDATE profiles SET name = 'Hacked'
     │ WHERE id = 'user-B-id';
     ▼
┌─────────────────────────────────────┐
│  SUPABASE RLS ENGINE                │
│                                     │
│  auth.uid() = 'user-A-id'           │
│  Target: 'user-B-id'                │
│                                     │
│  Policy: auth.uid() = id            │
│  Match? ❌ NO                       │
└────┬────────────────────────────────┘
     │
     │ DENY ACCESS
     ▼
┌──────────────────────┐
│  Query Blocked 🚫    │
│  Error: Policy       │
│  violation           │
└──────────────────────┘
```

---

## 📈 Data Flow: User Submits Consultation Query

```
┌─────────┐
│  USER   │
│ (Logged │
│  In)    │
└────┬────┘
     │
     │ 1. Fills consultation form
     │    "I need help with property dispute"
     ▼
┌──────────────────┐
│  /consult page   │
└────┬─────────────┘
     │
     │ 2. Clicks Submit
     │    handleSubmit() called
     ▼
┌────────────────────────────┐
│  Check Authentication      │
│  getSession()              │
└────┬───────────────────────┘
     │
     │ Session found ✅
     │ Get user ID from session
     ▼
┌────────────────────────────┐
│  Prepare API Request       │
│  {                         │
│    query: "...",           │
│    userId: "user-id",      │
│    timestamp: "..."        │
│  }                         │
└────┬───────────────────────┘
     │
     │ 3. POST to backend API
     │    with Authorization header
     ▼
┌────────────────────────────────────┐
│  BACKEND API                       │
│  /api/submit-query                 │
│                                    │
│  1. Verify JWT token               │
│  2. Extract user ID                │
│  3. Validate profile exists        │
└────┬───────────────────────────────┘
     │
     │ 4. Save to database
     ▼
┌────────────────────────────────────┐
│  Supabase                          │
│  INSERT INTO queries               │
│  (user_id, query, timestamp)       │
│                                    │
│  RLS Check: ✅                     │
│  - User authenticated              │
│  - Inserting own data              │
└────┬───────────────────────────────┘
     │
     │ 5. Query saved ✅
     ▼
┌────────────────────────────────────┐
│  Success Response                  │
│  { success: true, id: "..." }      │
└────┬───────────────────────────────┘
     │
     │ 6. Show success message
     │    Redirect to home after 5s
     ▼
┌────────────────┐
│  ✅ Done!      │
│  Query logged  │
│  User notified │
└────────────────┘
```

---

## 🎯 Key Concepts Visualized

### Before Migration (Problems)

```
❌ BEFORE:
┌──────────────┐     ┌──────────────┐
│ auth.users   │  ?  │ public.users │
│ (Supabase)   │  ?  │ (Custom)     │
└──────────────┘     └──────────────┘
       ↕                    ↕
   Separate        Multiple SQL files
   No trigger      Foreign keys broken
   Manual sync     Orphaned users
```

### After Migration (Solution)

```
✅ AFTER:
┌──────────────┐ trigger  ┌──────────────────┐
│ auth.users   │─────────▶│ public.profiles  │
│ (Supabase)   │  auto    │ (Single source)  │
└──────────────┘          └──────────────────┘
                                  ↕
                          All FKs reference
                          Single schema file
                          Auto-sync via trigger
                          No orphaned users
```

---

## 📚 File Relationships

```
PROJECT ROOT
├── DOCUMENTATION (You are here)
│   ├── QUICK_START.md ─────────────┐
│   ├── DATABASE_SETUP_GUIDE.md     │─── Read these first
│   ├── AUTHENTICATION_GUIDE.md     │
│   └── TESTING_GUIDE.md ────────────┘
│
├── TURN2LAW_COMPLETE_SCHEMA.sql ◀─── Run this in Supabase
│
└── frontend/
    └── src/
        ├── lib/
        │   ├── supabase.ts ◀───────────── Supabase client
        │   └── supabase-auth.ts ◀──────── Auth helpers
        │
        └── app/
            ├── signup/page.tsx ◀───────── Uses supabase-auth
            ├── login/page.tsx ◀────────── Uses supabase-auth
            ├── lawgpt/page.tsx ◀───────── Protected (uses auth)
            ├── consult/page.tsx ◀──────── Protected (uses auth)
            └── documents/page.tsx ◀────── Protected (uses auth)
```

---

**This completes the visual documentation!** 🎉

All diagrams show how the system works from different perspectives:
- Architecture
- Authentication flow
- Database relationships
- RLS security
- Data flow
- Migration improvements

For implementation details, see the other documentation files.
