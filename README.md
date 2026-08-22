# Huella — Frontend

Huella is a web platform that helps people and animals find each other. Users can create reports for lost pets and reports for sighted pets, and browse organizations such as veterinary clinics or help centers on an interactive map. Organizations show up as verified or unverified, so users know which listings have already been reviewed by the Huella team.

Built with React 19, TypeScript, Vite, Tailwind CSS, and Supabase.

- Backend repo: [HuellaDev/backend](https://github.com/HuellaDev/backend)
- API docs (Postman): [View collection](https://documenter.getpostman.com/view/47022693/2sBYArUsef)
- Live app: [huella-kerh.onrender.com](https://huella-kerh.onrender.com)

## Tech stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn-style UI components (`@base-ui/react`)
- **Data fetching:** TanStack Query + Axios
- **Auth:** Supabase Auth
- **Maps:** MapLibre GL / react-map-gl + Turf.js
- **Routing:** React Router
- **PWA:** vite-plugin-pwa (installable app, offline-ready service worker)
- **Notifications:** Web Push

## Requirements

- Node.js 18+
- pnpm
- A Supabase project (same one used by the [backend](https://github.com/HuellaDev/backend))
- The Huella backend running and reachable (locally or deployed)

## Setup

```bash
git clone https://github.com/HuellaDev/frontend.git
cd frontend
pnpm install
cp .env.example .env   # fill in the variables below
pnpm dev
```

Other scripts:

```bash
pnpm build     # Type-check and build for production
pnpm preview   # Preview the production build locally
pnpm lint      # Run oxlint
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (safe to expose in the client). |
| `VITE_API_URL` | Base URL of the Huella backend API (e.g. `http://localhost:3000/api/huella`). |
| `VITE_VAPID_PUBLIC_KEY` | Public VAPID key, must match the backend's `VAPID_PUBLIC_KEY`. |

## Project structure

```
Huella-Frontend-ia/
├── src/
│   ├── pages/        # Route-level pages (map, auth, reports, settings, admin, legal, help center)
│   ├── components/    # Feature components by page/domain, + ui/ (design system)
│   ├── layout/         # App shell / layout
│   ├── router/         # Route definitions + guards (protected, admin)
│   ├── hooks/           # Custom hooks (auth, geolocation, map data, theme, push, etc.)
│   ├── lib/              # API clients (axios), Supabase client, utilities
│   └── types/             # Shared TypeScript types
└── public/                 # Static assets, PWA icons
```

## Main features

- Interactive map with lost/sighting reports, date filters, and search radius.
- Report creation flow for lost or sighted pets, with multi-photo upload.
- Report detail pages with comments and status tracking.
- Directory of organizations (veterinary clinics, help centers) on the map, with verified/unverified status.
- User settings: profile, account info, password, notifications, appearance, account deletion.
- Application flow for an organization to become a listed help center.
- Admin dashboard for organization verification.
- Installable PWA with push notifications.

## Authentication

Handled with Supabase (`supabase.auth`). The Axios client (`src/lib/api.ts`) attaches the session's access token to every request:

```
Authorization: Bearer <access_token>
```

Protected routes are wrapped with `ProtectedRoute` / `AdminRoute` guards (`src/router/guards`).

## Related repositories

- Backend / API: [HuellaDev/backend](https://github.com/HuellaDev/backend)
- Postman documentation: [View collection](https://documenter.getpostman.com/view/47022693/2sBYArUsef)

## License

ISC. See [LICENSE](./LICENSE).
