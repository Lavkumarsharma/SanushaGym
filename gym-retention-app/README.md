# Gym Retention App - Complete Tech Stack Implementation

## Overview

Mobile-first Gym Retention App for a local Indian gym, built with:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Mobile | React Native (Expo) | iOS + Android member app |
| Web Dashboard | Next.js 14 | Owner/staff admin panel (Vercel) |
| Backend API | Node.js + Express + Socket.io | Render server |
| Database | Supabase (PostgreSQL) | Auth + data |
| Real-time | Socket.io | Live attendance, no-show alerts |
| Email | Resend | Renewal reminders, OTP, notifications |

## Folder Structure

```
gym-retention-app/
├── supabase/
│   └── schema.sql              # 15 tables, indexes, sample data
├── mobile/                     # React Native (Expo)
│   ├── app/
│   │   ├── _layout.tsx         # Root navigator + Supabase + Socket providers
│   │   ├── (auth)/
│   │   │   └── login.tsx       # Mobile OTP login
│   │   └── (member)/
│   │       ├── index.tsx       # Home (DaysCounter, streak, membership)
│   │       ├── check-in.tsx    # QR scanner + validation states
│   │       ├── history.tsx     # Attendance history with filters
│   │       ├── add-ons.tsx     # PT / Diet / Supplements marketplace
│   │       ├── renewal.tsx     # 3/6/12-month renewal + payment states
│   │       └── settings.tsx    # Communication opt-out controls
│   ├── components/
│   │   ├── DaysCounter.tsx     # Spring-animated number + milestone pulse
│   │   └── MembershipCard.tsx  # Active membership card
│   ├── services/
│   │   ├── supabase.ts         # Supabase client + helpers
│   │   └── socket.ts           # Socket.io context provider
│   ├── package.json
│   └── app.json
├── web/                        # Next.js (Vercel)
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Dark theme styles
│   │   ├── dashboard/          # Owner dashboard cards
│   │   ├── red-list/           # At-risk members table
│   │   ├── follow-ups/         # Follow-up outcomes
│   │   ├── renewals/           # Renewal pipeline
│   │   ├── add-ons/            # Add-on marketplace admin
│   │   └── login/              # Staff login
│   ├── lib/supabase.ts         # Supabase client (server + client)
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                    # Node.js API (Render)
│   ├── src/index.ts            # Express + Socket.io + automations
│   ├── render.yaml             # Render deploy config
│   └── package.json
├── ARCHITECTURE.md
└── README.md
```

## Environment Variables

### Mobile (.env)
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_SOCKET_URL=https://your-api.onrender.com
```

### Web (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
RESEND_API_KEY=re_your_key
FRONTEND_URL=https://your-web.vercel.app
PORT=3001
```

## Database Schema (15 Tables)

1. **members** - Member profiles, opt-in flags, streak
2. **plans** - Membership plans (monthly, quarterly, half-yearly, yearly)
3. **memberships** - Active/expired memberships with pause support
4. **attendance** - QR check-ins with session validation
5. **streaks** - Planned visit / weekly goal streak tracking
6. **no_show_cases** - Automated churn detection cases
7. **follow_ups** - 7 outcome types with next-action dates
8. **payments** - created → pending → paid/failed/refunded/reversed
9. **renewal_orders** - Linked to payments
10. **add_ons** - PT, diet, supplements with stock/trainer
11. **add_on_orders** - Member add-on purchases
12. **notifications** - Push/SMS/Email/WhatsApp
13. **settings** - Configurable thresholds
14. **staff** - Owner, manager, front-desk roles
15. **audit_logs** - All changes tracked

## Key Features Implemented

### Member App (React Native)
- ✅ Mobile OTP login via Supabase Auth
- ✅ Home screen: DaysCounter motion, streak, membership expiry
- ✅ QR Check-In: success, duplicate, invalid, expired, offline states
- ✅ Attendance history with All/Week/Month filters
- ✅ Add-Ons: never pre-selected, exact price, validity, stock, trainer info
- ✅ Renewal: 3/6/12-month, base price, discount, final amount, benefits, terms
- ✅ Payment states with simulated provider (80% success rate demo)
- ✅ Settings: communication opt-out (marketing separate from service)
- ✅ Socket.io real-time attendance updates

### Owner Dashboard (Next.js)
- ✅ Dashboard cards: active members, check-ins, 7-day active, no-show, renewals, revenue
- ✅ Red List: absent members with trainer, absent days, call/WhatsApp actions
- ✅ Follow-Ups: 7 outcomes, next-action-date tracking
- ✅ Renewals: expiring soon list with reminder actions
- ✅ Add-Ons: stock management, trainer info, cancellation terms

### Backend (Render + Socket.io)
- ✅ REST API for members, attendance, payments, add-ons, red-list
- ✅ Socket.io rooms for real-time member notifications
- ✅ Daily no-show scan automation (10-day threshold)
- ✅ Daily renewal reminders (14/7/3/0 days)
- ✅ Resend email integration for reminders
- ✅ Payment verification extends membership exactly once

## Automation Rules

1. **Daily no-show scan**: Opens case when active member absent ≥ 10 days
2. **QR check-in**: Records attendance, updates streak, resolves no-show case
3. **Renewal reminders**: 14/7/3/0 day windows, stop after payment/cancellation/opt-out
4. **Payment verification**: Activates/extends membership exactly once + receipt
5. **Daily summary**: Check-ins, risk cases, follow-ups, renewals, add-on actions

## Deploy Instructions

### 1. Supabase
- Create project at supabase.com
- Run `supabase/schema.sql` in SQL editor
- Get URL + anon key + service key

### 2. Backend (Render)
- Connect GitHub repo to Render
- Use `backend/render.yaml`
- Add env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, FRONTEND_URL

### 3. Web (Vercel)
- Connect `web/` folder to Vercel
- Add env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

### 4. Mobile (Expo)
- `cd mobile && npm install`
- Update `.env` with your Supabase + Socket URLs
- `npx expo start`
