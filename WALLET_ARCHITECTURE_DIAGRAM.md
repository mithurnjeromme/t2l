# 🎨 Wallet System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TURN2LAW WALLET ECOSYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────────────┐          ┌────────────────────────────┐
│      CLIENT WALLET 💳      │          │     LAWYER WALLET 💼       │
│  /dashboard/client/wallet  │          │  /dashboard/lawyer/wallet  │
└────────────────────────────┘          └────────────────────────────┘
              │                                      │
              │                                      │
              ▼                                      ▼
    ┌─────────────────┐                  ┌─────────────────┐
    │  ADD MONEY      │                  │  VIEW EARNINGS  │
    │  via Razorpay   │                  │  & Statistics   │
    │  • UPI          │                  │  • This Month   │
    │  • Cards        │                  │  • Total        │
    │  • Net Banking  │                  │  • Pending      │
    │  • Wallets      │                  │  • Growth       │
    └─────────────────┘                  └─────────────────┘
              │                                      │
              │                                      │
              ▼                                      ▼
    ┌─────────────────┐                  ┌─────────────────┐
    │  WALLET         │◄─────────────────│  WALLET         │
    │  BALANCE        │   Consultation   │  BALANCE        │
    │  ₹50,000        │   Payment Flow   │  ₹125,000       │
    └─────────────────┘                  └─────────────────┘
              │                                      │
              │                                      │
              ▼                                      ▼
    ┌─────────────────┐                  ┌─────────────────┐
    │  WITHDRAW       │                  │  WITHDRAW       │
    │  to Bank        │                  │  to Bank        │
    │  Min: ₹500      │                  │  Min: ₹500      │
    │  2-3 days       │                  │  2-3 days       │
    └─────────────────┘                  └─────────────────┘
              │                                      │
              └──────────────┬───────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   BANK ACCOUNTS      │
                  │   • Multiple banks   │
                  │   • Secure storage   │
                  │   • Default option   │
                  │   • IFSC validation  │
                  └──────────────────────┘

═══════════════════════════════════════════════════════════════════════

                         DATA FLOW DIAGRAM

CLIENT ADDS MONEY                      LAWYER RECEIVES PAYMENT
       │                                        │
       ▼                                        │
  [Add Money]                                   │
       │                                        │
       ▼                                        │
  [Razorpay UI]                                 │
       │                                        │
       ▼                                        │
  [Payment Done]                                │
       │                                        │
       ▼                                        │
  [Verify Payment]────────────────┐             │
       │                          │             │
       ▼                          │             │
  [Credit Client]                 │             │
   [Wallet]                       │             │
       │                          ▼             │
       │                   [Create Order]       │
       │                          │             │
       │                          ▼             │
       │                   [Client Pays]        │
       │                          │             │
       │                          ▼             │
       │                   [Verify Payment]     │
       │                          │             │
       │                          ▼             │
       │                   [Credit Lawyer]──────┘
       │                    [Wallet]
       │                          │
       │                          │
       ▼                          ▼
  [Transaction]            [Transaction]
   [History]                [History]

═══════════════════════════════════════════════════════════════════════

                      DASHBOARD INTEGRATION MAP

┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT DASHBOARD                              │
│                   /dashboard/client                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────────────┐     │
│  │Active│ │Compl-│ │Total │ │Pendig│ │   💳 WALLET CARD     │     │
│  │Cases │ │eted  │ │Spent │ │Amount│ │   Balance: ₹50,000   │     │
│  │  5   │ │  12  │ │₹25k  │ │₹2,000│ │   Growth: +8.5%      │─────┼──> TO WALLET
│  └──────┘ └──────┘ └──────┘ └──────┘ │   [Click to Open]    │     │
│                                       └──────────────────────┘     │
│                                                                      │
│  Quick Actions:                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │ Consultations│ │  Documents   │ │ 💼 MY WALLET │──────────────┼──> TO WALLET
│  └──────────────┘ └──────────────┘ └──────────────┘               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        LAWYER DASHBOARD                              │
│                   /dashboard/lawyer                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────────────┐     │
│  │Total │ │Month-│ │Consul│ │Rating│ │   💼 WALLET CARD     │     │
│  │Clnts │ │ly $  │ │tations│ │ 5.0  │ │   Balance: ₹125k     │     │
│  │  0   │ │  ₹0  │ │  0   │ │      │ │   Growth: +12.5%     │─────┼──> TO WALLET
│  └──────┘ └──────┘ └──────┘ └──────┘ │   [Click to Open]    │     │
│                                       └──────────────────────┘     │
│                                                                      │
│  Practice Management:                                               │
│  ┌──────────────┐ ┌──────────────┐                                 │
│  │Consultations │ │ 💼 MY WALLET │──────────────────────────────┼──> TO WALLET
│  └──────────────┘ └──────────────┘                                 │
│  ┌──────────────┐ ┌──────────────┐                                 │
│  │  My Clients  │ │  Analytics   │                                 │
│  └──────────────┘ └──────────────┘                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                       TRANSACTION FLOW MATRIX

CLIENT WALLET                          LAWYER WALLET
━━━━━━━━━━━━━                         ━━━━━━━━━━━━━━

CREDIT (Money In)                     CREDIT (Money In)
├─ Add Money (Manual)                 ├─ Consultation Fee (Auto)
│  ├─ UPI                             │  ├─ From Client Payment
│  ├─ Card                            │  ├─ Razorpay Processing
│  ├─ Net Banking                     │  ├─ Instant Credit
│  └─ Wallet                          │  └─ With Client Details
└─ Refund (if any)                    └─ Bonus/Rewards (future)

DEBIT (Money Out)                     DEBIT (Money Out)
├─ Consultation Payment               ├─ Withdrawal to Bank
├─ Service Charges                    │  ├─ Min: ₹500
├─ Document Fees                      │  ├─ No charges
└─ Withdrawal to Bank                 │  └─ 2-3 business days
                                      └─ Platform fees (future)

═══════════════════════════════════════════════════════════════════════

                      COMPONENT ARCHITECTURE

┌─────────────────────────────────────────────────────────────────────┐
│                         WALLET PAGE                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ HEADER                                                      │    │
│  │ [← Back]  Professional/Client Wallet  [Export] [Refresh]   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ BALANCE CARD (Gradient)                                     │    │
│  │ ┌─────────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │ │ This Month      │  │ Withdrawn   │  │ Pending     │     │    │
│  │ │ ₹45,000         │  │ ₹80,000     │  │ ₹30,000     │     │    │
│  │ └─────────────────┘  └─────────────┘  └─────────────┘     │    │
│  │ [Withdraw Funds]  [View Analytics]                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────┐  ┌────────────────────────────────┐       │
│  │ PROFESSIONAL STATS  │  │ BANK ACCOUNTS                  │       │
│  │ • Consultations     │  │ ┌──────────┐ ┌──────────┐     │       │
│  │ • Average Fee       │  │ │ HDFC     │ │ SBI      │     │       │
│  │ • Rating            │  │ │ ••••6789 │ │ ••••1234 │     │       │
│  │ [View Dashboard]    │  │ └──────────┘ └──────────┘     │       │
│  └─────────────────────┘  │ [Add Bank Account]             │       │
│                            └────────────────────────────────┘       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ TRANSACTION HISTORY                                         │    │
│  │ [Search...] [Type ▼] [Status ▼]                            │    │
│  │ ┌────────────────────────────────────────────────────┐     │    │
│  │ │ ⬇️ Consultation Fee - Property Law      +₹5,000   │     │    │
│  │ │ Client: Rahul Sharma | TXN001 | ✅ Success       │     │    │
│  │ └────────────────────────────────────────────────────┘     │    │
│  │ ┌────────────────────────────────────────────────────┐     │    │
│  │ │ ⬆️ Withdrawal to Bank Account          -₹50,000   │     │    │
│  │ │ TXN003 | Bank Transfer | ✅ Success              │     │    │
│  │ └────────────────────────────────────────────────────┘     │    │
│  │ [Export Transactions]                                       │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ SECURITY         │  │ HELP & SUPPORT   │                        │
│  │ • Encryption     │  │ • FAQs           │                        │
│  │ • PCI DSS        │  │ • Contact        │                        │
│  │ • Secure         │  │ • Guide          │                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                         STATE MANAGEMENT

┌─────────────────────────────────────────────────────────────────────┐
│                        REACT HOOKS STATE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  useState                                                            │
│  ├─ user (User object)                                              │
│  ├─ loading (boolean)                                               │
│  ├─ walletBalance (number)                                          │
│  ├─ isBalanceVisible (boolean)                                      │
│  ├─ withdrawAmount (string)                                         │
│  ├─ selectedBank (string)                                           │
│  ├─ searchTerm (string)                                             │
│  ├─ filterType ('all' | 'credit' | 'debit')                        │
│  ├─ filterStatus ('all' | 'success' | 'pending' | 'failed')        │
│  ├─ transactions (Transaction[])                                    │
│  ├─ bankAccounts (BankAccount[])                                    │
│  ├─ isWithdrawOpen (boolean)                                        │
│  └─ isAddBankOpen (boolean)                                         │
│                                                                      │
│  useEffect                                                           │
│  └─ Authentication & User Data Loading                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                        SECURITY LAYERS

┌─────────────────────────────────────────────────────────────────────┐
│                         SECURITY STACK                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Layer 1: Transport Security                                        │
│  └─ SSL/TLS Encryption (HTTPS)                                      │
│                                                                      │
│  Layer 2: Authentication                                             │
│  └─ JWT Token Verification                                          │
│                                                                      │
│  Layer 3: Authorization                                              │
│  └─ Role-based Access Control (Client/Lawyer)                       │
│                                                                      │
│  Layer 4: Payment Security                                           │
│  ├─ Razorpay PCI DSS Level 1                                        │
│  └─ Signature Verification                                          │
│                                                                      │
│  Layer 5: Data Protection                                            │
│  ├─ Input Validation                                                │
│  ├─ XSS Prevention                                                  │
│  ├─ SQL Injection Prevention                                        │
│  └─ Encrypted Bank Details                                          │
│                                                                      │
│  Layer 6: Transaction Security                                       │
│  ├─ Amount Validation                                               │
│  ├─ Balance Verification                                            │
│  └─ Duplicate Prevention                                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

                          TECH STACK

┌─────────────────────────────────────────────────────────────────────┐
│                         TECHNOLOGY LAYERS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Frontend Framework                                                  │
│  └─ Next.js 14 (App Router)                                         │
│                                                                      │
│  Language                                                            │
│  └─ TypeScript                                                       │
│                                                                      │
│  UI Library                                                          │
│  ├─ React 18                                                         │
│  └─ Shadcn/ui Components                                            │
│                                                                      │
│  Styling                                                             │
│  ├─ Tailwind CSS                                                     │
│  └─ CSS Modules                                                      │
│                                                                      │
│  Icons                                                               │
│  └─ Lucide React                                                     │
│                                                                      │
│  Payment Gateway                                                     │
│  └─ Razorpay                                                         │
│                                                                      │
│  State Management                                                    │
│  └─ React Hooks (useState, useEffect)                               │
│                                                                      │
│  Backend (Pending)                                                   │
│  ├─ Node.js / Express                                               │
│  ├─ PostgreSQL / MongoDB                                            │
│  └─ REST API                                                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
                                                                        
                        🎉 SYSTEMS COMPLETE! 🎉                        
                                                                        
═══════════════════════════════════════════════════════════════════════
```
