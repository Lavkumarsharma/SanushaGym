# Gym Retention App — iOS SwiftUI Prototype

Mobile-first prototype for a local Indian gym. Built in SwiftUI with the
DaysCounter motion (spring-animated numbers + milestone pulses) applied across
the Member Home screen.

## Business Goal
Detect silent member churn early, make attendance visible, improve timely
renewals, and offer relevant PT, diet and supplement add-ons transparently.

## User Roles
| Role | Access |
|------|--------|
| **Member** | Login via mobile, home screen with streak/expiry, QR check-in, attendance history, add-ons, renewal, settings |
| **Gym Owner / Manager** | Dashboard cards, red-list, follow-ups, renewals, add-on revenue, plan management |
| **Front-Desk Staff** | Assisted check-in, manual QR entry, member lookup |

## Tech Stack (iOS client)
- SwiftUI + Swift Concurrency (async/await)
- Combine-friendly `@MainActor` stores
- UIKit haptics bridge (light impact, notification success/error)
- Reduce Motion awareness & full VoiceOver accessibility

## Project Structure
```
GymRetentionApp/
├── Sources/
│   ├── GymRetentionApp.swift            # App entry + role-based routing
│   ├── Models/
│   │   └── Member.swift                 # Member, Membership, Attendance, AddOn, Payment + sample data
│   ├── Stores/
│   │   ├── MemberStore.swift            # Member state (Supabase-ready)
│   │   ├── AttendanceStore.swift        # Check-in state
│   │   └── OwnerStore.swift             # Owner dashboard, red-list, follow-ups, plans, add-ons, staff
│   ├── Components/
│   │   ├── Haptics.swift                # Haptic feedback bridge
│   │   └── Accessibility.swift          # Reduce Motion detection
│   └── Views/
│       ├── Member/
│       │   ├── DaysCounter.swift            # Motion component (streak / days left)
│       │   ├── MembershipCardView.swift     # Active membership + expiry + DaysCounter
│       │   ├── MemberHomeView.swift         # Member home (TabView: Home, Check-In, History, Add-Ons, Renewal, Settings)
│       │   ├── MemberLoginView.swift        # Mobile-number login
│       │   ├── QRCheckInView.swift          # QR scanner + validation states
│       │   ├── AttendanceHistoryView.swift  # Check-in history with filters
│       │   ├── AddOnsView.swift             # PT / Diet / Supplements marketplace
│       │   ├── RenewalView.swift            # 3/6/12-month renewal + payment states
│       │   └── SettingsView.swift           # Communication opt-out controls
│       └── Owner/
│           └── OwnerDashboardView.swift     # Dashboard cards, red-list, follow-ups, renewals, add-ons
```

## Motion — DaysCounter (60fps-style)

Applied to **two places** on the Member Home screen:
1. **Streak counter** — `currentStreak` with spring-animated number morph + milestone pulse
2. **Days until expiry** — in `MembershipCardView`, accent turns yellow when ≤ 7 days

### Motion spec
| Beat | Timing | Easing | Haptics |
|------|--------|--------|---------|
| Number morph | 0.35s | spring(response: 0.35, damping: 0.8) | light impact on change |
| Milestone pulse | 0.3s | ease-out (scale 1.0→1.15→1.0) | success notification |
| Check-in button press | 0.3s | spring(response: 0.3, damping: 0.7) | success |

Respects **Reduce Motion** (falls back to static number). Full accessibility labels for VoiceOver.

## Sample Data
- 30 members with realistic Indian names
- 3 trainers, 1 front-desk user
- Membership plans: monthly, quarterly, half-yearly, yearly
- 6 members absent 10–20 days (red-list)
- 5 memberships expiring within 7 days
- PT, diet, supplement add-on examples with stock/trainer/qualification

## Key Features Implemented

### Member
- ✅ Mobile-number login (verified lookup)
- ✅ Home screen: active membership, expiry date, weekly goal, streak (DaysCounter motion)
- ✅ QR check-in: success, duplicate, invalid, expired, offline-sync states
- ✅ Attendance history with date/time + filters (All / This Week / This Month)
- ✅ Streak: fair options, rest days/pauses don't unfairly break streak
- ✅ Renewal: 3/6/12-month options, base price, discount, final amount, benefits, terms
- ✅ Payment states: created → pending → paid/failed/refunded/reversed
- ✅ Add-on marketplace: never pre-selected, exact price, validity, trainer/qual, stock, cancellation terms
- ✅ Communication opt-out (marketing consent separate)

### Owner / Staff
- ✅ Dashboard cards: active members, today's check-ins, 7-day active, no-show cases, returned members, renewals due, renewal collection, add-on revenue
- ✅ Configurable no-show threshold (default 10 days)
- ✅ Red-list: member, phone, plan, expiry, last check-in, absent days, trainer, follow-up actions
- ✅ Follow-up outcomes: Will return, Injured, Travelling, Timing issue, Unhappy, No response, Cancelled (next action date when needed)
- ✅ Renewal pipeline & payment verification
- ✅ Daily owner summary (via dashboard cards)

## Required Automations (documented)
1. Daily no-show scan opens case when eligible member crosses threshold
2. Valid QR check-in records attendance, updates streak, resolves no-show case
3. Renewal reminders at 14/7/3/0-day windows, stop after payment/cancellation/opt-out
4. Verified payment activates/extends membership exactly once, issues receipt
5. Daily owner summary reports check-ins, risk cases, follow-ups, renewals, add-on actions
6. Data-quality alerts: missing expiry, unverified paid state, attendance correction without reason, negative stock, trainer double booking

## Safety & Integrity
- Simulated payments until a real provider is connected
- No raw card/UPI credentials stored
- Attendance corrections, payment reversals, follow-up history auditable
- Marketing consent separate, supports opt-out
- No medical/transformation/income guarantees

## Next Steps for Production
- Connect Supabase backend (Members, Plans, Memberships, Attendance, Streaks, NoShowCases, FollowUps, Payments, RenewalOrders, AddOns, AddOnOrders, Notifications, Settings, AuditLogs)
- Wire QR scanner (AVFoundation) instead of simulated scan
- Add Owner: manage plans/memberships/pauses/prices/discounts/stock/capacity/staff
- Add Owner: PT package session usage & product order fulfilment
- Add push notifications via APNs
- Add audit log view for staff actions
