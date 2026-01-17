# 🔍 Turn2Law - Bug List by Priority

> **Total: 68 Issues** | Updated: Jan 17, 2026

---

## 🔴 CRITICAL (16 issues)
*Must fix before production/demos*

### Security Vulnerabilities
| # | Issue | File | Owner |
|---|-------|------|-------|
| 1 | In-memory store - DATA LOST on restart | `service-tracking.store.ts` | Services |
| 2 | Hardcoded JWT secret fallback | `auth_working.ts` | Core |
| 3 | Daily limit bypass via localStorage | `lawgpt/page.tsx` | LawGPT |
| 4 | No input sanitization (XSS in emails) | `service-inquiry.ts` | Services |
| 65 | **WEAK PASSWORD** - Only checks length>=6, no strength | `signup/page.tsx`, `reset-password/page.tsx` | Core |
| 66 | **BANK ACCOUNTS IN LOCALSTORAGE** - Not encrypted! | `lawyer/wallet/page.tsx:211` | Core |
| 67 | **NO AUTH ON DOC GENERATOR** - Can generate without login | `documents/[type]/page.tsx` | Doc Draft |
| 68 | **SALARY/CTC EXPOSED** - Plain text, no masking | `documents/[type]/page.tsx` | Doc Draft |

### Data Loss / Corruption
| # | Issue | File | Owner |
|---|-------|------|-------|
| 5 | Memory leak in AutoBubble | `lawgpt/page.tsx` | LawGPT |
| 6 | Race condition in session saving | `lawgpt/page.tsx` | LawGPT |
| 7 | Payment simulation in production | `wallet/page.tsx` | Core |
| 58 | Messages not persisted properly | `messages-context.tsx` | Services |

### Logic Bugs
| # | Issue | File | Owner |
|---|-------|------|-------|
| 9 | Unused state `trackedServices` | `dashboard/client/page.tsx` | Services |
| 10 | Lawyer image upload not implemented | `signup/page.tsx` | Core |
| 11 | Duplicate tracking implementations | `dashboard/client/page.tsx` | Services |
| 8 | Scroll jank (setInterval every 100ms) | `lawgpt/page.tsx` | LawGPT |

---

## 🟡 MEDIUM (27 issues)
*Should fix soon*

### Security
| # | Issue | File | Owner |
|---|-------|------|-------|
| 12 | No rate limiting on auth | `auth_working.ts` | Core |
| 13 | Email not HTML-escaped | `service-inquiry.ts` | Services |
| 14 | CORS allows localhost in prod | `backend/index.ts` | Core |

### Bugs
| # | Issue | File | Owner |
|---|-------|------|-------|
| 15 | ReactMarkdown `node` warning | `lawgpt/page.tsx` | LawGPT |
| 16 | Hardcoded "13 Jan" date | `service-inquiry.ts` | Services |
| 17 | Missing useEffect dependency | `dashboard/client/page.tsx` | Services |
| 18 | Title truncation adds "..." always | `lawgpt/page.tsx` | LawGPT |
| 26 | "Member Since" shows today | `dashboard/client/page.tsx` | Services |
| 27 | Wallet balance race condition | `wallet/page.tsx` | Core |
| 61 | TODO: Online status not done | `messages-context.tsx` | Services |
| 62 | TODO: Mark as read not done | `messages-context.tsx` | Services |

### UX Issues
| # | Issue | File | Owner |
|---|-------|------|-------|
| 19 | `alert()` for auth (LawGPT) | `lawgpt/page.tsx` | LawGPT |
| 20 | No loading state for services | `dashboard/client/page.tsx` | Services |
| 21 | Hardcoded "+15% this month" | `wallet/page.tsx` | Core |
| 22 | Magic link needs email first | `login/page.tsx` | Core |
| 28 | No inline validation feedback | `login/signup` | Core |
| 53 | `alert()` for auth (Documents) | `documents/page.tsx` | Doc Draft |
| 54 | No document history/saving | Document pages | Doc Draft |
| 59 | `alert()` for auth (Consult) | `consult/page.tsx` | Services |
| 60 | Hardcoded backend URL | `consult/page.tsx` | Services |

### Code Quality
| # | Issue | File | Owner |
|---|-------|------|-------|
| 23 | Deprecated auth file exists | `auth.deprecated.ts` | Core |
| 24 | Unused imports everywhere | Multiple | Core |
| 25 | Two tracking state models | `dashboard/client/page.tsx` | Services |
| 50 | No env var validation | Backend + Frontend | Core |
| 52 | Redundant dynamic imports | Dashboard pages | Core |

---

## � Must Fix Before Demo (Top 5)

1. [ ] **#65** - Add password strength validation (uppercase, number, symbol)
2. [ ] **#66** - Move bank accounts from localStorage to Supabase
3. [ ] **#67** - Add auth check to document generator page
4. [ ] **#1** - Move service tracking to Supabase (data loss!)
5. [ ] **#7** - Remove payment simulation code

---

## 📊 Quick Stats

| Category | Count |
|----------|-------|
| 🔴 Critical | 16 |
| 🟡 Medium | 27 |
| 🟢 Minor | 25 (moved to LATER_FIX.md) |
| **Total** | **68** |
