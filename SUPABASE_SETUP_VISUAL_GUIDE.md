# 🎯 QUICK VISUAL GUIDE - Where to Find Everything in Supabase

## 📧 EMAIL: Use `t2lhelpdesksup@gmail.com` ✅

---

## 🔍 STEP-BY-STEP WITH SCREENSHOTS

### 1️⃣ **ENABLE GOOGLE SIGN-IN**

**URL:** https://supabase.com/dashboard/project/vjfpqtyinumanvpgqlbj/auth/providers

**Path in Dashboard:**
```
Left Sidebar → Authentication → Providers → Google
```

**What You'll See:**
```
┌─────────────────────────────────────────────────────┐
│  Providers                                          │
├─────────────────────────────────────────────────────┤
│  ○ Email        [Enabled ✓]                        │
│  ○ Phone        [Disabled]                         │
│  ○ Google       [Click to configure] ◄──── HERE    │
│  ○ GitHub       [Disabled]                         │
└─────────────────────────────────────────────────────┘
```

**What to Fill:**
```
┌──────────────────────────────────────┐
│ Google OAuth Configuration           │
├──────────────────────────────────────┤
│ Enable Google Provider               │
│ [✓] Enabled                          │
│                                      │
│ Client ID (for OAuth)                │
│ [paste from Google Cloud Console]   │
│                                      │
│ Client Secret (for OAuth)            │
│ [paste from Google Cloud Console]   │
│                                      │
│ [Save]                               │
└──────────────────────────────────────┘
```

---

### 2️⃣ **SETUP EMAIL SMTP**

**URL:** https://supabase.com/dashboard/project/vjfpqtyinumanvpgqlbj/settings/auth

**Path in Dashboard:**
```
Left Sidebar → Project Settings (⚙️ gear icon) → Authentication
```

**Scroll Down To:**
```
┌──────────────────────────────────────────────────────┐
│  SMTP Settings                                       │
├──────────────────────────────────────────────────────┤
│  ○ Enable Custom SMTP [Toggle ON] ◄──── TOGGLE THIS │
│                                                      │
│  Host                                                │
│  [smtp.gmail.com                            ]        │
│                                                      │
│  Port                                                │
│  [587                                       ]        │
│                                                      │
│  Username                                            │
│  [t2lhelpdesksup@gmail.com                 ]        │
│                                                      │
│  Password                                            │
│  [xxxx xxxx xxxx xxxx ◄── App Password]    ]        │
│                                                      │
│  Sender Email                                        │
│  [t2lhelpdesksup@gmail.com                 ]        │
│                                                      │
│  Sender Name                                         │
│  [Turn2Law Support                         ]        │
│                                                      │
│  [Save]                                              │
└──────────────────────────────────────────────────────┘
```

**⚠️ IMPORTANT: Get Gmail App Password**
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with `t2lhelpdesksup@gmail.com`
3. Click "Select app" → Choose "Mail"
4. Click "Select device" → Choose "Other"
5. Type "Supabase" and click "Generate"
6. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
7. Paste it in the Password field above

---

### 3️⃣ **CUSTOMIZE EMAIL TEMPLATES**

**URL:** https://supabase.com/dashboard/project/vjfpqtyinumanvpgqlbj/auth/templates

**Path in Dashboard:**
```
Left Sidebar → Authentication → Email Templates
```

**What You'll See:**
```
┌─────────────────────────────────────────┐
│  Email Templates                        │
├─────────────────────────────────────────┤
│  ▼ Confirm signup         [Edit] ◄──┐   │
│  ▼ Invite user            [Edit]    │   │
│  ▼ Magic Link             [Edit] ◄──┤   │
│  ▼ Change Email Address   [Edit]    │   │
│  ▼ Reset Password         [Edit] ◄──┘   │
└─────────────────────────────────────────┘
            Click these to edit
```

**For each template, update:**
- Change sender from "no-reply@..." to show as "Turn2Law Support"
- Add t2lhelpdesksup@gmail.com in footer
- Customize subject line and message

---

### 4️⃣ **ADD REDIRECT URLs** ⭐ THIS IS WHAT YOU WERE LOOKING FOR!

**URL:** https://supabase.com/dashboard/project/vjfpqtyinumanvpgqlbj/auth/url-configuration

**Path in Dashboard:**
```
Left Sidebar → Authentication → URL Configuration ◄── THIS TAB!
```

**What You'll See:**
```
┌─────────────────────────────────────────────────────┐
│  URL Configuration                                  │
├─────────────────────────────────────────────────────┤
│  Site URL                                           │
│  [https://turn2law.com                        ]     │
│                                                     │
│  Redirect URLs                          ◄── HERE!   │
│  [https://turn2law.com/**                     ]     │
│  [http://localhost:3000/**                    ]     │
│  [https://turn2law.com/auth/callback          ]     │
│  [http://localhost:3000/auth/callback         ]     │
│                                                     │
│  [+ Add URL] ◄── Click to add each URL             │
│                                                     │
│  [Save]                                             │
└─────────────────────────────────────────────────────┘
```

**Add these URLs one by one:**
1. Type: `https://turn2law.com/**`
2. Click "+ Add URL"
3. Type: `http://localhost:3000/**`
4. Click "+ Add URL"
5. Type: `https://turn2law.com/auth/callback`
6. Click "+ Add URL"
7. Type: `http://localhost:3000/auth/callback`
8. Click "+ Add URL"
9. Click "Save" button at bottom

---

## ✅ CHECKLIST

Use this to track your progress:

- [ ] **Step 1: Google OAuth**
  - [ ] Get Client ID and Secret from Google Cloud
  - [ ] Enable Google provider in Supabase
  - [ ] Paste credentials
  - [ ] Save

- [ ] **Step 2: Email SMTP**
  - [ ] Get Gmail app password for t2lhelpdesksup@gmail.com
  - [ ] Enable Custom SMTP in Supabase
  - [ ] Enter all SMTP details
  - [ ] Save

- [ ] **Step 3: Email Templates**
  - [ ] Edit "Confirm signup" template
  - [ ] Edit "Magic Link" template
  - [ ] Edit "Reset Password" template
  - [ ] Update footer with t2lhelpdesksup@gmail.com

- [ ] **Step 4: Redirect URLs**
  - [ ] Add https://turn2law.com/**
  - [ ] Add http://localhost:3000/**
  - [ ] Add https://turn2law.com/auth/callback
  - [ ] Add http://localhost:3000/auth/callback
  - [ ] Save

---

## 🆘 STILL CAN'T FIND IT?

### For Redirect URLs:
1. Make sure you're on: https://supabase.com/dashboard/project/vjfpqtyinumanvpgqlbj
2. Look at the left sidebar for **"Authentication"**
3. At the top of the page, you'll see tabs: **Users | Providers | Policies | Templates | URL Configuration | Hooks**
4. Click **"URL Configuration"** tab
5. You'll see "Redirect URLs" section with an input box and "+ Add URL" button

### If you still don't see it:
- Try refreshing the page
- Try logging out and back into Supabase
- Make sure you have the right permissions
- Try a different browser

---

## 📞 QUICK REFERENCE

- **Email to use:** `t2lhelpdesksup@gmail.com`
- **SMTP Host:** `smtp.gmail.com`
- **SMTP Port:** `587`
- **Site URL:** `https://turn2law.com`

**That's it! All your questions answered! 🎉**
