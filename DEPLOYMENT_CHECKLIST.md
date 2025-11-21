# 🚀 Deployment Checklist - Custom OTP System

## ✅ What We've Done So Far

### Backend Changes:
- ✅ Installed `nodemailer` package
- ✅ Updated `/backend/src/api/email-otp.ts` with Gmail SMTP
- ✅ Fixed route mounting in `/backend/src/index.ts`
- ✅ Added `GMAIL_APP_PASSWORD` to `.env`

### Frontend Changes:
- ✅ Updated `/frontend/src/app/signup/page.tsx` to send OTP after registration
- ✅ Updated `/frontend/src/app/verify-email-otp/page.tsx` to auto-send OTP
- ✅ Updated `/frontend/src/lib/supabase-auth.ts` to disable default email confirmation
- ✅ Fixed API endpoint paths

---

## 🔧 WHAT YOU NEED TO DO NOW:

### 1. Update Render Backend Environment Variables

#### Go to Render Dashboard:
1. Visit: https://dashboard.render.com
2. Find your **Turn2Law Backend** service
3. Click on it
4. Go to **"Environment"** tab (left sidebar)

#### Add This New Environment Variable:
```
GMAIL_APP_PASSWORD=your-16-character-app-password
```

**Important:** Use the **App Password** from your Gmail account, NOT your regular Gmail password.

---

### 2. Get Gmail App Password (If You Don't Have It)

#### Step-by-Step:
1. Go to: https://myaccount.google.com/security
2. Sign in with **t2lhelpdesksup@gmail.com**
3. Find **"2-Step Verification"** → Turn it ON if not enabled
4. After enabling 2-Step Verification:
   - Go back to: https://myaccount.google.com/apppasswords
   - Click **"Generate"** or **"App passwords"**
   - Select **"Mail"** and **"Other (Custom name)"**
   - Name it: **"Turn2Law OTP System"**
   - Click **"Generate"**
   - Copy the **16-character password** (format: `xxxx xxxx xxxx xxxx`)

5. **Save this password!** You'll only see it once.

---

### 3. Add to Render Environment Variables

In Render Dashboard:

```bash
# Add this new variable:
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # Remove spaces: abcdefghijklmnop

# Make sure these also exist:
SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

### 4. Deploy Backend to Render

#### Option A: Auto-Deploy (If Connected to GitHub)
1. Commit and push your changes:
   ```bash
   cd "/Users/adhyayandubey/Downloads/Turn2law Website"
   git add .
   git commit -m "feat: Add custom OTP email verification system"
   git push origin main
   ```
2. Render will **automatically deploy** (takes 5-10 minutes)
3. Watch the deploy logs in Render dashboard

#### Option B: Manual Deploy
1. In Render Dashboard → Your Backend Service
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Wait for deployment to complete

---

### 5. Deploy Frontend to Vercel

#### Option A: Auto-Deploy (If Connected to GitHub)
After pushing to GitHub, Vercel will automatically deploy.

#### Option B: Manual Deploy
```bash
cd "/Users/adhyayandubey/Downloads/Turn2law Website/frontend"
npm run build
vercel --prod
```

---

### 6. Verify Deployment

#### Check Backend is Running:
```bash
# Test health endpoint
curl https://turn2law-website.onrender.com/health

# Should return: {"status": "ok", ...}
```

#### Check OTP Endpoint:
```bash
# Test OTP endpoint (will fail without user, but should not 404)
curl -X POST https://turn2law-website.onrender.com/api/email-otp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Should return error about user not found (not 404)
```

---

## 📋 Complete Environment Variables Checklist

### Backend (Render):
```bash
# Required for OTP System:
✅ GMAIL_APP_PASSWORD=your-16-char-password

# Already configured:
✅ SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
✅ SUPABASE_ANON_KEY=eyJhbGci...
✅ SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
✅ NODE_ENV=production
✅ PORT=3001
✅ API_BASE_URL=https://turn2law-website.onrender.com
✅ FRONTEND_URL=https://turn2law.tech
```

### Frontend (Vercel):
```bash
# Already configured:
✅ NEXT_PUBLIC_SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
✅ NEXT_PUBLIC_API_URL=https://turn2law-website.onrender.com
```

---

## 🧪 Test the Complete Flow

After deployment, test with a real email:

### 1. Test Signup:
1. Go to: https://turn2law.tech/signup
2. Fill in the form with your email
3. Click "Continue"

### 2. Check Your Email:
You should receive **ONE email** with:
- ✅ Turn2Law branding
- ✅ 6-digit OTP code
- ✅ From: Turn2Law Support (t2lhelpdesksup@gmail.com)

### 3. Verify OTP:
1. You'll be redirected to `/verify-email-otp`
2. Enter the 6-digit code
3. Click "Verify Email"
4. Should redirect to homepage with "Email verified!" message

---

## 🚨 Common Issues & Fixes

### Issue 1: "Failed to send email"
**Cause:** Gmail App Password not set or incorrect
**Fix:** 
1. Double-check the password in Render
2. Make sure 2-Step Verification is enabled on Gmail
3. Regenerate App Password if needed

### Issue 2: "User not found"
**Cause:** Supabase user wasn't created
**Fix:** Check Supabase Auth logs, verify signup worked

### Issue 3: "Invalid OTP"
**Cause:** OTP expired (10 minutes) or wrong code
**Fix:** Request new OTP (Resend button)

### Issue 4: Backend not responding
**Cause:** Render service sleeping (free tier)
**Fix:** 
1. First request wakes it up (30 seconds)
2. Try again after waiting
3. Consider upgrading to paid tier

---

## 📊 Deployment Timeline

```
Step 1: Get Gmail App Password       → 5 minutes
Step 2: Add to Render                → 2 minutes
Step 3: Push to GitHub               → 1 minute
Step 4: Render deploys backend       → 5-10 minutes
Step 5: Vercel deploys frontend      → 2-5 minutes
Step 6: Test signup flow             → 3 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Time: ~20-30 minutes
```

---

## ✅ Final Checklist

Before going live:

- [ ] Gmail App Password generated
- [ ] App Password added to Render environment
- [ ] Backend code pushed to GitHub
- [ ] Frontend code pushed to GitHub
- [ ] Render deployment completed successfully
- [ ] Vercel deployment completed successfully
- [ ] Backend health check passes
- [ ] Test signup with real email works
- [ ] Received OTP email successfully
- [ ] OTP verification works
- [ ] User can log in after verification
- [ ] Google OAuth still works (skips OTP)

---

## 🎯 Quick Commands

### Check if backend is deployed:
```bash
curl https://turn2law-website.onrender.com/health
```

### View backend logs (Render Dashboard):
1. Go to your backend service
2. Click "Logs" tab
3. Look for "[EMAIL] Sending to:" messages

### Test OTP API directly:
```bash
curl -X POST https://turn2law-website.onrender.com/api/email-otp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@gmail.com"}'
```

---

## 💡 Pro Tips

1. **Keep App Password Safe:** Store it in a password manager
2. **Monitor Email Delivery:** Check Gmail SMTP logs if emails don't arrive
3. **Test on Mobile:** Make sure OTP verification works on phones
4. **Backup Plan:** Keep Supabase default emails as fallback initially
5. **Rate Limiting:** Gmail allows 500 emails/day (plenty for now!)

---

## 🆘 Need Help?

If something doesn't work:

1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test each component separately (signup → OTP send → OTP verify)
5. Let me know which step is failing!

---

**Ready to deploy?** Let's start with getting the Gmail App Password! 🚀
