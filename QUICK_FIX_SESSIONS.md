# 🚀 QUICK FIX - LawGPT Sessions Not Saving

## The Problem
✗ Chat history not saved to database  
✗ Sidebar shows "No chat history yet"  
✗ Sessions disappear on page reload  

## The Solution (2 Minutes)

### 1️⃣ Go to Supabase → SQL Editor → New Query

### 2️⃣ Copy & Paste This SQL:

```sql
CREATE TABLE IF NOT EXISTS lawgpt_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lawgpt_sessions_user_id ON lawgpt_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_lawgpt_sessions_updated_at ON lawgpt_sessions(updated_at DESC);

ALTER TABLE lawgpt_sessions DISABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION update_lawgpt_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lawgpt_sessions_updated_at_trigger ON lawgpt_sessions;
CREATE TRIGGER update_lawgpt_sessions_updated_at_trigger
  BEFORE UPDATE ON lawgpt_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_lawgpt_sessions_updated_at();
```

### 3️⃣ Click "Run" → Wait for "Success"

### 4️⃣ Verify:
```sql
SELECT * FROM lawgpt_sessions;
```
Should show empty table with columns.

### 5️⃣ Test on Frontend:
- Wait for Vercel to finish deploying (check dashboard)
- Go to turn2law.tech/lawgpt
- Send a message
- Open sidebar (☰) → Should see your chat!

## What It Does
✓ Creates database table for chat sessions  
✓ Disables RLS (needed for custom auth)  
✓ Adds indexes for fast queries  
✓ Sets up auto-updating timestamps  

## Debug (After Vercel Deploys)
Open browser console (F12) and look for:
```
[LawGPT] Creating new session with title: ...
[LawGPT] Session created successfully
[LawGPT] Session added to sessions list
```

If you see errors, check the detailed guide in:
`/docs/FIX_LAWGPT_SESSIONS_NOT_SAVING.md`

---

**That's it!** Run the SQL and chat history will work. 🎉
