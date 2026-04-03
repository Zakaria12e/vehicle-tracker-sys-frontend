# Trackvio — Frontend

React dashboard for the Trackvio vehicle tracking platform.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 + Radix UI
- **Maps:** Leaflet + react-leaflet
- **Real-time:** Socket.io-client
- **Charts:** Recharts
- **Routing:** React Router v7
- **Animations:** Framer Motion

## Features

- Live vehicle tracking map
- Fleet overview dashboard
- Trip history and playback
- Geofence management
- Alert rules and notifications
- Vehicle immobilization control
- User management
- Statistics and analytics
- Dark / light mode

## Project Structure

```
src/
├── components/       # Shared UI components
├── context/          # Auth context
├── dashboard/        # Dashboard pages
│   ├── alerts/
│   ├── geofences/
│   ├── statistics/
│   ├── tracking/
│   ├── trips/
│   ├── users/
│   └── vehicles/
├── lib/              # Socket.io setup, utilities
├── login/            # Auth pages (login, forgot password)
└── main.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- Trackvio backend running

### Installation

```bash
git clone https://github.com/Zakaria12e/vehicle-tracker-sys-frontend.git
cd vehicle-tracker-sys-frontend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_BASE_URL=http://localhost:5000
```

### Run

```bash
# Development
npm run dev

# Production build
npm run build
```

## Deployment

Deployed on [Vercel](https://vercel.com). Add the environment variables in Vercel's project settings:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api/v1` |
| `VITE_API_BASE_URL` | `https://your-backend.up.railway.app` |
