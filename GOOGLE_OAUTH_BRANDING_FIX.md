# 🔧 Fix Google OAuth Display Name - Turn2Law Branding

## 📌 Issue
When users sign in with Google, they see:
> "You're signing back in to vjfpqtyinumanvpgqlbj.supabase.co"

Instead of:
> "You're signing back in to Turn2Law"

---

## ✅ Solution: Update Google Cloud Console OAuth Branding

This is a **configuration-only fix** - no code changes needed!

---

## 🎯 Step-by-Step Guide

### **Step 1: Access Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the **Turn2Law** project
3. You should see "Turn2Law" in the project selector at the top

### **Step 2: Navigate to OAuth Branding**
1. In the left sidebar, look for **"Google Auth Platform"** or **"APIs & Services"**
2. Click on **"OAuth consent screen"** OR click on **"Branding"** in the sidebar
3. You should now see the OAuth branding configuration page

### **Step 3: Update App Name (MOST IMPORTANT)**
1. **Scroll to the top** of the Branding page
2. Find the **"App name"** field
3. Current value: `vjfpqtyinumanvpgqlbj.supabase.co` or similar
4. Change it to: **`Turn2Law`**
5. This is the name users will see when signing in with Google

### **Step 4: Update App Information**
Configure these fields:

#### **Required Fields:**
- **App name**: `Turn2Law` ✅
- **User support email**: `dubeykanu02@gmail.com`
- **Developer contact email**: `dubeykanu02@gmail.com`

#### **App Domain (Already Configured):**
- **Application home page**: `https://turn2law.tech` ✅
- **Application privacy policy link**: Leave blank (add later)
- **Application terms of service link**: Leave blank (add later)

#### **Authorized Domains (Already Configured):**
- ✅ `turn2law.com`
- ✅ `vjfpqtyinumanvpgqlbj.supabase.co` (Supabase - keep this!)
- ✅ `turn2law.tech`

**Note:** You don't need to own all these domains. They just need to be registered here for OAuth redirects to work.

### **Step 5: App Logo (Optional)**
1. Click on **"App logo"** upload button
2. Upload a Turn2Law logo (minimum 120x120px)
3. Recommended formats: PNG, JPG
4. This will show up on the Google sign-in screen

### **Step 6: Save Changes**
1. Scroll to the bottom of the page
2. Click **"SAVE"** or **"SAVE AND CONTINUE"**
3. Changes are **immediate** - no waiting period!

### **Step 7: Test the Changes**
1. Go to your website: `https://turn2law.tech`
2. Click **"Sign in with Google"**
3. You should now see: **"Turn2Law wants to access your Google Account"**
4. ✅ Success!

---

## 📸 What Users Will See

### **Before Fix:**
```
You're signing back in to vjfpqtyinumanvpgqlbj.supabase.co
```

### **After Fix:**
```
You're signing back in to Turn2Law
```
with your logo (if uploaded)

---

## 🚨 Common Issues & Solutions

### Issue 1: Can't Find "App name" Field
**Solution:** Scroll to the **very top** of the Branding page. The App name field is usually the first field.

### Issue 2: Changes Not Showing
**Solution:** 
- Clear browser cache
- Try in incognito mode
- Wait 5 minutes and try again
- Make sure you clicked "SAVE"

### Issue 3: "App is in Testing Mode"
**Current Status:** Your app is in testing mode (limited to 100 users)

**To Publish for Production:**
1. Go to OAuth consent screen
2. Click "PUBLISH APP"
3. This removes the 100-user limit
4. Google may review your app (can take a few days)

### Issue 4: Missing Scopes
If you see scope-related errors, make sure these scopes are enabled:
- `userinfo.email`
- `userinfo.profile`
- `openid`

---

## 🔐 Current Configuration

### **Supabase Configuration:**
- **Project URL:** `https://vjfpqtyinumanvpgqlbj.supabase.co`
- **Project ID:** `vjfpqtyinumanvpgqlbj`
- **Region:** Auto-selected by Supabase

### **Custom Domain:**
- **Primary Domain:** `https://turn2law.tech` (active)
- **Vercel Deployment:** Connected via Vercel

### **Google OAuth Client:**
- **Project Name:** Turn2Law (after fix)
- **Authorized Domains:** turn2law.com, turn2law.tech, supabase.co
- **Redirect URIs:** Configured in Supabase

---

## 📋 Quick Reference Checklist

- [ ] Open Google Cloud Console
- [ ] Select Turn2Law project
- [ ] Navigate to Branding section
- [ ] Scroll to top to find "App name" field
- [ ] Change "App name" to `Turn2Law`
- [ ] Update support email to `dubeykanu02@gmail.com`
- [ ] Verify "Application home page" is `https://turn2law.tech`
- [ ] Upload Turn2Law logo (optional)
- [ ] Click "SAVE" at the bottom
- [ ] Test by signing in with Google on turn2law.tech
- [ ] Verify new branding appears

---

## 🎨 Recommended App Logo Specifications

If you want to upload a logo:
- **Minimum Size:** 120x120 pixels
- **Recommended Size:** 512x512 pixels
- **Format:** PNG with transparent background (preferred) or JPG
- **Design:** Simple, recognizable Turn2Law branding
- **Colors:** Match your website color scheme

---

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth Consent Screen Documentation](https://support.google.com/cloud/answer/6158849)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Turn2Law Website](https://turn2law.tech)

---

## 📞 Support

If you encounter issues:
1. Check the Supabase dashboard for auth errors
2. Review Google Cloud Console logs
3. Verify OAuth credentials in Supabase settings
4. Test in incognito mode to rule out caching issues

---

## ✅ Verification Steps

After making changes, verify:
1. ✅ Google sign-in shows "Turn2Law" instead of Supabase URL
2. ✅ Logo appears (if uploaded)
3. ✅ No auth errors in browser console
4. ✅ Users can successfully sign in/up with Google
5. ✅ Redirect works correctly after authentication

---

## 📝 Notes

- **No code changes required** - This is purely a Google Cloud Console configuration
- **Changes are instant** - No deployment needed
- **All existing users** - Will see the new branding immediately
- **Works with Supabase** - No changes needed to Supabase configuration
- **Custom domain** - turn2law.tech remains unchanged

---

**Last Updated:** December 24, 2025  
**Status:** Pending implementation  
**Priority:** High (User Experience)
