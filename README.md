<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,30&height=220&section=header&text=🌍%20GeoPulse&desc=Real-Time%20Earthquake%20Monitoring%20%26%20Seismic%20Analytics&fontSize=60&fontColor=ffffff&animation=fadeIn" width="100%" alt="GeoPulse banner"/>

**A full-stack, real-time earthquake monitoring platform** — live USGS feeds, interactive 2D/3D globe visualization, deep historical analytics, a Gemini-powered AI assistant, and personalized alerts. One codebase, end to end.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vite.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white&style=for-the-badge)](https://www.mongodb.com)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Globe-000000?logo=threedotjs&logoColor=white&style=for-the-badge)](https://threejs.org)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI_Assistant-8E75FF?logo=googlegemini&logoColor=white&style=for-the-badge)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
[![USGS Data](https://img.shields.io/badge/USGS-FDSN_API-EA574B?style=for-the-badge)](https://earthquake.usgs.gov/fdsnws/event/1/)

</div>

---

## 🎯 Why this project exists

Earthquakes strike without warning, and public seismic data — while freely available from agencies like the USGS — is scattered, raw, and hard for ordinary people to interpret. **GeoPulse turns that raw feed into a single, live, visual command center**:

| 👥 Audience | 💡 What GeoPulse gives them |
|---|---|
| 🏠 **The public** | An at-a-glance dashboard answering *"Is there seismic activity near me right now, and should I be concerned?"* — with a dedicated **Safety Hub** for preparedness guidance and a **Nearby** view for earthquakes close to the user |
| 📊 **Analysts & students** | Deep **historical analytics** — yearly/monthly frequency trends, magnitude & depth distributions, calendar heatmaps, and region-scoped statistics (global 🌐, Pakistan 🇵🇰 boundary-filtered, or any searched location 📍) computed from complete USGS datasets |
| 🤖 **The curious** | **GeoBot** — a Gemini-powered AI assistant embedded in the app that answers questions about earthquakes, safety, and seismic science in context |

The system ingests live USGS data, caches and normalizes it server-side, persists users and alert rules in MongoDB, and renders everything through a polished dark-themed React interface with an animated 3D globe.

---

## ✨ Key Features

### 🔴 Real-time Monitoring
- 📡 **Live earthquake feed** from the USGS FDSN API with magnitude, depth, time, and place filters
- 🔄 **Silent 60-second polling** — the feed stays fresh without flickering or loading spinners
- 🗺️ **Interactive map** (react-leaflet) with magnitude-scaled markers and popups
- 🌍 **3D globe** (react-globe.gl + three.js) plotting seismic events on a rotating Earth

### 📈 Dashboard & Analytics
- 🎛️ **Overview dashboard** — KPI cards, active summary, magnitude distribution charts (recharts)
- 📅 **Historical analytics** — yearly frequency, monthly timelines, calendar-month heatmaps, magnitude/depth distributions, strongest-event and most-active-period summaries
- 🎯 **Region scoping** — global, Pakistan (point-in-polygon boundary filtering against a real geographic boundary), or any geocoded location with radius/bounds filtering
- 🏛️ **Historical explorer & maps** — search decades of earthquakes and visualize them by era and magnitude
- 🔮 **Predictions page** — statistical trend exploration over historical data

### 🛡️ Safety & Alerts
- 🆘 **Safety Hub** — earthquake preparedness instructions and emergency guidance
- 🔔 **Alert rules** — user-defined magnitude/region thresholds persisted per account
- 📍 **Nearby** — earthquakes closest to the user

### 🤖 AI Assistant
- 💬 **GeoBot** — Google Gemini-powered chat with markdown + math (KaTeX) rendering, wired through a dedicated backend chat API

### 🔐 Authentication
- ✉️ Email/password **registration & login** with JWT (24h tokens)
- 🇬 **Google OAuth** flow with server-side callback handling
- ⚡ Session **restore with splash screen** — returning users land directly in the dashboard; expired sessions route cleanly back to login
- 🍃 User accounts stored in **MongoDB**

---

## 🏗️ Architecture

```
🌍 GeoPulse (monorepo)
├── 🖥️ backend/            # Express + TypeScript API server (port 3000)
│   ├── server.ts          # Vite middleware in dev, static SPA in production
│   └── src/
│       ├── routes/        # /api/auth, /api/analytics, /api/chat, /api/earthquakes
│       ├── controllers/   # request handling, validation, error mapping
│       ├── services/      # USGS client, analytics pipeline, Gemini, boundary math
│       │   └── analytics/ # query validation, location resolution, complete-fetch, aggregation
│       ├── database/      # MongoDB connection & collections
│       └── config/        # JWT config
└── 🎨 frontend/           # React 19 + Vite 6 SPA
    └── src/
        ├── app/           # App shell, routing between landing/auth/dashboard
        ├── features/      # feature-sliced domains
        │   ├── auth/      # login, register, Google OAuth, session hook
        │   ├── dashboard/ # overview, feed, map, analytics, historical, alerts, nearby, prediction
        │   └── earthquakes/ # live-data hooks & filtering logic
        ├── components/    # shared UI (navbar, search, GeoBot panel)
        └── styles/        # geopulse.css — central design system
```

**🔀 One server, two modes:** in development the Express server mounts Vite's middleware for HMR; in production the same server serves the built SPA with immutable, year-cached static assets while keeping all API routes live.

---

## 🚀 Engineering Highlights

### ⚡ Performance

| Optimization | Impact |
|---|---|
| 🗄️ **30s TTL cache** on live USGS feed (per filter combo) | ⏱️ measured **1173ms cold → ~0ms warm** |
| 🧠 **60s analytics cache + in-flight dedupe** | 🔁 concurrent identical requests collapse onto **one** upstream fetch |
| 💰 **Request-budget guard** on the complete-fetch pipeline | 🛑 overly broad queries rejected with a clean `400` — the USGS API is never hammered |
| 👻 **Silent polling** | ✨ background refreshes skip loading states — zero UI flicker |
| 📦 **Route-level code splitting** (`React.lazy` on every page) | 🪶 small initial bundle |
| 🌐 **Resize-guarded 3D globe** (`ResizeObserver` dedupe + ref-based intervals) | 🎞️ no render storms on window resize |
| 🏷️ **Stable API error taxonomy** | 🎯 every failure (validation, timeout, USGS outage, geocoding) maps to a distinct status + code |

### 🎨 Resilient, zoom-proof UI
- 📐 Fully responsive from mobile to **300% browser zoom** — fluid `clamp()`/`min()` sizing, viewport-capped globe, internal-scroll cards, wrapping grids: **content never disappears or becomes unreachable**
- 🐛 Root-caused and fixed a **Chromium `backdrop-filter` mis-rasterization bug** that painted blank bands over charts at non-100% zoom, via a resolution-gated guard — glassmorphism design preserved at standard zoom
- 🖥️ **Single-viewport auth screens** — forms fit one screen at 100% zoom while staying readable and accessible at high zoom

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| 🎨 **Frontend** | React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS v4 · Ant Design v6 · Framer Motion · GSAP |
| 🌐 **Visualization** | react-leaflet + Leaflet · react-globe.gl · three.js · @react-three/fiber · recharts |
| 🖥️ **Backend** | Node.js · Express 4 · TypeScript (tsx runtime) · esbuild production bundling |
| 💾 **Data** | USGS FDSN earthquake API (live + historical) · MongoDB 7 |
| 🤖 **AI** | Google Gemini (@google/genai) · react-markdown + remark/rehype (GFM, math) · KaTeX |
| 🔐 **Auth** | JWT (jsonwebtoken) · Google OAuth 2.0 |

---

## 🏁 Getting Started

### 📋 Prerequisites
- ✅ Node.js 20+
- ✅ A MongoDB instance (local or Atlas)
- ✅ API keys: Google OAuth credentials, Gemini API key

### 🔑 Environment variables
Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/geopulse
JWT_SECRET=<your-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
APP_URL=http://localhost:3000
GEMINI_API_KEY=<your-gemini-api-key>
```

### 🏃 Run in development
```bash
npm install
npm run dev        # 🚀 Express + Vite HMR on http://localhost:3000
```

### 📦 Production build
```bash
npm run build      # 🏗️ builds the SPA (Vite) and bundles the server (esbuild)
npm start          # 🌐 serves the built app + API on port 3000
```

### 🔍 Quality checks
```bash
npm run lint       # ✔️ TypeScript type checking (tsc --noEmit)
npm run build      # ✔️ full frontend + backend production build
```

---

## 🔌 API Overview

| Endpoint group | Purpose |
|---|---|
| 🔐 `POST /api/auth/*` | Register, login, session restore (`/me`), logout |
| 🇬 `GET /auth/callback` | Google OAuth redirect handler |
| 📡 `GET /api/earthquakes/*` | Live feed with timeframe/magnitude/limit filters *(30s cache)* |
| 📊 `GET /api/analytics/dashboard` | Historical analytics for a region/date range/location *(60s cache + dedupe)* |
| 🤖 `POST /api/chat` | GeoBot conversation via Gemini |

---

## 🌎 Data Source & Disclaimer

All seismic data is sourced from the **USGS Earthquake Hazards Program FDSN API** 🇺🇸 — GeoPulse respects upstream rate limits through caching, request budgets, and deduplication. Predictive/trend views are statistical explorations of historical data and are **not** operational earthquake forecasts. ⚠️

---

<div align="center">

**💙 Built end to end** — API integration, caching architecture, geospatial filtering, 3D visualization, auth, and a zoom-resilient design system — as a demonstration of full-stack engineering depth.

⭐ If this project interests you, give it a star!

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,30&height=120&section=footer&animation=fadeIn" width="100%" alt="footer wave"/>

</div>
