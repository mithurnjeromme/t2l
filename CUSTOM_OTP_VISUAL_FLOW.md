# 🎨 Custom OTP Email Verification - Visual Flow

## 📊 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Turn2Law Authentication System                   │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  USER SIGNUP FLOW                                                        │
│                                                                           │
│  Step 1: User Chooses Signup Method                                     │
│  ┌──────────────────────────────────────┐                               │
│  │  Signup Page                         │                               │
│  │  /signup                             │                               │
│  │                                      │                               │
│  │  [  Manual Signup  ]  [  Google  ]  │                               │
│  └──────────┬───────────────────┬───────┘                               │
│             │                    │                                       │
│             ▼                    ▼                                       │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐         ┌──────────────────────────┐
│  MANUAL SIGNUP FLOW     │         │  GOOGLE OAUTH FLOW       │
│  (Custom OTP)           │         │  (Skip OTP)              │
└─────────────────────────┘         └──────────────────────────┘

┌────────────────────────┐          ┌────────────────────────┐
│ 1. Fill Signup Form    │          │ 1. Click Google Button │
│    • Name              │          │                        │
│    • Email             │          │                        │
│    • Password          │          │                        │
│    • Phone             │          │                        │
│    • City (optional)   │          │                        │
└──────────┬─────────────┘          └──────────┬─────────────┘
           │                                    │
           ▼                                    ▼
┌────────────────────────┐          ┌────────────────────────┐
│ 2. Create Supabase     │          │ 2. Google OAuth Popup  │
│    Auth Account        │          │    • User authenticates│
│    • user_id generated │          │    • Email verified ✓  │
│    • Email NOT         │          │                        │
│      confirmed yet     │          │                        │
└──────────┬─────────────┘          └──────────┬─────────────┘
           │                                    │
           ▼                                    │
┌────────────────────────┐                    │
│ 3. Create Profile      │                    │
│    • client_profiles OR│                    │
│    • lawyer_profiles   │                    │
│      (with extra data) │                    │
└──────────┬─────────────┘                    │
           │                                    │
           ▼                                    │
┌────────────────────────┐                    │
│ 4. Call Backend API    │                    │
│    POST /api/email-otp/│                    │
│         send-otp       │                    │
│    • Generate OTP      │                    │
│    • Store in memory   │                    │
│    • Send via Gmail    │                    │
└──────────┬─────────────┘                    │
           │                                    │
           ▼                                    │
┌────────────────────────┐                    │
│ 5. Redirect to         │                    │
│    /verify-email-otp   │                    │
│    ?email=user@ex.com  │                    │
└──────────┬─────────────┘                    │
           │                                    │
           ▼                                    │
┌────────────────────────┐                    │
│ 6. User Checks Email   │                    │
│    ┌─────────────────┐ │                    │
│    │ 📧 Gmail Inbox  │ │                    │
│    │                 │ │                    │
│    │ From: Turn2Law  │ │                    │
│    │ Subject: Verify │ │                    │
│    │                 │ │                    │
│    │ Your Code:      │ │                    │
│    │   123456        │ │                    │
│    └─────────────────┘ │                    │
└──────────┬─────────────┘                    │
           │                                    │
           ▼                                    │
┌────────────────────────┐                    │
│ 7. Enter OTP (6 digits)│                    │
│    [1][2][3][4][5][6]  │                    │
│                        │                    │
│    [  Verify Email  ]  │                    │
└──────────┬─────────────┘                    │
           │                                    │
           ▼                                    │
┌────────────────────────┐                    │
│ 8. Call Backend API    │                    │
│    POST /api/email-otp/│                    │
│         verify-otp     │                    │
│    • Validate OTP      │                    │
│    • Check expiry      │                    │
│    • Update Supabase   │                    │
│      email_confirm=true│                    │
└──────────┬─────────────┘                    │
           │                                    │
           ▼                                    ▼
┌─────────────────────────────────────────────────┐
│ 9. Success! Redirect to Homepage/Dashboard     │
│    • User is authenticated ✓                   │
│    • Email is verified ✓                       │
│    • Profile is complete ✓                     │
└─────────────────────────────────────────────────┘
```

---

## 🔄 OTP Resend Flow

```
User on /verify-email-otp page
         │
         │ OTP expired or lost?
         │
         ▼
┌──────────────────────┐
│ Click "Resend Code"  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐     ┌────────────────┐
│ Check cooldown       │────→│ < 60 seconds?  │──→ Show countdown
│ (60 seconds)         │     └────────────────┘
└──────────┬───────────┘
           │ ✓ Can resend
           ▼
┌──────────────────────┐
│ Generate new OTP     │
│ Invalidate old OTP   │
│ Send new email       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ User enters new OTP  │
└──────────────────────┘
```

---

## 🔐 Security Layer

```
┌─────────────────────────────────────────────────────────┐
│                   Security Checks                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. OTP Generation                                       │
│     • crypto.randomInt(100000, 999999)                  │
│     • 6 digits, no patterns                             │
│                                                          │
│  2. Expiration                                           │
│     • Valid for 10 minutes only                         │
│     • Auto-delete after expiry                          │
│                                                          │
│  3. Rate Limiting                                        │
│     • Max 5 verification attempts per OTP               │
│     • 60-second cooldown between resends                │
│     • 9-minute minimum between new OTPs                 │
│                                                          │
│  4. Storage                                              │
│     • In-memory Map (fast, auto-cleanup)                │
│     • Production: Use Redis for scalability             │
│                                                          │
│  5. Email Validation                                     │
│     • Regex check on email format                       │
│     • Check if user exists in Supabase                  │
│     • Verify not already confirmed                      │
│                                                          │
│  6. Google OAuth Bypass                                  │
│     • OAuth users skip OTP entirely                     │
│     • Email already verified by Google                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📧 Email Delivery Flow

```
Backend sends OTP
        │
        ▼
┌──────────────────┐
│ Nodemailer SMTP  │
│ Config:          │
│ • Host: smtp.    │
│   gmail.com      │
│ • Port: 587      │
│ • From: t2l      │
│   helpdesksup@   │
│   gmail.com      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Google Gmail     │
│ SMTP Server      │
│ • Authenticates  │
│ • Queues email   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User's Email     │
│ Provider         │
│ (Gmail, Yahoo,   │
│  Outlook, etc.)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User's Inbox 📬  │
│ • Branded email  │
│ • Turn2Law logo  │
│ • 6-digit OTP    │
│ • 10 min timer   │
└──────────────────┘
```

---

## 🗄️ Database Schema

```
┌──────────────────────────────────────────────────────────┐
│                    Supabase Auth                          │
│                  (auth.users table)                       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  User Record:                                             │
│  ┌────────────────────────────────────────────┐          │
│  │ id: uuid (primary key)                     │          │
│  │ email: string                               │          │
│  │ encrypted_password: string                  │          │
│  │ email_confirmed_at: timestamp | NULL       │←─────┐   │
│  │ created_at: timestamp                       │      │   │
│  │ app_metadata: json                          │      │   │
│  │   {                                         │      │   │
│  │     provider: 'email' | 'google',          │      │   │
│  │     providers: ['email'] | ['google']      │      │   │
│  │   }                                         │      │   │
│  │ user_metadata: json                         │      │   │
│  │   {                                         │      │   │
│  │     full_name: string,                     │      │   │
│  │     user_type: 'client' | 'lawyer',       │      │   │
│  │     phone: string,                         │      │   │
│  │     city: string                           │      │   │
│  │   }                                         │      │   │
│  └────────────────────────────────────────────┘      │   │
│                                                       │   │
└───────────────────────────────────────────────────────┼───┘
                                                        │
                     ┌──────────────────────────────────┘
                     │ OTP verification updates this field
                     │
┌────────────────────▼─────────────────────────────────┐
│              Backend Memory Store                     │
│              (otpStore: Map)                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Key: user@example.com                               │
│  Value: {                                            │
│    otp: "123456",                                    │
│    expiresAt: 1700000000000,                        │
│    attempts: 0                                       │
│  }                                                    │
│                                                       │
│  Auto-cleanup on:                                    │
│  • Successful verification                           │
│  • Expiration (10 minutes)                          │
│  • Too many failed attempts (5)                     │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 Error Handling Flow

```
User Action → Backend Validation → Response
     │              │                  │
     │              ▼                  │
     │     ┌─────────────────┐        │
     │     │ Validation      │        │
     │     │ Checks:         │        │
     │     │ • Email format  │        │
     │     │ • User exists   │        │
     │     │ • Not verified  │        │
     │     │ • Not Google    │        │
     │     └────────┬────────┘        │
     │              │                  │
     │     ┌────────▼────────┐        │
     │     │ All checks pass?│        │
     │     └────────┬────────┘        │
     │              │                  │
     │         ┌────┴────┐            │
     │         │         │            │
     │        NO        YES           │
     │         │         │            │
     │         ▼         ▼            │
     │  ┌──────────┐ ┌────────┐      │
     │  │  Error   │ │Success │      │
     └─→│ Response │ │Response│←─────┘
        │  400/404 │ │  200   │
        │  500     │ │        │
        └──────────┘ └────────┘

Common Errors:
• 400: Invalid email format
• 404: User not found
• 400: Email already verified
• 400: Google user (no OTP needed)
• 400: OTP expired
• 400: Invalid OTP
• 429: Too many attempts
• 500: Server/email error
```

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION STACK                       │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                          │
│  Frontend (Vercel)                                       │
│  https://turn2law.tech                                   │
│  ┌────────────────────────────────────────────┐         │
│  │ Next.js App                                 │         │
│  │ • /signup page                             │         │
│  │ • /verify-email-otp page                   │         │
│  │ • /login page                              │         │
│  └────────────────┬───────────────────────────┘         │
│                   │                                      │
└───────────────────┼──────────────────────────────────────┘
                    │
                    │ HTTPS API Calls
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  Backend (Render.com)                                    │
│  https://turn2law-website.onrender.com                   │
│  ┌────────────────────────────────────────────┐         │
│  │ Express Server (Node.js + TypeScript)      │         │
│  │ • POST /api/email-otp/send-otp             │         │
│  │ • POST /api/email-otp/verify-otp           │         │
│  │ • POST /api/email-otp/resend-otp           │         │
│  │                                             │         │
│  │ Environment Variables:                     │         │
│  │ • GMAIL_APP_PASSWORD ✓                     │         │
│  │ • SUPABASE_SERVICE_ROLE_KEY ✓              │         │
│  └────────┬──────────────────┬────────────────┘         │
│           │                  │                           │
└───────────┼──────────────────┼───────────────────────────┘
            │                  │
            │                  │
     ┌──────▼──────┐    ┌─────▼──────┐
     │             │    │            │
     │  Gmail SMTP │    │  Supabase  │
     │  Server     │    │  Auth      │
     │             │    │  Database  │
     │  Sends OTP  │    │  Users DB  │
     │  via email  │    │            │
     └─────────────┘    └────────────┘
```

---

## 📱 User Experience Flow

```
Mobile/Desktop View:
┌─────────────────────────────────────┐
│  Turn2Law - Sign Up                 │
├─────────────────────────────────────┤
│                                     │
│  Name:     [________________]       │
│  Email:    [________________]       │
│  Password: [________________]       │
│  Phone:    [________________]       │
│  City:     [________________]       │
│                                     │
│  [ Sign up as User ] [Lawyer]       │
│                                     │
│  [      Continue      ]             │
│                                     │
│  ──────── Or sign up with ────────  │
│                                     │
│  [  🔵  Sign in with Google  ]     │
│                                     │
│  Already have account? Login        │
└─────────────────────────────────────┘
          │
          ▼ (after signup)
┌─────────────────────────────────────┐
│  Turn2Law - Verify Email            │
├─────────────────────────────────────┤
│           📧                         │
│                                     │
│     Verify Your Email Address       │
│                                     │
│  Enter the 6-digit code sent to:   │
│       user@example.com              │
│                                     │
│   [1] [2] [3] [4] [5] [6]          │
│                                     │
│  [    Verify Email    ]             │
│                                     │
│  [    Resend Code     ]             │
│   (Available in 60s)                │
│                                     │
│  ⚠️ Important:                      │
│  • Code valid for 10 minutes        │
│  • Check spam folder                │
│  • Don't share this code            │
│                                     │
│  Use Different Account?             │
└─────────────────────────────────────┘
```

---

## 🎨 Color Scheme

```
Brand Colors Used:
┌──────────────────────────────────┐
│ Primary Gold:   #DF9C49          │
│ Dark Gold:      #AE7739          │
│ Background:     Light/Dark mode  │
│ Text:           Foreground color │
│ Borders:        Border color     │
└──────────────────────────────────┘

Email Template:
• Header: Turn2Law gold logo
• OTP Box: Gold gradient background
• Buttons: Primary gold color
• Links: Gold with hover effect
```

---

**Created:** November 21, 2025  
**Status:** ✅ Ready for Production
