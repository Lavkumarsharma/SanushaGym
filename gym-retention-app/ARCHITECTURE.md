# Gym Retention App - Tech Stack Implementation

## Architecture

```
┌─────────────────┐     Socket.io      ┌──────────────────┐
│  React Native   │◄───────────────────►│   Node.js API   │
│   (Expo)        │◄───────────────────►│   (Render)      │
│  iOS + Android  │     REST + WS        │  Socket.io Server│
└─────────────────┘                      └──────────────────┘
         │                                      │
         │ Supabase (Postgres + Auth)           │ Resend (Email)
         │                                      │
         ▼                                      ▼
┌─────────────────┐                    ┌──────────────────┐
│  Supabase DB    │                    │    Resend        │
│  (PostgreSQL)   │                    │  (Transactional)   │
└─────────────────┘                    └──────────────────┘
         │
         ▼
┌─────────────────┐
│   Next.js       │◄────── Vercel ──────►│  Admin Dashboard│
│  (Admin Web)    │                      │   (Owner/Staff) │
└─────────────────┘                      └──────────────────┘
```

## Folder Structure

```
gym-retention-app/
├── supabase/
│   └── schema.sql
├── mobile/                 # React Native (Expo)
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login.tsx
│   │   ├── (member)/
│   │   │   ├── index.tsx        # Home
│   │   │   ├── check-in.tsx     # QR Scanner
│   │   │   ├── history.tsx      # Attendance
│   │   │   ├── add-ons.tsx      # Marketplace
│   │   │   ├── renewal.tsx      # Renewal
│   │   │   └── settings.tsx     # Opt-out
│   │   └── _layout.tsx
│   ├── components/
│   │   ├── DaysCounter.tsx
│   │   ├── MembershipCard.tsx
│   │   └── QRScanner.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── socket.ts
│   │   └── payments.ts
│   ├── package.json
│   └── app.json
├── web/                    # Next.js (Vercel)
│   ├── app/
│   │   ├── dashboard/
│   │   ├── red-list/
│   │   ├── follow-ups/
│   │   ├── renewals/
│   │   └── add-ons/
│   ├── components/
│   ├── lib/
│   │   └── supabase.ts
│   ├── package.json
│   └── next.config.js
├── backend/                # Node.js + Socket.io (Render)
│   ├── src/
│   │   ├── index.ts
│   │   ├── socket.ts
│   │   ├── routes/
│   │   └── workers/
│   ├── package.json
│   └── render.yaml
└── README.md
```

## Environment Variables

### Mobile (.env)
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_URL=https://your-api.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://your-api.onrender.com
```

### Web (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
RESEND_API_KEY=your_resend_key
PORT=3001
```
