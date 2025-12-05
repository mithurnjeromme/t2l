# ⚡ Quick Deployment Actions Required

## ✅ What's Done:
- ✅ All code committed and pushed to GitHub
- ✅ Backend API ready with service inquiry endpoint
- ✅ All 7 service forms integrated
- ✅ Documentation complete

---

## 🚨 What You Need to Do NOW:

### 1. Get Resend API Key (5 minutes)
**This is CRITICAL - without it, emails won't be sent!**

1. Go to https://resend.com
2. Sign up with your email
3. Create an API key (free tier gives 100 emails/day)
4. Copy the API key (starts with `re_...`)

### 2. Deploy Backend to Render (10 minutes)

1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Web Service"
3. **Connect**: Your GitHub repository
4. **Settings**:
   - Name: `turn2law-backend`
   - Branch: `master`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

5. **Environment Variables** (click "Advanced"):
   ```
   RESEND_API_KEY=re_your_key_from_step_1
   SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnBxdHlpbnVtYW52cGdxbGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTEyOTIsImV4cCI6MjA3MTA2NzI5Mn0.IL4G5wXabjKdpUZGBAdAq5bvm1W6Xvb-zg9ux9uq5LY
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnBxdHlpbnVtYW52cGdxbGJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ5MTI5MiwiZXhwIjoyMDcxMDY3MjkyfQ.5lvDGZcMrE6J6rJtLpjBdZv1V0V2d0OKAkXNzlR7V8E
   NODE_ENV=production
   ```

6. **Click**: "Create Web Service"
7. **Wait**: 5-10 minutes for deployment
8. **Copy**: Your backend URL (e.g., `https://turn2law-backend.onrender.com`)

### 3. Update Frontend API URLs (5 minutes)

**Replace** `http://localhost:3001` with your Render backend URL in these 7 files:

Run this command (replace with your actual backend URL):
```bash
cd "/Users/adhyayandubey/Downloads/Turn2law Website/frontend/src/app/services"

# macOS/Linux
find . -name "page.tsx" -exec sed -i '' 's|http://localhost:3001|https://turn2law-backend.onrender.com|g' {} +

# Or manually edit each file:
# - partnership/page.tsx
# - private-limited/page.tsx
# - opc/page.tsx
# - llp/page.tsx
# - gst-registration/page.tsx
# - gst-return-filing/page.tsx
# - iec/page.tsx
```

Then commit and push:
```bash
cd "/Users/adhyayandubey/Downloads/Turn2law Website"
git add .
git commit -m "fix: Update API URL to production backend"
git push origin master
```

### 4. Deploy Frontend to Vercel (5 minutes)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "Add New..." → "Project"
3. **Import**: Your GitHub repository
4. **Settings**:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
5. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://turn2law-backend.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://vjfpqtyinumanvpgqlbj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnBxdHlpbnVtYW52cGdxbGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTEyOTIsImV4cCI6MjA3MTA2NzI5Mn0.IL4G5wXabjKdpUZGBAdAq5bvm1W6Xvb-zg9ux9uq5LY
   ```
6. **Click**: "Deploy"
7. **Copy**: Your frontend URL (e.g., `https://turn2law.vercel.app`)

### 5. Update Backend CORS (2 minutes)

Edit `backend/src/index.ts` and add your Vercel URL:

```typescript
const allowedOrigins = [
  'https://turn2law.tech',
  'https://www.turn2law.tech',
  'https://turn2law.vercel.app',  // ← Add your Vercel URL here
  'http://localhost:3000',
];
```

Commit and push:
```bash
git add backend/src/index.ts
git commit -m "fix: Add Vercel URL to CORS"
git push origin master
```

Render will auto-redeploy.

### 6. Test Everything (5 minutes)

1. Visit your Vercel URL
2. Go to any service page (e.g., Partnership Firm)
3. Fill out the form
4. Submit
5. Check `turn2law@gmail.com` for the email

---

## 📊 Summary

**Total Time**: ~30 minutes
**Cost**: Free (Resend 100 emails/day, Render free tier, Vercel free tier)

### What Will Happen After Deployment:
- User fills form on your website
- Form data sent to backend on Render
- Backend emails details to `turn2law@gmail.com`
- You receive professional email with customer info
- You reply directly to customer

---

## 🆘 Quick Troubleshooting

**Forms not working?**
- Check browser console for errors
- Verify backend URL is correct in frontend code
- Check CORS includes your Vercel URL

**No emails received?**
- Verify RESEND_API_KEY in Render
- Check spam folder
- Check Resend dashboard for logs

**Backend not responding?**
- Check Render logs
- Wait 60 seconds (free tier spins down after inactivity)
- Hit the /health endpoint: `https://your-backend.onrender.com/health`

---

## 📞 Need Help?

See full details in: `DEPLOYMENT_GUIDE.md`

---

**Status**: Ready to Deploy! 🚀
**All code is pushed to GitHub** ✅
