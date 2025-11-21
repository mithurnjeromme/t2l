# 📧 How to Disable Supabase Email Confirmation - Step-by-Step Guide

## 🎯 Why We Need to Do This

Since we're using **custom OTP verification** (our own email system with 6-digit codes), we need to **disable Supabase's default email confirmation** to avoid sending two emails to users.

---

## 📍 Exact Steps to Find the Setting

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Sign in with your account
3. You should see your projects list

### Step 2: Select Your Turn2Law Project
1. Click on your **Turn2Law project** (the one named `vjfpqtyinumanvpgqlbj` or whatever you named it)
2. Wait for the project dashboard to load

### Step 3: Navigate to Authentication Settings
1. Look at the **left sidebar**
2. Find and click on **"Authentication"** (it has a key/lock icon 🔑)
3. A submenu will appear under Authentication

### Step 4: Go to Settings
1. In the Authentication submenu, click on **"Settings"**
2. You'll see several tabs at the top

### Step 5: Find Email Settings
1. Click on the **"Email"** tab (or might be called "Email Auth")
2. Scroll down to find **"Email Settings"** section

### Step 6: Disable Email Confirmations
1. Look for a section called **"Email Confirmations"** or **"Confirm email"**
2. You'll see a toggle switch that says:
   - **"Confirm email"** or
   - **"Enable email confirmations"** or
   - **"Confirm signup"**
3. **Toggle it OFF** (should turn gray/white)
4. Click **"Save"** button at the bottom

---

## 🖼️ Visual Navigation Path

```
Supabase Dashboard
    │
    ├─ [Your Turn2Law Project]
    │       │
    │       └─ Left Sidebar
    │              │
    │              ├─ 🔑 Authentication
    │              │       │
    │              │       ├─ Users
    │              │       ├─ Policies
    │              │       └─ ⚙️ Settings ← CLICK HERE
    │              │              │
    │              │              ├─ General
    │              │              ├─ 📧 Email ← CLICK HERE
    │              │              │     │
    │              │              │     ├── Email Templates
    │              │              │     └── Email Settings
    │              │              │           │
    │              │              │           └─ [✓] Confirm email ← TOGGLE OFF
    │              │              │
    │              │              ├─ Phone
    │              │              └─ External OAuth Providers
```

---

## 🔍 Alternative: If You Can't Find It

### Option A: Check Under "Providers" Tab
Some Supabase versions have it under:
1. **Authentication** → **Providers**
2. Click on **"Email"** provider
3. Look for **"Confirm email"** toggle
4. Turn it **OFF**

### Option B: Check Auth Configuration
1. **Authentication** → **Configuration**
2. Look for **"Email Confirmations"** section
3. Disable the toggle

### Option C: Check Under "URL Configuration"
1. **Authentication** → **Settings** → **General**
2. Scroll to **"Email Auth"** section
3. Find **"Confirm email"** toggle

---

## 🎯 What the Setting Looks Like

You're looking for something that looks like this:

```
┌─────────────────────────────────────────┐
│  Email Settings                          │
├─────────────────────────────────────────┤
│                                          │
│  ┌─────────────────────────────────┐   │
│  │  Confirm email                   │   │
│  │  Require users to confirm their  │   │
│  │  email address before logging in │   │
│  │                                   │   │
│  │  [●─────────] OFF                │   │  ← Toggle this OFF
│  └─────────────────────────────────┘   │
│                                          │
│  SMTP Settings                           │
│  └─ Already configured with Gmail ✓     │
│                                          │
└─────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

### What Happens When You Disable It:
- ✅ Supabase **stops sending** default confirmation emails
- ✅ Our **custom OTP system** takes over
- ✅ Users get **beautiful branded** OTP emails instead
- ✅ Google OAuth users **skip verification** entirely

### What Stays Enabled:
- ✅ Password reset emails (different system)
- ✅ Magic link emails (if you use them)
- ✅ Your custom SMTP settings for our OTP

---

## 🚨 Can't Find the Toggle?

### Check Your Supabase Plan:
Some features may be located differently based on your plan. If you're on the **free tier**, it might be under:

1. **Project Settings** → **Authentication**
2. Look for **"Email Provider"** section
3. Click **"Configure"** next to Email
4. Find **"Confirm email"** toggle

### Still Can't Find It?

Let me check your exact Supabase setup. Can you tell me:
1. What tabs do you see under **Authentication → Settings**?
2. Take a screenshot of your Authentication menu
3. Check your Supabase version (shown in bottom-left of dashboard)

---

## 🧪 How to Verify It's Disabled

### Test Method 1: Check Settings
1. After toggling OFF, refresh the page
2. Go back to **Authentication → Settings → Email**
3. Verify the toggle is still **OFF**

### Test Method 2: Create a Test Account
```bash
# This will NOT send a Supabase email anymore
1. Go to your signup page
2. Create a test account
3. You should ONLY receive:
   - Our custom OTP email (with 6-digit code)
   - NOT a Supabase confirmation link email
```

---

## 📞 Need More Help?

If you still can't find it:

### Option 1: Send Me Your Dashboard View
Take a screenshot of:
- Your Supabase left sidebar
- The Authentication section
- Any tabs you see under Settings

### Option 2: Check Supabase Docs
Visit: https://supabase.com/docs/guides/auth/auth-email
Look for "Email confirmation" settings

### Option 3: Use Supabase CLI
```bash
# If you have Supabase CLI installed
supabase status
# Check your auth configuration
```

---

## 🎯 Expected Result

Once disabled, your auth flow will be:

```
┌──────────────────────────────────────────┐
│                                           │
│  BEFORE (Supabase default):              │
│  ✉️  Signup → Supabase sends link email  │
│                                           │
│  AFTER (Our custom OTP):                 │
│  ✉️  Signup → We send OTP email          │
│  🔢 User enters 6-digit code              │
│  ✅ Verified!                             │
│                                           │
└──────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Logged into Supabase Dashboard
- [ ] Found Turn2Law project
- [ ] Opened Authentication section
- [ ] Clicked Settings
- [ ] Found Email tab/section
- [ ] Located "Confirm email" toggle
- [ ] Toggled it OFF (gray/white)
- [ ] Clicked Save
- [ ] Refreshed page to verify
- [ ] Toggle is still OFF ✓

---

## 🎯 BASED ON YOUR SCREENSHOTS - FOLLOW THESE EXACT STEPS:

### ✅ You Are Currently Here:
Looking at your screenshots, you are at:
**Authentication → Email → Templates tab**

### 📍 NEXT STEPS FROM YOUR CURRENT POSITION:

#### Step 1: Click "Confirm sign up"
In the screenshot, you can see several email template options:
- ✅ **"Confirm sign up"** ← Click this one!
- Invite user
- Magic link
- Change email address
- Reset password
- Reauthentication

Click on **"Confirm sign up"** (the first option in the Authentication section)

#### Step 2: You'll See a Toggle Switch
After clicking "Confirm sign up", you should see a page with:
- A toggle switch at the top that says **"Enable confirmations"** or **"Confirm email"**
- This toggle should be **ON** (green/blue) currently
- **Turn it OFF** (it will become gray)

#### Step 3: Alternative Location
If you don't see a toggle in "Confirm sign up", try this:
1. Look at the top tabs: **"Templates"** and **"SMTP Settings"**
2. You might need to check if there's a **3rd tab** or scroll down
3. OR go back and click on **SMTP Settings** tab
4. Look for a section called **"Email Confirmations"** or **"Auth Settings"**

---

## 🔍 EXACT LOCATION BASED ON YOUR SUPABASE VERSION:

### For Newer Supabase Dashboards (like yours):
The setting might be in **one of these 3 places**:

#### Location 1: Inside "Confirm sign up" Template
```
Authentication → Email → Templates → Confirm sign up
    ↓
    Look for: [Toggle] "Enable confirmations"
    Turn it: OFF
```

#### Location 2: Under a separate "Settings" section
```
Authentication → Email
    ↓
    Scroll down below the Templates list
    Look for: Email Authentication Settings
    Toggle: "Confirm email" OFF
```

#### Location 3: Under Providers
```
Authentication → Providers (in left sidebar)
    ↓
    Click: Email provider
    Toggle: "Confirm email" OFF
```

---

## 🎬 WHAT TO DO RIGHT NOW:

### ACTION PLAN:
1. ✅ You're currently at: **Authentication → Email → Templates** ✓
2. ⏭️ **Click on "Confirm sign up"** (first option in Authentication section)
3. 👀 Look for a toggle switch that says "Enable" or "Confirm email"
4. 🔄 Turn it OFF
5. 💾 Click Save

---

## 💡 IF YOU DON'T SEE A TOGGLE:

### Alternative: Disable via Template Content
If the "Confirm sign up" page doesn't have a toggle, try this workaround:

1. Stay on the "Confirm sign up" template page
2. Look for an **"Enable"** or **"Active"** checkbox
3. OR check if there's a dropdown that says "Status: Active" → change to "Disabled"
4. OR look at the **top-right corner** for a toggle switch

---

## 🚨 IMPORTANT WORKAROUND:

### If You Cannot Find the Toggle Anywhere:

Don't worry! We can work around this by using **autoConfirm** in our code. The custom OTP will still work, but users might see a "Please confirm your email" message until they verify via OTP.

**Our custom OTP backend already handles this** by manually confirming the email when they enter the correct code!

---

## 📸 NEXT STEPS FOR YOU:

Please do one of these:

### Option A: Click "Confirm sign up" and take a screenshot
1. Click on **"Confirm sign up"** (first item)
2. Take a screenshot of what you see
3. Send it to me so I can guide you to the exact toggle

### Option B: Try "Providers" in Left Sidebar
1. Look at the **left sidebar** under Authentication
2. Find **"Sign In / Providers"** or just **"Providers"**
3. Click on the **"Email"** provider
4. Look for "Confirm email" toggle
5. Take a screenshot

### Option C: Check if it's already disabled
Our system might work perfectly even if the toggle exists! Let's test it:
1. I'll help you run a test signup
2. We'll see if you receive 2 emails (bad) or just 1 OTP email (good)

---

**Which option would you like to try first?** Let me know what you see when you click "Confirm sign up"! 🚀
