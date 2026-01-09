#!/bin/bash

# ============================================
# Security Verification Script
# ============================================
# Run this script to verify security measures are in place
# Usage: bash verify-security.sh
# ============================================

echo "🔒 Turn2Law Security Verification"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Frontend .env.local exists
echo "1. Checking frontend environment configuration..."
if [ -f "frontend/.env.local" ]; then
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" "frontend/.env.local" && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" "frontend/.env.local"; then
        echo -e "   ${GREEN}✓${NC} Frontend .env.local configured"
    else
        echo -e "   ${RED}✗${NC} Frontend .env.local missing required variables"
    fi
else
    echo -e "   ${RED}✗${NC} Frontend .env.local not found"
fi

# Check 2: Backend .env exists
echo "2. Checking backend environment configuration..."
if [ -f "backend/.env" ]; then
    if grep -q "SUPABASE_URL" "backend/.env" && grep -q "SUPABASE_ANON_KEY" "backend/.env" && grep -q "SUPABASE_SERVICE_ROLE_KEY" "backend/.env"; then
        echo -e "   ${GREEN}✓${NC} Backend .env configured"
    else
        echo -e "   ${RED}✗${NC} Backend .env missing required variables"
    fi
else
    echo -e "   ${RED}✗${NC} Backend .env not found"
fi

# Check 3: No hardcoded credentials in frontend
echo "3. Checking for hardcoded credentials in frontend..."
if grep -r "vjfpqtyinumanvpgqlbj" frontend/src/ 2>/dev/null | grep -v "node_modules" | grep -q "||"; then
    echo -e "   ${RED}✗${NC} Found hardcoded credentials with fallback values"
else
    echo -e "   ${GREEN}✓${NC} No hardcoded credentials with fallbacks found"
fi

# Check 4: No hardcoded credentials in backend
echo "4. Checking for hardcoded credentials in backend..."
if grep -r "vjfpqtyinumanvpgqlbj" backend/src/ 2>/dev/null | grep -v "node_modules" | grep -q "||"; then
    echo -e "   ${RED}✗${NC} Found hardcoded credentials with fallback values"
else
    echo -e "   ${GREEN}✓${NC} No hardcoded credentials with fallbacks found"
fi

# Check 5: RLS SQL script exists
echo "5. Checking if RLS SQL script exists..."
if [ -f "CRITICAL_SECURITY_FIX.sql" ]; then
    echo -e "   ${GREEN}✓${NC} RLS SQL script found"
    echo -e "   ${YELLOW}⚠${NC}  Have you executed this in Supabase? (You must do this manually)"
else
    echo -e "   ${RED}✗${NC} RLS SQL script not found"
fi

# Check 6: .gitignore configured
echo "6. Checking .gitignore configuration..."
if grep -q ".env" .gitignore; then
    echo -e "   ${GREEN}✓${NC} .gitignore includes .env files"
else
    echo -e "   ${RED}✗${NC} .gitignore missing .env entries"
fi

# Check 7: No .env files in git history (warning)
echo "7. Checking if .env files are tracked by git..."
if git ls-files | grep -q "\.env$\|\.env\.local$"; then
    echo -e "   ${RED}✗${NC} .env files are tracked by git! Run: git rm --cached .env .env.local"
else
    echo -e "   ${GREEN}✓${NC} No .env files tracked by git"
fi

echo ""
echo "=================================="
echo "🔒 Security Verification Complete"
echo "=================================="
echo ""
echo -e "${YELLOW}CRITICAL:${NC} You MUST execute CRITICAL_SECURITY_FIX.sql in Supabase Dashboard!"
echo "Steps:"
echo "  1. Go to https://supabase.com/dashboard"
echo "  2. Open SQL Editor"
echo "  3. Paste contents of CRITICAL_SECURITY_FIX.sql"
echo "  4. Run the query"
echo "  5. Verify RLS is enabled on all tables"
echo ""
echo "After that, restart your servers:"
echo "  cd backend && npm run dev"
echo "  cd frontend && npm run dev"
echo ""
