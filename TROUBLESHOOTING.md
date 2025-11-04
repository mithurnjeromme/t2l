# Troubleshooting Guide - Turn2Law ML Matching

## "Failed to Fetch" Error - SOLVED ✅

### Problem
The frontend was showing "Failed to fetch" error when trying to use the AI-Powered Match feature.

### Root Causes
1. **Backend not running** - The FastAPI backend service was stopped
2. **Missing CORS configuration** - Backend wasn't configured to accept requests from `http://localhost:9002`
3. **Frontend needs restart** - Next.js dev server needs to be restarted after `.env.local` changes

### Solution Applied

#### 1. Updated CORS Configuration
Updated `/backend/ml-service/main.py` to include frontend port:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:9002",  # ✅ Turn2Law frontend
        "http://localhost:9003",  # Alternative port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 2. Started Backend Service
```bash
cd "/Users/adhyayandubey/Downloads/Turn2law Website/backend/ml-service"
python3 main.py &
```

#### 3. Restarted Frontend
```bash
cd "/Users/adhyayandubey/Downloads/Turn2law Website/frontend"
npm run dev
```

### Verification Steps

1. **Check Backend Health**:
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status": "healthy", "model_loaded": true, ...}`

2. **Check Frontend**:
   Open browser at `http://localhost:9002/consult`

3. **Test AI Match**:
   - Click "AI-Powered Match" button
   - Fill in the form
   - Submit and verify matched lawyers appear

### Quick Start Commands

#### Start Backend
```bash
cd backend/ml-service
python3 main.py &
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

#### Check Services
```bash
# Backend
lsof -i :8000

# Frontend
lsof -i :9002
```

### Common Issues

#### Issue: Backend not responding
**Fix**: Restart the backend service
```bash
pkill -9 -f "main.py"
cd backend/ml-service && python3 main.py &
```

#### Issue: Frontend can't connect
**Fix**: Verify `.env.local` and restart Next.js
```bash
# Check .env.local has:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Restart frontend
cd frontend
pkill -9 node
npm run dev
```

#### Issue: CORS errors in browser console
**Fix**: Verify backend CORS includes your frontend URL
- Check `main.py` includes `http://localhost:9002` in `allow_origins`
- Restart backend after changes

### System Status

✅ **Backend**: Running on `http://localhost:8000`
- ML Model: Loaded
- Feature Scaler: Loaded
- Label Encoders: Loaded
- Mock Lawyers: 150 profiles loaded

✅ **Frontend**: Running on `http://localhost:9002`
- API URL: `http://localhost:8000`
- ML Matching: Enabled

✅ **Integration**: Full end-to-end working
- CORS: Configured
- API Endpoints: `/health`, `/api/match`, `/api/lawyers`
- UI Components: SmartMatchModal, Match Results Banner

---

## Success! 🎉

Your Turn2Law ML-powered lawyer matching system is now fully operational!

**Next Steps**:
1. Open `http://localhost:9002/consult`
2. Click "AI-Powered Match"
3. Fill in your requirements
4. See personalized lawyer recommendations with match scores!

For support or questions, check the main documentation:
- `README.md` - Project overview
- `DEMO_GUIDE.md` - Demo walkthrough
- `PROJECT_COMPLETE_SUMMARY.md` - Complete feature list
