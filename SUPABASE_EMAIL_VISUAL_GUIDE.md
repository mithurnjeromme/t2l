# 🖼️ Supabase Email Confirmation - Visual Click Guide

## Where to Click - Step by Step

### 🔴 Step 1: Supabase Dashboard Homepage
```
┌─────────────────────────────────────────────────────────────┐
│  Supabase                                    [Profile] [?]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Your Organizations                                           │
│  ┌─────────────────────────────────────────────────┐        │
│  │  All Projects                                    │        │
│  │                                                   │        │
│  │  ┌──────────────────────────────┐               │        │
│  │  │ 🟢 Turn2Law                   │  ← CLICK     │        │
│  │  │ vjfpqtyinumanvpgqlbj         │     HERE     │        │
│  │  │ Active • Free Plan            │               │        │
│  │  └──────────────────────────────┘               │        │
│  │                                                   │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

### 🔴 Step 2: Project Dashboard - Left Sidebar
```
┌──────────────────────┬──────────────────────────────────────┐
│ [Turn2Law Logo]      │  Project Overview                     │
│                      │                                        │
│ 📊 Home              │  Quick Stats...                        │
│ 🗄️  Table Editor     │                                        │
│ 📝 SQL Editor        │                                        │
│                      │                                        │
│ 🔑 Authentication ◄──┼─── CLICK HERE FIRST                   │
│   └─ Users           │                                        │
│   └─ Policies        │                                        │
│   └─ Providers       │                                        │
│   └─ ⚙️ Settings  ◄──┼─── THEN CLICK HERE                    │
│                      │                                        │
│ 🗂️  Storage          │                                        │
│ 📨 Edge Functions    │                                        │
│ 🔌 Database          │                                        │
│                      │                                        │
└──────────────────────┴──────────────────────────────────────┘
```

---

### 🔴 Step 3: Authentication Settings Page
```
┌─────────────────────────────────────────────────────────────┐
│  Authentication > Settings                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Tabs:                                                        │
│  ┌─────────┬───────┬──────────┬──────────┬────────┐        │
│  │ General │ Email │ SMS Auth │ Auth     │ Hooks  │        │
│  │         │   ◄───┼──────────┼──────────┼────────┤        │
│  └─────────┴───────┴──────────┴──────────┴────────┘        │
│            ↑                                                  │
│         CLICK HERE (Email Tab)                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 🔴 Step 4: Email Settings Tab (What You'll See)
```
┌─────────────────────────────────────────────────────────────┐
│  Authentication > Settings > Email                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email Provider                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  [✓] Enable email provider                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email Settings                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  Confirm email                              │   │   │
│  │  │  Require users to confirm their email       │   │   │
│  │  │  address before logging in                  │   │   │
│  │  │                                              │   │   │
│  │  │  [●───────────] ON   ◄── TURN THIS OFF!    │   │   │
│  │  │   ↑                                          │   │   │
│  │  │   CLICK THIS TOGGLE                         │   │   │
│  │  │                                              │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │  Double confirm email changes                       │   │
│  │  [─────────●] OFF                                   │   │
│  │                                                      │   │
│  │  Secure email change                                │   │
│  │  [─────────●] OFF                                   │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SMTP Settings                                       │   │
│  │  ✓ Custom SMTP configured                           │   │
│  │  Host: smtp.gmail.com                               │   │
│  │  Port: 587                                           │   │
│  │  Sender: t2lhelpdesksup@gmail.com                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email Templates                                     │   │
│  │  > Confirm signup                                    │   │
│  │  > Invite user                                       │   │
│  │  > Magic Link                                        │   │
│  │  > Change Email Address                              │   │
│  │  > Reset Password                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│                                    [Save] ◄── CLICK SAVE!    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 🔴 Step 5: After Toggling OFF (Should Look Like This)
```
┌─────────────────────────────────────────────────────────────┐
│  Email Settings                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Confirm email                                      │   │
│  │  Require users to confirm their email               │   │
│  │  address before logging in                          │   │
│  │                                                      │   │
│  │  [─────────●] OFF  ✓ CORRECT!                      │   │
│  │                     ↑                                │   │
│  │                  Should be gray/white now           │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [Save] ◄── Don't forget to click Save!                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 What Each Toggle Means

### ✅ Confirm email: **OFF** (What we want)
- Supabase will NOT send confirmation emails
- Our custom OTP system handles verification
- Users won't receive duplicate emails

### ⚠️ If Left ON (Default)
- Users receive 2 emails:
  1. Supabase confirmation link ❌
  2. Our custom OTP code ✅
- This is confusing for users!

---

## 🔍 Alternative Locations (If Not Found Above)

### Location 2: Under "Providers"
```
Authentication → Providers → Email → [Configure]
    └─ Find "Confirm email" toggle here
```

### Location 3: Under "Configuration" 
```
Authentication → Configuration → Email Auth
    └─ Look for email confirmation settings
```

### Location 4: Project Settings
```
Settings → Authentication → Email Provider → [Edit]
    └─ Check for confirmation toggle
```

---

## 🧪 How to Test It's Working

### Before Disabling:
```
User signs up
    ↓
Receives 2 emails:
    1. Supabase: "Confirm your email" (with link)
    2. Turn2Law: "Your OTP is 123456"
    ↓
Confused! 😕
```

### After Disabling:
```
User signs up
    ↓
Receives 1 email:
    1. Turn2Law: "Your OTP is 123456" ✓
    ↓
Clear and simple! 😊
```

---

## 🚨 Common Issues

### Issue 1: "I don't see the Email tab"
**Solution:** You might be on an older Supabase UI. Try:
- Go to **Authentication → Providers**
- Click on **"Email"** in the list
- Look for settings there

### Issue 2: "The toggle doesn't save"
**Solution:** 
- Make sure you click **"Save"** button
- Refresh the page to verify
- Check if you have proper permissions

### Issue 3: "I only see SMTP settings"
**Solution:**
- Scroll down on the Email page
- The toggle is usually ABOVE the SMTP settings
- Or check under "Email Provider" section

---

## 📸 What to Look For

The setting you're looking for will have text similar to:

✓ **"Confirm email"**
✓ **"Enable email confirmations"**  
✓ **"Require email verification"**
✓ **"Confirm signup"**
✓ **"Verify email address"**

All of these mean the same thing - turn them **OFF**!

---

## ✅ Success Checklist

After completing these steps, verify:

- [ ] Toggle is showing **OFF** (gray/white)
- [ ] You clicked **"Save"** button
- [ ] Page refresh shows toggle still **OFF**
- [ ] SMTP settings still show your Gmail config
- [ ] Test signup sends only OTP email (not Supabase link)

---

## 🎯 Need More Help?

If you still can't find it, please:

1. **Tell me what you see:**
   - What tabs appear under Authentication → Settings?
   - Do you see: General, Email, SMS, etc.?

2. **Check your Supabase version:**
   - Look at bottom-left of dashboard
   - Tell me the version number

3. **Try the search:**
   - Press `Ctrl+K` or `Cmd+K` in Supabase
   - Search for "email confirmation"
   - Click on the result

---

**Still stuck? Share a screenshot of your Authentication → Settings page and I'll point you to the exact location!** 📸
