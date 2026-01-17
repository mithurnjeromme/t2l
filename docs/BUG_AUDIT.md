# 🔍 Turn2Law - Comprehensive Bug & Issue Audit

> **Date:** January 17, 2026  
> **Reviewed By:** Code Audit  
> **Status:** Ready for Notion  

---

## 📊 Summary

| Category | Critical | Medium | Minor | Total |
|----------|----------|--------|-------|-------|
| Security | 4 | 3 | 1 | 8 |
| Bugs | 5 | 7 | 4 | 16 |
| UX Issues | 2 | 6 | 3 | 11 |
| Code Quality | 0 | 5 | 12 | 17 |
| **Total** | **11** | **21** | **20** | **52** |

---

## 🔴 CRITICAL ISSUES

### 1. [SECURITY] In-Memory Service Tracking Store - Data Loss on Restart
**File:** `backend/src/store/service-tracking.store.ts`
```typescript
const serviceTrackingStore = new Map<string, ServiceTracking>();
```
**Issue:** All service tracking data is stored in-memory and will be **lost on server restart**.  
**Impact:** Users will lose their service tracking history.  
**Fix:** Move to Supabase persistent storage.

---

### 2. [SECURITY] Hardcoded JWT Secret Fallback
**File:** `backend/src/api/auth_working.ts` (Line 45)
```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
```
**Issue:** Fallback to hardcoded secret if env var is missing.  
**Impact:** Security vulnerability - predictable JWT signing.  
**Fix:** Throw error if JWT_SECRET is not set.

---

### 3. [SECURITY] Daily Message Limit Bypass (LawGPT)
**File:** `frontend/src/app/lawgpt/page.tsx` (Lines 549-560, 829-833)
```typescript
localStorage.setItem(`lawgpt_daily_${userId}`, JSON.stringify({ date: today, count: newCount }));
```
**Issue:** Message count stored in client localStorage.  
**Impact:** Users can clear localStorage to bypass 5-message daily limit.  
**Fix:** Store count in Supabase server-side.

---

### 4. [SECURITY] No Input Sanitization in Service Inquiry
**File:** `backend/src/api/service-inquiry.ts`
**Issue:** User input (serviceName, name, message) is directly inserted into HTML email template without escaping.  
**Impact:** XSS vulnerability in emails sent to admin.  
**Fix:** Use proper HTML escaping library (e.g., `he` or `escape-html`).

---

### 5. [BUG] Memory Leak in AutoBubble Component
**File:** `frontend/src/app/lawgpt/page.tsx` (Lines 244-296)
```typescript
const measureContainer = document.createElement("div");
document.body.appendChild(measureContainer);
// ...
document.body.removeChild(measureContainer);
```
**Issue:** If component unmounts before `calculateSize()` completes, DOM element won't be cleaned up.  
**Fix:** Add cleanup in useEffect return function.

---

### 6. [BUG] Race Condition in LawGPT Session Saving
**File:** `frontend/src/app/lawgpt/page.tsx` (Lines 604-679)
**Issue:** Rapid message sending can trigger multiple session creation attempts.  
**Impact:** Duplicate sessions, data inconsistency.  
**Fix:** Use mutex/lock pattern or optimistic session creation.

---

### 7. [BUG] Payment Simulation Code in Production
**File:** `frontend/src/app/dashboard/client/wallet/page.tsx` (Lines 270-299)
```typescript
// For testing: simulate successful payment
alert('Paytm payment gateway is being set up. For now, simulating successful payment.');
```
**Issue:** Fallback to "simulated" payment if Paytm URL not returned.  
**Impact:** Could allow fake wallet top-ups in certain scenarios.  
**Fix:** Remove simulation code for production.

---

### 8. [BUG] Aggressive Scroll Prevention Causes Jank
**File:** `frontend/src/app/lawgpt/page.tsx` (Lines 706-739)
```typescript
const interval = setInterval(ensureTopPosition, 100);
```
**Issue:** Running `window.scrollTo` every 100ms for 2 seconds on mount.  
**Impact:** Performance issues, especially on mobile.  
**Fix:** Use one-time scroll with requestAnimationFrame.

---

### 9. [BUG] Unused State Variables in Client Dashboard
**File:** `frontend/src/app/dashboard/client/page.tsx`
```typescript
const [trackedServices, setTrackedServices] = useState<ServiceTracking[]>([]);
```
**Issue:** `trackedServices` is fetched but never used in UI (only `selectedService` is used).  
**Fix:** Either use it or remove the state.

---

### 10. [BUG] Lawyer Profile Image Upload Not Implemented
**File:** `frontend/src/app/signup/page.tsx` (Lines 294-296)
```typescript
// TODO: Handle profile image upload to Supabase Storage
if (profileImage) {
  console.log('[Signup] Profile image upload to be implemented...');
}
```
**Issue:** Profile images are collected but never uploaded.  
**Fix:** Implement Supabase Storage upload.

---

### 11. [BUG] Duplicate Service Tracking Implementation
**File:** `frontend/src/app/dashboard/client/page.tsx`
**Issue:** There are TWO service tracking implementations:
1. `ServiceTrackingTab` component (Lines 106-291)
2. `Track` tab content (Lines 941-1034)

Both do the same thing but use different APIs and data structures.  
**Fix:** Consolidate into one implementation.

---

## 🟡 MEDIUM ISSUES

### 12. [SECURITY] No Rate Limiting on Auth Endpoints
**File:** `backend/src/api/auth_working.ts`
**Issue:** No rate limiting on login/register endpoints.  
**Impact:** Vulnerable to brute force attacks.  
**Fix:** Add rate limiting middleware (e.g., `express-rate-limit`).

---

### 13. [SECURITY] Email Content Not HTML-Escaped
**File:** `backend/src/api/service-inquiry.ts` (Lines 34-49)
```typescript
const htmlContent = `
  <p><b>Name:</b> ${inquiry.name}</p>
  ...
`;
```
**Issue:** Direct string interpolation in HTML.  
**Fix:** Use template library or escape function.

---

### 14. [SECURITY] CORS Allows localhost in Production
**File:** `backend/src/index.ts` (Lines 18-25)
```typescript
const allowedOrigins = [
  ...
  'http://localhost:3000',
  'http://localhost:9002',
];
```
**Issue:** Should be conditional based on NODE_ENV.  
**Fix:** Only allow localhost origins in development.

---

### 15. [BUG] ReactMarkdown Node Warning Spam
**File:** `frontend/src/app/lawgpt/page.tsx` (Lines 1096-1155)
```typescript
h1: ({ node, ...props }) => (...)
```
**Issue:** Destructuring `node` but not using it causes React warnings.  
**Fix:** Remove `node` or use `_node` to suppress warnings.

---

### 16. [BUG] Hardcoded Estimated Completion Date
**File:** `backend/src/api/service-inquiry.ts` (Line 123)
```typescript
estimatedCompletion: '13 Jan',
```
**Issue:** Hardcoded date instead of dynamic calculation.  
**Fix:** Calculate based on service type + current date.

---

### 17. [BUG] Missing Dependency in useEffect
**File:** `frontend/src/app/dashboard/client/page.tsx` (Lines 311-313)
```typescript
useEffect(() => {
  loadDashboardData();
}, []);
```
**Issue:** `router` is used in `loadDashboardData` but not in deps array.  
**Impact:** Potential stale closure.  
**Fix:** Add `router` to dependency array.

---

### 18. [BUG] Title Truncation Always Adds "..."
**File:** `frontend/src/app/lawgpt/page.tsx` (Line 618)
```typescript
const title = chatHistory.find(msg => msg.type === 'user')?.content.substring(0, 50) + '...' || 'New Chat';
```
**Issue:** Even short titles like "Hi" become "Hi..."  
**Fix:** Only add "..." if content.length > 50.

---

### 19. [UX] Alert() for Authentication Redirects
**File:** `frontend/src/app/lawgpt/page.tsx` (Lines 806-808)
```typescript
alert("Please login or sign up to use LawGPT.");
window.location.href = '/login';
```
**Issue:** `alert()` blocks UI and is poor UX.  
**Fix:** Use toast notification or redirect directly.

---

### 20. [UX] No Loading State for Service Orders
**File:** `frontend/src/app/dashboard/client/page.tsx` (Line 376)
**Issue:** Service tracking fetch doesn't show loading state in overview tab.  
**Fix:** Add skeleton loader.

---

### 21. [UX] Hardcoded "+15% this month" Stat
**File:** `frontend/src/app/dashboard/client/wallet/page.tsx` (Line 666)
```typescript
<p className="text-xs text-green-600 mt-2">+15% this month</p>
```
**Issue:** This percentage is always shown regardless of actual data.  
**Fix:** Calculate from actual transactions.

---

### 22. [UX] Magic Link Requires Pre-filled Email
**File:** `frontend/src/app/login/page.tsx` (Lines 345-366)
```typescript
if (!formData.email) {
  alert('Please enter your email first');
  return;
}
```
**Issue:** User must type email before clicking magic link button.  
**Fix:** Show inline prompt instead of alert.

---

### 23. [CODE] Deprecated File Still Present
**File:** `backend/src/api/auth.deprecated.ts`
**Issue:** Deprecated file with 16KB of unused code.  
**Fix:** Archive or delete.

---

### 24. [CODE] Unused Imports in Multiple Files
**Files:** Multiple dashboard pages
**Issue:** Many Lucide icons imported but never used.  
**Fix:** Remove unused imports.

---

### 25. [CODE] Two Different Tracking State Models
**Files:** `frontend/src/app/dashboard/client/page.tsx`
**Issue:** Uses both `ServiceOrder` and `ServiceTracking` interfaces for same feature.  
**Fix:** Standardize to one model.

---

### 26. [BUG] Member Since Date Wrong
**File:** `frontend/src/app/dashboard/client/page.tsx` (Line 910)
```typescript
<span className="font-medium">{new Date().toLocaleDateString(...)}</span>
```
**Issue:** Shows current date as "Member Since" instead of actual signup date.  
**Fix:** Use `profile.created_at` from Supabase.

---

### 27. [BUG] Wallet Balance Race Condition
**File:** `frontend/src/app/dashboard/client/wallet/page.tsx` (Lines 341-360)
**Issue:** Withdrawal updates local state immediately but backend update may fail.  
**Fix:** Only update local state after successful backend response.

---

### 28. [UX] No Validation Feedback for Forms
**Files:** `login/page.tsx`, `signup/page.tsx`
**Issue:** Validation errors only shown via `alert()`.  
**Fix:** Use inline error messages.

---

## 🟢 MINOR ISSUES

### 29. [CODE] Console.log in Production
**Files:** Multiple (lawgpt, dashboard, wallet, auth)
**Issue:** Extensive console.log statements throughout.  
**Fix:** Remove or use proper logging library.

---

### 30. [CODE] Magic Numbers Throughout
```typescript
if (dailyMessageCount >= 5) { ... }  // Line 812
setTimeout(..., 1000);  // Various
setTimeout(..., 180000);  // 3 min timeout
```
**Fix:** Extract to named constants.

---

### 31. [CODE] Hardcoded API URL in LawGPT
**File:** `frontend/src/app/lawgpt/page.tsx` (Line 756)
```typescript
fetch("https://turn2law-lawgpt-2.onrender.com/api/query", ...)
```
**Fix:** Move to environment variable.

---

### 32. [CODE] Unused Index Variable
**File:** `frontend/src/app/lawgpt/page.tsx` (Line 1075)
```typescript
{chatHistory.map((chat, index) => (
```
`index` is never used.

---

### 33. [CODE] Type Assertion to `any`
**File:** `frontend/src/app/lawgpt/page.tsx` (Line 1143)
```typescript
code: ({ node, inline, ...props }: any) => (...)
```
**Fix:** Define proper types.

---

### 34. [CODE] Duplicate Logo Components
**Files:** `login/page.tsx`, `signup/page.tsx`, dashboard pages
**Issue:** Same SVG logo defined multiple times.  
**Fix:** Create shared component.

---

### 35. [CODE] Missing Error Boundary
**Files:** All major pages
**Issue:** No React error boundaries for graceful error handling.  
**Fix:** Add error boundary components.

---

### 36. [UX] No Confirmation for Destructive Actions
**Files:** Wallet, Session management
**Issue:** No "Are you sure?" for withdrawals, session deletions.  
**Fix:** Add confirmation dialogs.

---

### 37. [UX] Missing Empty States
**Files:** Various dashboard sections
**Issue:** Some sections don't show helpful empty states.  
**Fix:** Add consistent empty state components.

---

### 38. [CODE] Inconsistent Date Formatting
**Files:** Dashboard, Wallet, Services
**Issue:** Different date formats used across pages.  
**Fix:** Create shared date formatting utility.

---

### 39. [CODE] No TypeScript Strict Mode
**File:** `tsconfig.json`
**Issue:** Not using strict TypeScript settings.  
**Fix:** Enable strict mode for better type safety.

---

### 40. [CODE] Tailwind Classes Could Be Consolidated
**Files:** Multiple
**Issue:** Long repetitive Tailwind class strings.  
**Fix:** Extract to CSS components or @apply directives.

---

### 41. [UX] Missing Keyboard Accessibility
**Files:** Various interactive elements
**Issue:** Some interactive elements not keyboard accessible.  
**Fix:** Add proper ARIA labels and keyboard handlers.

---

### 42. [CODE] Inconsistent Naming Conventions
**Issue:** Mix of camelCase and snake_case for Supabase fields.  
**Fix:** Create consistent mapper functions.

---

### 43. [UX] No Offline State Handling
**Files:** All pages
**Issue:** No graceful degradation when offline.  
**Fix:** Add offline detection and messaging.

---

### 44. [CODE] Large Component Files
**Files:** `lawgpt/page.tsx` (1275 lines), `dashboard/client/page.tsx` (1044 lines)
**Issue:** Components too large, hard to maintain.  
**Fix:** Split into smaller components.

---

### 45. [BUG] Potential XSS in Service Form
**File:** Multiple service pages
**Issue:** User input rendered without sanitization in some places.  
**Fix:** Always sanitize user-provided content.

---

### 46. [CODE] No API Response Types
**Files:** Frontend API calls
**Issue:** API responses not properly typed.  
**Fix:** Define response interfaces.

---

### 47. [UX] Loading Spinner Size Inconsistent
**Files:** Various pages
**Issue:** Different loading spinner sizes used.  
**Fix:** Create consistent loading component.

---

### 48. [CODE] Unused CSS/Tailwind Classes
**Files:** Various
**Issue:** Some defined styles never used.  
**Fix:** Audit and remove unused styles.

---

### 49. [BUG] Service Inquiry Success Not Shown
**File:** Service pages
**Issue:** After form submission, success state unclear.  
**Fix:** Add clear success message/modal.

---

### 50. [CODE] No Environment Variable Validation
**Issue:** App starts even with missing critical env vars.  
**Fix:** Validate required env vars at startup (backend + frontend).

---

### 51. [UX] Mobile Menu Not Implemented in Some Pages
**Issue:** Some pages lack proper mobile navigation.  
**Fix:** Ensure consistent mobile nav across all pages.

---

### 52. [CODE] Redundant Re-imports
**Files:** Dashboard pages
```typescript
const { getSession, getUserProfile } = await import('@/lib/supabase-auth');
```
**Issue:** Dynamic imports used unnecessarily in some places.  
**Fix:** Use static imports for consistency.

---

## 📋 Priority Recommendations

### Immediate (Before any new features):
1. ⚠️ Fix in-memory service tracking store (#1)
2. ⚠️ Remove JWT fallback secret (#2)
3. ⚠️ Fix payment simulation code (#7)
4. ⚠️ Add input sanitization (#4)

### After Service Tracking Feature:
5. Fix LawGPT daily limit bypass (#3)
6. Consolidate duplicate tracking implementations (#11)
7. Fix memory leak in AutoBubble (#5)
8. Implement lawyer profile image upload (#10)

### Code Quality Sprint:
9. Remove console.log statements (#29)
10. Split large components (#44)
11. Extract magic numbers to constants (#30)
12. Add TypeScript strict mode (#39)

---

## 🔗 Related Files Quick Reference

| Feature | Main Files |
|---------|-----------|
| LawGPT | `frontend/src/app/lawgpt/page.tsx`, `frontend/src/lib/nebius-ai.ts` |
| Auth | `frontend/src/lib/supabase-auth.ts`, `backend/src/api/auth_working.ts` |
| Dashboard (Client) | `frontend/src/app/dashboard/client/page.tsx` |
| Dashboard (Lawyer) | `frontend/src/app/dashboard/lawyer/page.tsx` |
| Wallet | `frontend/src/app/dashboard/client/wallet/page.tsx` |
| Service Tracking | `backend/src/store/service-tracking.store.ts`, `backend/src/routes/service-tracking.routes.ts` |
| Services | `frontend/src/app/services/*/page.tsx` |
| Backend Core | `backend/src/index.ts` |
