# 📧 Gmail SMTP Setup Guide for Service Inquiry Forms

This guide will help you set up Gmail SMTP to send service inquiry emails to `turn2law@gmail.com`.

## 🎯 Why Gmail SMTP?

- ✅ **No domain verification required**
- ✅ **Free and reliable**
- ✅ **Can send to any email address**
- ✅ **No restrictions on the free tier**
- ✅ **Already used in your contact form**

---

## 📋 Prerequisites

- A Gmail account (use `turn2law@gmail.com` or any Gmail account)
- 2-Factor Authentication enabled on the Gmail account

---

## 🔧 Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Under "Signing in to Google," click **2-Step Verification**
4. Follow the prompts to enable 2FA (use phone verification)

### Step 2: Generate App Password

1. After enabling 2FA, go back to **Security** settings
2. Under "Signing in to Google," click **App passwords**
   - If you don't see this option, make sure 2FA is enabled
3. Click **Select app** → Choose **Mail**
4. Click **Select device** → Choose **Other (Custom name)**
5. Type: `Turn2Law Backend`
6. Click **Generate**
7. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
   - ⚠️ **Important**: Save this password - you won't see it again!

### Step 3: Add to Render Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Add these two environment variables:

```
GMAIL_USER=turn2law@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

> **Note**: Remove spaces from the app password (it should be 16 characters with no spaces)

4. Click **Save Changes**
5. Render will automatically redeploy your backend

### Step 4: Update Local Environment (Optional)

If you want to test locally, update `/backend/.env`:

```bash
GMAIL_USER=turn2law@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

---

## ✅ Verification

After deployment, test a service form:

1. Go to: https://turn2law.vercel.app/services/partnership
2. Fill out and submit the inquiry form
3. Check `turn2law@gmail.com` inbox for the inquiry email
4. You should receive a beautifully formatted email with all the inquiry details

---

## 🔍 Troubleshooting

### Problem: "Invalid login" error

**Solution**: 
- Make sure 2FA is enabled on the Gmail account
- Regenerate the App Password
- Remove any spaces from the app password

### Problem: "Less secure app access" error

**Solution**:
- Don't use "Less secure app access" - use App Passwords instead
- App Passwords are more secure and Google recommends them

### Problem: Emails not being received

**Solution**:
- Check the spam/junk folder in turn2law@gmail.com
- Verify the `GMAIL_USER` variable is set to the correct email
- Check Render logs for any error messages

---

## 📝 Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `GMAIL_USER` | Your Gmail address | `turn2law@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-character app password | `abcdefghijklmnop` |

---

## 🚀 What Changed?

We switched from **Resend** to **Gmail SMTP** because:

1. **Resend free tier restriction**: Can only send to your verified email address
2. **Domain verification required**: To send to other emails, you need to verify a custom domain
3. **Gmail SMTP**: No such restrictions - works immediately after setup

---

## 🎉 Benefits

✅ **All 7 service forms** will now send inquiry emails to `turn2law@gmail.com`
✅ **No domain verification** required
✅ **Free and unlimited** for reasonable use
✅ **Professional looking emails** with HTML formatting
✅ **Same approach** as your existing contact form

---

## 📞 Need Help?

If you encounter any issues:
1. Check Render logs for error messages
2. Verify 2FA is enabled on Gmail
3. Make sure the App Password is correct (16 characters, no spaces)
4. Test sending a test email from Gmail to verify the account is working

---

**Last Updated**: December 5, 2024
