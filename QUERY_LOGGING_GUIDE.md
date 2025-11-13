# 📝 Client Query Logging Guide

## Overview
All client queries submitted through the `/consult` page are automatically logged and saved for admin review.

---

## 🔍 Where to Find Client Queries

### 1. **Terminal/Console Logs**
When the backend is running, all queries are logged to the console in real-time:

```
================================================================================
📥 NEW CLIENT QUERY RECEIVED
Query ID: Q1731456789
Timestamp: 2024-11-13T10:30:00.000Z
Full Query Text:
I need help with a property dispute in Chennai. My neighbor is claiming 
ownership of a portion of my land...
================================================================================
```

### 2. **Log File**
All queries are also saved to a persistent log file:

**Location:** `backend/ml-service/client_queries.log`

This file contains all historical queries with:
- Unique Query ID
- Timestamp
- Full query text
- Separator lines for easy reading

---

## 📊 Query Flow

```
┌─────────────────┐
│  Client enters  │
│  query on       │
│  /consult page  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend sends │
│  POST request   │
│  to backend API │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend logs   │
│  query to:      │
│  1. Console     │
│  2. Log file    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Success        │
│  message shown  │
│  to client      │
└─────────────────┘
```

---

## 🎯 API Endpoint Details

**Endpoint:** `POST /api/submit-query`

**Request Body:**
```json
{
  "query": "Client's full query text",
  "timestamp": "2024-11-13T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Query received successfully. We'll contact you with a suitable lawyer soon.",
  "query_id": "Q1731456789",
  "timestamp": "2024-11-13T10:30:00.000Z"
}
```

---

## 🚀 How to View Queries

### Method 1: Real-Time Console
1. Keep the backend terminal window open
2. Watch for queries as they come in
3. Full query details appear in console

### Method 2: Log File
1. Navigate to: `backend/ml-service/`
2. Open: `client_queries.log`
3. View all historical queries

### Method 3: Tail the Log (Real-time file monitoring)
```bash
cd "backend/ml-service"
tail -f client_queries.log
```

---

## 📁 Mock Lawyer Data

**Note:** The mock lawyer data in `mock_lawyers.json` is ONLY used for the ML matching feature (when you decide to enable lawyer dashboard in the future). 

**Current Setup:**
- ✅ Consult page: Clean query submission (NO mock data used)
- ✅ Queries logged for admin review
- ✅ Mock data available for future lawyer matching feature

**Mock data is NOT displayed on the consult page** - it's kept for backend ML matching when you're ready to enable that feature.

---

## 🎨 Premium UI Features

### New Success Animation Includes:
- ✨ Animated glowing checkmark
- 🌊 Pulsing rings around icon
- 📊 Progress bar with shimmer effect
- 🔄 Smooth redirect indicator
- 💫 Premium typography and gradients

### Input Features:
- 🎯 Glow effect on hover
- 🌈 Gradient border animation
- 💎 Premium backdrop blur
- ⚡ Smooth transitions

---

## 🔒 Next Steps (Optional)

When you're ready to enhance the system:

1. **Database Integration:**
   - Replace file logging with database
   - Store client contact info
   - Track query status

2. **Email Notifications:**
   - Auto-email admin when query received
   - Send confirmation to client

3. **Admin Dashboard:**
   - View all queries
   - Mark as processed
   - Assign to lawyers

---

## ✅ Summary

- All queries are logged to console AND file
- No mock data shown on consult page
- Premium UI/UX for query submission
- Easy to track and review client queries
- Ready for database integration when needed
