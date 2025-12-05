# 🚀 Deployment Guide - Turn2Law Website

## Current Status
✅ **All code is committed and pushed to GitHub (origin/master)**
- Latest commits include service forms integration
- Backend API ready for deployment
- Frontend forms ready for deployment

---

## 📋 Pre-Deployment Checklist

### What You Need:

1. **Resend API Key** (for sending emails)
   - Go to https://resend.com
   - Sign up / Log in
   - Create an API key
   - Verify domain: `send.turn2law.tech` (or use their default domain for testing)

2. **Supabase Credentials** (already in code, but needed for production)
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

3. **Optional: Razorpay Keys** (for payments, if needed later)
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET

---

## 🔧 Backend Deployment (Render)

### Step 1: Deploy to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Create New Web Service**
   - Connect your GitHub repository
   - Select branch: `master`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free (or Starter if you need always-on)

### Step 2: Set Environment Variables in Render

Go to your service's **Environment** tab and add:

```bash
# Required for Service Inquiry Forms
RESEND_API_KEY=re_your_actual_resend_api_key_here

# Required for Supabase
SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnBxdHlpbnVtYW52cGdxbGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTEyOTIsImV4cCI6MjA3MTA2NzI5Mn0.IL4G5wXabjKdpUZGBAdAq5bvm1W6Xvb-zg9ux9uq5LY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnBxdHlpbnVtYW52cGdxbGJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ5MTI5MiwiZXhwIjoyMDcxMDY3MjkyfQ.5lvDGZcMrE6J6rJtLpjBdZv1V0V2d0OKAkXNzlR7V8E

# Production settings
NODE_ENV=production
PORT=3001

# Optional: For future payment integration
# RAZORPAY_KEY_ID=your_key_id
# RAZORPAY_KEY_SECRET=your_key_secret

# Optional: JWT (if using custom auth)
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# JWT_EXPIRE_IN=7d

# Optional: Base URL for file uploads
# BASE_URL=https://your-backend-url.onrender.com
```

### Step 3: Get Your Backend URL
After deployment, Render will give you a URL like:
```
https://turn2law-backend.onrender.com
```
**Save this URL - you'll need it for frontend!**

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update API Endpoint URLs

Before deploying frontend, you need to update the API endpoint in all service pages.

**Replace** `http://localhost:3001` **with your Render backend URL** in these 7 files:

1. `frontend/src/app/services/partnership/page.tsx`
2. `frontend/src/app/services/private-limited/page.tsx`
3. `frontend/src/app/services/opc/page.tsx`
4. `frontend/src/app/services/llp/page.tsx`
5. `frontend/src/app/services/gst-registration/page.tsx`
6. `frontend/src/app/services/gst-return-filing/page.tsx`
7. `frontend/src/app/services/iec/page.tsx`

**Find and replace in each file:**
```typescript
// OLD:
const response = await fetch('http://localhost:3001/api/service-inquiry', {

// NEW:
const response = await fetch('https://turn2law-backend.onrender.com/api/service-inquiry', {
```

**Or better yet, use environment variable:**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-inquiry`, {
```

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import Project**
   - Connect your GitHub repository
   - Select branch: `master`
   - Framework Preset: **Next.js**
   - Root Directory: `frontend`

### Step 3: Set Environment Variables in Vercel

In your Vercel project settings > Environment Variables:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://turn2law-backend.onrender.com

# Supabase (for authentication)
NEXT_PUBLIC_SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnBxdHlpbnVtYW52cGdxbGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTEyOTIsImV4cCI6MjA3MTA2NzI5Mn0.IL4G5wXabjKdpUZGBAdAq5bvm1W6Xvb-zg9ux9uq5LY
```

### Step 4: Deploy
Click **Deploy** and Vercel will build and deploy your frontend.

---

## 🔄 Update Backend CORS

After getting your Vercel frontend URL (e.g., `https://turn2law.vercel.app`), update the backend CORS configuration:

**File**: `backend/src/index.ts`

```typescript
const allowedOrigins = [
  'https://turn2law.tech',
  'https://www.turn2law.tech',
  'https://turn2law.vercel.app',           // Add your Vercel URL
  'https://turn2law-frontend.vercel.app',  // If using custom domain
  'http://localhost:3000',
  'http://localhost:9002',
  'http://localhost:3001'
];
```

Commit and push this change, then Render will auto-redeploy.

---

## ✅ Testing Checklist

### After Deployment:

1. **Test Backend API**:
   ```bash
   curl https://turn2law-backend.onrender.com/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Test Service Forms**:
   - Visit each service page on your production site
   - Fill out and submit a test form
   - Check `turn2law@gmail.com` for the inquiry email
   - Verify reply-to works correctly

3. **Test All Services**:
   - [ ] Partnership Firm form
   - [ ] Private Limited form
   - [ ] OPC form
   - [ ] LLP form
   - [ ] GST Registration form
   - [ ] GST Return Filing form
   - [ ] IEC form

---

## 🔑 Critical Environment Variables Summary

### Backend (Render):
```bash
RESEND_API_KEY=re_xxxxx                    # ⚠️ REQUIRED for emails
SUPABASE_URL=https://...                   # ✅ Already in code
SUPABASE_ANON_KEY=eyJhbGc...               # ✅ Already in code
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...       # ✅ Already in code
NODE_ENV=production                         # ✅ Recommended
```

### Frontend (Vercel):
```bash
NEXT_PUBLIC_API_URL=https://...            # ⚠️ REQUIRED - your backend URL
NEXT_PUBLIC_SUPABASE_URL=https://...       # For auth
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...   # For auth
```

---

## 🚨 Important Notes

### 1. **Resend API Key is CRITICAL**
- Without it, service inquiry emails will NOT be sent
- Get it from: https://resend.com
- Add to Render environment variables

### 2. **Update API URLs in Frontend**
- Must replace `localhost:3001` with production backend URL
- Or use `process.env.NEXT_PUBLIC_API_URL`

### 3. **CORS Configuration**
- Must add Vercel frontend URL to backend CORS
- Otherwise, frontend won't be able to call backend API

### 4. **Render Free Plan**
- Spins down after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- Upgrade to Starter plan ($7/mo) for always-on service

---

## 📝 Quick Commands for Updates

### After making changes:
```bash
# Commit and push
git add .
git commit -m "your message"
git push origin master

# Render and Vercel will auto-deploy from GitHub
```

---

## 🎯 What Happens After Deployment

### User Journey:
1. User visits service page on `turn2law.vercel.app`
2. User fills form and clicks "Submit Application"
3. Frontend sends data to `turn2law-backend.onrender.com/api/service-inquiry`
4. Backend validates data and sends email via Resend
5. Email arrives at `turn2law@gmail.com` with all details
6. You reply to customer directly from email

### Email Contains:
- Service name
- Customer name, email, phone
- Business details (if applicable)
- Selected pricing plan
- Custom message
- Timestamp in IST
- Reply-to set to customer's email

---

## 🆘 Troubleshooting

### Forms not submitting?
- Check browser console for errors
- Verify backend URL is correct in frontend code
- Check CORS is configured with frontend URL

### Emails not received?
- Verify `RESEND_API_KEY` is set in Render
- Check Resend dashboard for email logs
- Verify email address `turn2law@gmail.com` is correct

### Backend not responding?
- Check Render logs for errors
- Verify all environment variables are set
- Test backend health endpoint: `/health`

---

## 📞 Support

If you need help with deployment:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console for JavaScript errors
4. Verify all environment variables are set correctly

---

**Status**: Ready for Deployment 🚀
**Last Updated**: 5 December 2025
