# 🔧 Bug Distribution by Team

> **As of:** January 17, 2026  
> **Total Issues:** 64 (now fully comprehensive)

---

## 📌 Distribution Summary

| Team | Critical | Medium | Minor | Total |
|------|----------|--------|-------|-------|
| LawGPT Team | 4 | 3 | 5 | **12** |
| Doc Drafting Team | 0 | 2 | 3 | **5** |
| Services & Matchmaking Team | 5 | 10 | 6 | **21** |
| Core/Shared (Full Stack Head) | 3 | 12 | 11 | **26** |

---

## 🤖 LAWGPT TEAM

### Critical (4)
| # | Issue | File |
|---|-------|------|
| 3 | Daily limit bypass via localStorage | `lawgpt/page.tsx` |
| 5 | Memory leak in AutoBubble component | `lawgpt/page.tsx` |
| 6 | Race condition in session saving | `lawgpt/page.tsx` |
| 8 | Aggressive scroll prevention causes jank | `lawgpt/page.tsx` |

### Medium (3)
| # | Issue | File |
|---|-------|------|
| 15 | ReactMarkdown `node` warning spam | `lawgpt/page.tsx` |
| 18 | Title truncation always adds "..." | `lawgpt/page.tsx` |
| 19 | `alert()` for auth redirects | `lawgpt/page.tsx` |

### Minor (5)
| # | Issue | File |
|---|-------|------|
| 31 | Hardcoded API URL | `lawgpt/page.tsx` |
| 32 | Unused `index` variable in map | `lawgpt/page.tsx` |
| 33 | Type assertion to `any` | `lawgpt/page.tsx` |
| 44 | Large component file (1275 lines) | `lawgpt/page.tsx` |
| 29 | Console.log in production | `lawgpt/page.tsx` |

---

## 📝 DOC DRAFTING TEAM

### Critical (0)
*None - good job! 🎉*

### Medium (2)
| # | Issue | File |
|---|-------|------|
| 53 | `alert()` for auth redirects, poor UX | `documents/page.tsx` |
| 54 | No generated document history/saving | No persistence of drafts |

### Minor (3)
| # | Issue | File |
|---|-------|------|
| 55 | Downloads as .txt instead of .docx/.pdf | `documents/page.tsx` |
| 56 | No loading skeleton on document cards | `documents/page.tsx` |
| 57 | Form state persisted in localStorage (privacy) | `use-documents-store.ts` |

---

## 🏢 SERVICES & MATCHMAKING TEAM

### Critical (5)
| # | Issue | File |
|---|-------|------|
| 1 | In-memory service tracking (DATA LOSS) | `service-tracking.store.ts` |
| 4 | No input sanitization in service inquiry | `service-inquiry.ts` |
| 9 | Unused state variables in dashboard | `dashboard/client/page.tsx` |
| 11 | Duplicate service tracking implementations | `dashboard/client/page.tsx` |
| 58 | **Messages not persisted** - chat history only in React state | `messages-context.tsx` |

### Medium (10)
| # | Issue | File |
|---|-------|------|
| 13 | Email content not HTML-escaped | `service-inquiry.ts` |
| 16 | Hardcoded estimated completion date | `service-inquiry.ts` |
| 20 | No loading state for service orders | `dashboard/client/page.tsx` |
| 25 | Two different tracking state models | `dashboard/client/page.tsx` |
| 26 | "Member Since" date shows today | `dashboard/client/page.tsx` |
| 17 | Missing dependency in useEffect | `dashboard/client/page.tsx` |
| 59 | `alert()` for auth redirects in consult page | `consult/page.tsx` |
| 60 | Hardcoded backend URL fallback | `consult/page.tsx` |
| 61 | TODO: Online status not implemented | `messages-context.tsx` |
| 62 | TODO: Mark messages as read not implemented | `messages-context.tsx` |

### Minor (6)
| # | Issue | File |
|---|-------|------|
| 49 | Service inquiry success not shown | Service pages |
| 37 | Missing empty states | Dashboard sections |
| 47 | Loading spinner size inconsistent | Various |
| 29 | Console.log in production | Dashboard, services |
| 63 | Type assertion `value: any` in SmartMatchModal | `SmartMatchModal.tsx` |
| 64 | Type assertion `id: any` in verify-email | `verify-email-otp/page.tsx` |

---

## 🔐 CORE/SHARED (Full Stack Head - You)
x
### Critical (3)
| # | Issue | File |
|---|-------|------|
| 2 | Hardcoded JWT secret fallback | `auth_working.ts` |
| 7 | Payment simulation code in production | `wallet/page.tsx` |
| 10 | Lawyer profile image upload not implemented | `signup/page.tsx` |

### Medium (12)
| # | Issue | File |
|---|-------|------|
| 12 | No rate limiting on auth endpoints | `auth_working.ts` |
| 14 | CORS allows localhost in production | `backend/index.ts` |
| 21 | Hardcoded "+15% this month" stat | `wallet/page.tsx` |
| 22 | Magic link requires pre-filled email | `login/page.tsx` |
| 23 | Deprecated auth file still present | `auth.deprecated.ts` |
| 24 | Unused imports in multiple files | Multiple |
| 27 | Wallet balance race condition | `wallet/page.tsx` |
| 28 | No validation feedback for forms | `login`, `signup` |
| 38 | Inconsistent date formatting | Multiple |
| 42 | Inconsistent naming conventions | Multiple |
| 50 | No environment variable validation | Backend + Frontend |
| 52 | Redundant dynamic re-imports | Dashboard pages |

### Minor (11)
| # | Issue | File |
|---|-------|------|
| 30 | Magic numbers throughout | Multiple |
| 34 | Duplicate Logo components | `login`, `signup`, etc |
| 35 | Missing Error Boundary | All pages |
| 36 | No confirmation for destructive actions | Wallet |
| 39 | No TypeScript strict mode | `tsconfig.json` |
| 40 | Tailwind classes could be consolidated | Multiple |
| 41 | Missing keyboard accessibility | Various |
| 43 | No offline state handling | All pages |
| 45 | Potential XSS in service forms | Service pages |
| 46 | No API response types | Frontend |
| 48 | Unused CSS/Tailwind classes | Various |
| 51 | Mobile menu not in some pages | Various |

---

## 📧 Suggested Message to Teams

### To LawGPT Team:
> Hey team! I've done a code audit and found **12 issues** in the LawGPT feature (4 critical). The most urgent ones are:
> 1. **Daily limit bypass** - users can clear localStorage to get unlimited messages
> 2. **Memory leak** in AutoBubble - DOM elements not cleaning up
> 3. **Race condition** when saving sessions rapidly
>
> Can you prioritize the critical ones first? Full details in `/docs/BUG_AUDIT.md`

### To Services Team:
> Hey team! Found **14 issues** in services/matchmaking (4 critical). Most urgent:
> 1. **In-memory store** - service tracking data LOST on server restart! 
> 2. **Duplicate implementations** - two different tracking UIs doing same thing
> 3. **No input sanitization** - XSS risk in email templates
>
> The data loss one is P0. Full details in `/docs/BUG_AUDIT.md`

---

## 🎯 Priority Sprint Suggestion

### Week 1 - Critical Only
- **LawGPT Team:** Fix #3, #5, #6
- **Services Team:** Fix #1 (most critical), #4, #11
- **You (Core):** Fix #2, #7

### Week 2 - Medium Priority
- All teams tackle their medium issues
- Code review cross-check

### Week 3 - Cleanup
- Minor issues
- Remove console.logs
- Code quality improvements

---

## ✅ Tracking Checklist

```
LAWGPT TEAM
[ ] #3 - Daily limit bypass
[ ] #5 - Memory leak AutoBubble
[ ] #6 - Race condition sessions
[ ] #8 - Scroll jank
[ ] #15 - Node warning
[ ] #18 - Title truncation
[ ] #19 - Alert for auth
[ ] #31 - Hardcoded API URL
[ ] #32 - Unused index
[ ] #33 - any type
[ ] #44 - Split component
[ ] #29 - Console.log

SERVICES TEAM
[ ] #1 - In-memory store (URGENT)
[ ] #4 - Input sanitization
[ ] #9 - Unused state
[ ] #11 - Duplicate tracking
[ ] #13 - HTML escaping
[ ] #16 - Hardcoded date
[ ] #20 - Loading state
[ ] #25 - State models
[ ] #26 - Member since date
[ ] #17 - useEffect deps
[ ] #49 - Success state
[ ] #37 - Empty states
[ ] #47 - Spinner size
[ ] #29 - Console.log

CORE (FULL STACK HEAD)
[ ] #2 - JWT secret
[ ] #7 - Payment simulation
[ ] #10 - Image upload
[ ] #12 - Rate limiting
[ ] #14 - CORS localhost
... (see full list above)
```
