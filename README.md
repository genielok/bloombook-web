# Bloombook — Salon & Spa Booking Platform (Frontend)

Bloombook is a booking SaaS for beauty and wellness businesses — hair salons, nail studios, spas, barbershops, and massage studios. It gives customers a way to discover local studios and book appointments online, and gives studio owners an admin dashboard to manage bookings, staff, services, and business settings.

This repository is the **frontend**, built with Next.js. It talks to a separate backend API over REST (configured via `NEXT_PUBLIC_API_URL`); this repo does not own the database.

## What it does

**Client side** (customer-facing)
- Browse and search studios by category (hair, nails, massage, spa, barber), location, and keyword
- View a studio's detail page: services, pricing, business hours, and available time slots
- Book an appointment, review the receipt/line items, and get a confirmation with a booking reference
- Create an account, sign in, and manage bookings from an account area (view, reschedule, cancel)

**Admin side** (studio-facing)
- Sidebar dashboard shell (calendar, bookings, services, staff, settings) built on `shadcn/ui`
- Bookings list and detail view with status handling (confirmed / pending / cancelled)
- Calendar view of scheduled appointments
- Staff management (list, add, edit)
- Service catalog management (create/edit services with category, price, duration)
- Studio settings: account info, business hours, booking policy/rules
- Admin authentication (login/register) separate from client auth

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling / UI:** Tailwind CSS 4, shadcn/ui, Radix UI primitives, `lucide-react` icons
- **Forms & validation:** React Hook Form + Zod
- **Data tables:** TanStack Table
- **Charts:** Recharts
- **Dates:** `date-fns`, `dayjs`, `react-day-picker`
- **Auth:** NextAuth (Google OAuth provider) for the client app, plus a separate cookie-based admin auth flow against the backend API
- **Payments:** Stripe (`stripe`, `@stripe/stripe-js`)
- **State:** Redux Toolkit (client-side app state)
- **API layer:** thin `fetch` wrapper (`src/app/lib/http.ts`) calling a backend REST API — the frontend has no direct database access; `prisma`/`postgres` deps exist for local tooling/reference only

## Project structure

```
src/
├── app/
│   ├── admin/(main)/       # Studio admin dashboard: bookings, calendar, services, staff, settings
│   ├── client/(main)/      # Customer-facing app: explore, studio detail, booking, account
│   ├── client/login/       # Customer sign in / create account
│   ├── api/                # Typed API client functions + DTOs (admins, clients)
│   └── lib/                # Shared frontend utilities (HTTP client, server actions)
├── components/ui/          # shadcn/ui component library
├── hooks/                  # Shared React hooks (e.g. data table hook)
├── lib/                    # Shared helpers
└── auth.ts / auth.config.ts # NextAuth configuration
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires a running backend API reachable at `NEXT_PUBLIC_API_URL` (set in `.env`).

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run check       # typecheck + lint
npm run build        # production build
```
