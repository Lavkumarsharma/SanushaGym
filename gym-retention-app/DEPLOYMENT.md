# Gym Retention App - Complete Deployment Guide

## 📋 Overview

This guide covers deploying all three layers:
1. **Mobile App** (React Native + Expo) → Expo Go / EAS Build
2. **Web Dashboard** (Next.js 14) → Vercel
3. **Backend API** (Node.js + Socket.io) → Render

---

## 🚀 Step 1: Supabase (Database + Auth)

### What to do:
1. Go to: https://supabase.com/
2. Sign up / Log in
3. Click **"New Project"**
4. Project name: `gym-retention`
5. Choose region (closest to India: Mumbai or Singapore)
6. Set database password (save it!)
7. Wait for project to be ready

### Get these keys:
Go to **Project Settings → API** and copy:
- **Project URL** → `https://xxxxx.supabase.co`
- **anon public** key → `eyJ...`
- **service_role** key → `eyJ...` (secret, keep safe)

### Run the schema:
Go to **SQL Editor** in Supabase dashboard, paste the contents of:
```
gym-retention-app/supabase/schema.sql
```
Click **Run** to create all 15 tables and sample data.

---

## 🚀 Step 2: Backend API (Node.js + Socket.io) → Render

### What to do:
1. Go to: https://render.com/
2. Sign up / Log in (free tier available)
3. Click **"New +" → "Web Service"**
4. Connect your GitHub repository
5. Select the `gym-retention-app/backend` folder
6. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
7. Add Environment Variables (from `backend/.env.example`):
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your_service_key
   RESEND_API_KEY=re_your_key
   FRONTEND_URL=https://your-web.vercel.app
   PORT=3001
   ```
8. Click **Create Web Service**

### After deploy:
Render will give you a URL like: `https://gym-retention-backend.onrender.com`
Save this URL — you'll need it for mobile and web.

### Test backend:
Open in browser: `https://your-backend.onrender.com/health`
Should return: `{"status":"ok","timestamp":"..."}`

---

## 🚀 Step 3: Web Dashboard (Next.js) → Vercel

### What to do:
1. Go to: https://vercel.com/
2. Sign up / Log in
3. Click **"Add New → Project"**
4. Import your GitHub repository
5. Select the `gym-retention-app/web` folder
6. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
7. Add Environment Variables (from `web/.env.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```
8. Click **Deploy**

### After deploy:
Vercel will give you a URL like: `https://gym-retention-web.vercel.app`

---

## 🚀 Step 4: Mobile App (React Native + Expo)

### What to do:
1. Copy `.env.example` to `.env`:
   ```bash
   cd gym-retention-app/mobile
   cp .env.example .env
   ```
2. Edit `.env` and replace with your actual values:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   EXPO_PUBLIC_API_URL=https://your-backend.onrender.com
   EXPO_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npx expo start
   ```
5. Install **Expo Go** app on your phone (iOS App Store or Google Play)
6. Scan the QR code from terminal to run on your phone

### For production build (optional):
```bash
npx expo build:android
npx expo build:ios
```
Or use EAS: `npx eas build`

---

## 🚀 Step 4 (alt): Resend (Email Service)

### What to do:
1. Go to: https://resend.com/
2. Sign up / Log in
3. Go to **API Keys** → Create API Key
4. Copy the key (starts with `re_`)
5. Add to backend `.env`:
   ```
   RESEND_API_KEY=re_your_key
   ```
6. Go to **Domains** → Add your domain (or use `resend.dev` for testing)

---

## 🔗 Quick Links Summary

| Service | Link | Purpose |
|---------|------|---------|
| Supabase | https://supabase.com/ | Database + Auth |
| Render | https://render.com/ | Backend API hosting |
| Vercel | https://vercel.com/ | Web dashboard hosting |
| Resend | https://resend.com/ | Transactional emails |
| Expo | https://expo.dev/ | Mobile app build & run |
| GitHub | https://github.com/ | Code repository |

---

## ✅ Deployment Checklist

- [ ] Supabase project created + schema run
- [ ] Supabase keys copied (URL, anon key, service key)
- [ ] Render backend deployed + health check passes
- [ ] Render backend URL copied
- [ ] Vercel web dashboard deployed
- [ ] Resend API key created
- [ ] Mobile `.env` file created with real values
- [ ] Web `.env.local` file created with real values
- [ ] Backend `.env` file created with real values
- [ ] Mobile app runs on phone via Expo Go
- [ ] Web dashboard loads in browser
- [ ] Backend `/health` endpoint returns OK
- [ ] QR check-in works (test with sample data)
- [ ] Payment flow works (simulated)
- [ ] Owner dashboard shows member data

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Set `FRONTEND_URL` in backend env to your Vercel URL |
| Socket not connecting | Check `EXPO_PUBLIC_SOCKET_URL` matches backend URL |
| API 404 | Ensure backend is deployed and URL is correct |
| Supabase auth fails | Run `schema.sql` in Supabase SQL Editor |
| Build fails | Run `npm install` in each folder first |

---

## 📁 Files Created/Modified

```
gym-retention-app/
├── mobile/.env.example              ← Copy to .env and fill values
├── mobile/services/api.ts           ← NEW: REST API client
├── mobile/services/socket.ts        ← UPDATED: Socket.io with backend
├── web/.env.example                 ← Copy to .env.local and fill values
├── web/lib/api.ts                   ← NEW: Web API client
├── backend/.env.example             ← Copy to .env and fill values
└── DEPLOYMENT.md                    ← This file
```
