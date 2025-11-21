# 🎯 Quick Reference: Custom OTP Email Verification

## 📍 Where to Find Settings in Supabase

### The Path You Need:
```
Supabase Dashboard (https://supabase.com/dashboard)
    ↓
Your Turn2Law Project
    ↓
Left Sidebar: Authentication (🔑 icon)
    ↓
Settings (⚙️ icon)
    ↓
Email Tab
    ↓
"Confirm email" Toggle → Turn OFF
    ↓
Click Save ✅
```

---

## 🔎 Can't Find "Email Tab"? Try These:

### Path 1: Authentication → Settings → Email
- Most common location
- Look for tabs: General | Email | SMS | Auth Hooks
- Click "Email" tab
- Scroll to find "Confirm email" toggle

### Path 2: Authentication → Providers → Email
- Click "Email" in the providers list
- Click "Configure" or "Edit"
- Find "Confirm email" setting

### Path 3: Project Settings → Authentication
- Some older UI versions have it here
- Look for "Email Provider" section

---

## 🎨 What the Toggle Looks Like

You're looking for one of these names:
- ✓ "Confirm email"
- ✓ "Enable email confirmations"
- ✓ "Require email verification"
- ✓ "Confirm signup"

The toggle will look like:
```
[●───────────] ON  ← Current (needs to be changed)
[─────────●] OFF   ← Target (what we want)
```

---

## 📧 What Happens After

### Before (With Supabase Confirmation ON):
```
User signs up → Gets 2 emails:
1. Supabase: "Click to confirm" (link email) ❌
2. Turn2Law: "Your code is 123456" (OTP) ✓
Result: Confusing! 😕
```

### After (With Supabase Confirmation OFF):
```
User signs up → Gets 1 email:
1. Turn2Law: "Your code is 123456" (OTP) ✓
Result: Clear and simple! 😊
```

---

## 🚨 Quick Troubleshooting

### "I don't see the Email tab"
→ Try: Authentication → Providers → Email → Configure

### "The toggle won't save"
→ Make sure to click the "Save" button at the bottom
→ Refresh page to verify it stayed OFF

### "I only see SMTP settings"
→ Scroll UP on the page, the toggle is usually above SMTP
→ Or check under "Email Provider" section at the top

---

## ✅ How to Verify It Worked

1. **Visual Check:**
   - Go back to Authentication → Settings → Email
   - Toggle should be gray/white (OFF)
   - SMTP settings should still show your Gmail

2. **Test Sign Up:**
   - Create a test account on your site
   - You should receive ONLY 1 email (our OTP)
   - NOT a Supabase confirmation link

3. **Check Backend Logs:**
   - Backend console should show: `[EMAIL] Email sent successfully!`
   - No errors about Supabase email conflicts

---

## 📚 Detailed Guides Available

If you need more help, check these files:

1. **`SUPABASE_DISABLE_EMAIL_CONFIRMATION_GUIDE.md`**
   - Comprehensive step-by-step guide
   - Multiple navigation paths
   - Troubleshooting section

2. **`SUPABASE_EMAIL_VISUAL_GUIDE.md`**
   - Visual ASCII diagrams
   - Exact location screenshots (text-based)
   - What each screen looks like

3. **`CUSTOM_OTP_IMPLEMENTATION_SUMMARY.md`**
   - Complete system overview
   - Setup checklist
   - Testing guide

---

## 🎯 Your Next Steps

1. **Open Supabase Dashboard** ✅
2. **Find the toggle** (use paths above) ✅
3. **Turn it OFF** ✅
4. **Click Save** ✅
5. **Test signup flow** ✅

---

## 💡 Pro Tips

- Use `Ctrl+K` / `Cmd+K` in Supabase to search for "email"
- If stuck, take a screenshot and check the visual guide
- The setting is always in the Authentication section
- It's safe to turn off - our OTP system handles everything

---

## 📞 Still Need Help?

Tell me:
1. What tabs you see under Authentication → Settings
2. Your Supabase version (bottom-left of dashboard)
3. Whether you're on Free/Pro/Team plan

I'll guide you to the exact location! 🚀

---

**Last Updated:** November 21, 2025
**Status:** Ready to configure ✅
