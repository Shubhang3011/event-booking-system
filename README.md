# Linemate — Event Booking System

A full-stack event booking application: browse cultural events and reserve seats. Built as a
**TypeScript monorepo** with a React + Vite frontend and an Express + MongoDB API.

The product is styled as *"an editorial box-office"* — warm paper, a single vermilion accent,
a numbered **running order** instead of a wall of identical cards, and a perforated **ticket
stub** as the recurring brand object. See [`docs/DESIGN.md`](docs/DESIGN.md) for the full
design rationale.

> **Runs with zero database setup.** If you don't set `MONGO_URI`, the server spins up an
> in-memory MongoDB and seeds it automatically, so `npm install && npm run dev` is all you
> need to see the whole app working.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Demo account](#demo-account)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Design decisions](#design-decisions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Assumptions](#assumptions)

---

## Features

**Required**

- **Authentication** — register, login, logout with a secure mechanism (bcrypt + JWT in an
  httpOnly cookie).
- **Events** — list all events (name, description, date & time, venue, total & available
  seats) and view event details.
- **Bookings** — select an event, choose a number of seats, confirm; view all your bookings;
  cancel a booking, which releases the seats back to inventory.
- **Validation & error handling** — prevents booking more seats than available, validates all
  input, handles invalid requests gracefully, and returns consistent, meaningful errors.

**Enhancements**

- 🔒 **Concurrency-safe booking** — atomic seat reservation that *cannot* oversell, even under
  a flood of simultaneous requests (proven by a load test).
- 🎟️ **Polished, accessible UI** — a custom, non-generic design system; keyboard-navigable,
  screen-reader friendly, with a `prefers-reduced-motion` path.
- 🔎 **Search, filter, sort & pagination** — by text, category, time window, with a list/grid
  toggle and "load more".
- 🧪 **Tests** — 22 backend tests (auth, events, booking lifecycle, concurrency) on an
  in-memory MongoDB.
- 🌙 **Light / dark / system theme** — a polished dark mode (Settings → Appearance) with a
  no-flash theme loader and persisted preference.
- 🔖 **Account features** — save/bookmark events to a personal list, plus profile and password
  management; an account dropdown menu, and About / FAQ / Contact pages with a working contact
  form and newsletter signup.
- 🛡️ **Security hardening** — Helmet, CORS allowlist, rate limiting, NoSQL-injection
  sanitization, payload limits, and env validation that refuses to boot with insecure prod
  config.
- 🚀 **Deployment ready** — Dockerfiles, a one-command `docker compose` full stack, plus
  Render and Vercel configs.
- 📚 **Docs** — this README, an [OpenAPI spec](docs/openapi.yaml) and a
  [Postman collection](docs/Linemate.postman_collection.json).

---

## Tech stack

| Layer    | Choice |
| -------- | ------ |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, React Hook Form + Zod |
| Backend  | Node.js, Express, TypeScript, Mongoose, Zod, JWT, bcrypt |
| Database | MongoDB (with a zero-config in-memory fallback for dev) |
| Tests    | Vitest + Supertest + `mongodb-memory-server` |
| Tooling  | npm workspaces, Docker, ESLint-friendly strict TS |

---

## Project structure

```
.
├── server/                 # Express + Mongoose API
│   ├── src/
│   │   ├── config/         # env validation (Zod)
│   │   ├── db/             # connection + seed
│   │   ├── lib/            # AppError, jwt, cookies, helpers
│   │   ├── middleware/     # auth, validation, errors, rate limit, sanitize
│   │   ├── modules/        # users · auth · events · bookings (model/service/controller/routes/schema)
│   │   ├── routes/         # API router
│   │   ├── app.ts          # Express app (no listen — imported by tests)
│   │   └── index.ts        # bootstrap (connect, seed, listen, graceful shutdown)
│   └── tests/              # Vitest + Supertest
├── web/                    # React + Vite frontend
│   └── src/
│       ├── auth/           # auth context
│       ├── components/     # ui primitives, events, bookings, layout
│       ├── hooks/          # data hooks (TanStack Query)
│       ├── lib/            # api client, types, formatting, design helpers
│       ├── pages/          # Landing, Events, EventDetail, MyBookings, Login, Register
│       └── providers/      # query + toast providers
├── docs/                   # DESIGN.md, openapi.yaml, Postman collection
├── docker-compose.yml      # mongo + api + web, one command
└── package.json            # npm workspaces + root scripts
```

A feature-module layout (`model → service → controller → routes → schema`) keeps each domain
self-contained and the business logic (services) separate from HTTP concerns (controllers).

---

## Quick start

**Prerequisites:** Node.js ≥ 18 (tested on 22) and npm. No database install required.

```bash
# 1. Install all workspaces
npm install

# 2. Run the API + the web app together
npm run dev
```

- API → http://localhost:4000
- Web → http://localhost:5173

On first run with no `MONGO_URI`, the server downloads a MongoDB binary (~one-time), starts it
in-memory, and seeds 12 sample events + a demo user. The Vite dev server proxies `/api` to the
backend, so the auth cookie stays same-origin and everything just works.

> Want persistence? Create `server/.env` from `server/.env.example` and set `MONGO_URI` to a
> local `mongod` or a MongoDB Atlas connection string, then run `npm run seed`.

---

## Demo account

A demo user is seeded automatically (and via `npm run seed`):

| Email | Password |
| --- | --- |
| `demo@linemate.events` | `password123` |

On the sign-in screen there's also a **"Use demo credentials"** button.

---

## Environment variables

### Backend (`server/.env`) — all optional in development

| Variable | Default | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `PORT` | `4000` | API port |
| `MONGO_URI` | _(empty)_ | MongoDB connection string. **Empty → in-memory MongoDB** (dev only). Required in production. |
| `JWT_SECRET` | dev placeholder | Secret for signing JWTs. **Required (≥32 chars) in production.** |
| `JWT_EXPIRES_IN` | `7d` | Session lifetime |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin(s), comma-separated |
| `COOKIE_NAME` | `ebs_token` | Auth cookie name |
| `COOKIE_SECURE` | _(by env)_ | `true`/`false`; defaults to `true` in prod |
| `COOKIE_SAMESITE` | _(by env)_ | `lax`/`strict`/`none`; defaults to `none` in prod |
| `BCRYPT_ROUNDS` | `12` | bcrypt work factor |

### Frontend (`web/.env`)

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | API base URL. Leave blank in dev (Vite proxies `/api`); set to the deployed API origin in production. |

The server **validates its environment on boot** and exits with a clear message if production
config is unsafe (default secret, missing `MONGO_URI`).

---

## Scripts

Run from the repo root:

| Script | What it does |
| --- | --- |
| `npm run dev` | Run API + web together (hot reload) |
| `npm run dev:server` / `npm run dev:web` | Run one side only |
| `npm run build` | Type-check and build both for production |
| `npm run start` | Start the compiled API |
| `npm run seed` | Seed events + demo user (uses `MONGO_URI`) |
| `npm test` | Run the backend test suite |
| `npm run typecheck` | Type-check both workspaces |

---

## API reference

Base URL: `http://localhost:4000/api`. Auth is via an **httpOnly cookie** set on
register/login — send credentials (`withCredentials` / `credentials: 'include'`) on every
request. Full spec: [`docs/openapi.yaml`](docs/openapi.yaml); ready-to-run requests:
[`docs/Linemate.postman_collection.json`](docs/Linemate.postman_collection.json).

**Response envelopes**

```jsonc
// success
{ "data": { /* resource */ } }
// list
{ "data": [ /* … */ ], "pagination": { "page": 1, "limit": 12, "total": 12, "totalPages": 1 } }
// error
{ "error": { "message": "Only 2 seat(s) left for this event", "code": "CONFLICT" } }
```

### Auth

| Method & path | Auth | Body | Description |
| --- | --- | --- | --- |
| `POST /auth/register` | — | `{ name, email, password }` | Create account, set cookie → `201` |
| `POST /auth/login` | — | `{ email, password }` | Log in, set cookie → `200` |
| `POST /auth/logout` | — | — | Clear cookie → `200` |
| `GET /auth/me` | ✅ | — | Current user → `200` |
| `PATCH /auth/profile` | ✅ | `{ name }` | Update display name |
| `PATCH /auth/password` | ✅ | `{ currentPassword, newPassword }` | Change password |

### Events

| Method & path | Auth | Description |
| --- | --- | --- |
| `GET /events` | — | List events. Query: `search`, `category`, `city`, `when` (`upcoming`\|`past`\|`all`), `sort` (`date`\|`-date`\|`seats`\|`-seats`\|`newest`), `page`, `limit`. |
| `GET /events/saved` | ✅ | The current user's bookmarked events |
| `GET /events/:id` | — | Event details |
| `POST /events/:id/save` | ✅ | Bookmark an event |
| `DELETE /events/:id/save` | ✅ | Remove a bookmark |

### Bookings

| Method & path | Auth | Body | Description |
| --- | --- | --- | --- |
| `POST /bookings` | ✅ | `{ eventId, seats }` | Reserve seats (1–10) → `201` |
| `GET /bookings` | ✅ | — | Your bookings. Query: `status` (`CONFIRMED`\|`CANCELLED`\|`all`) |
| `PATCH /bookings/:id/cancel` | ✅ | — | Cancel & release seats → `200` |

### Other

| Method & path | Auth | Body | Description |
| --- | --- | --- | --- |
| `POST /contact` | — | `{ name, email, message }` | Submit a contact message |
| `POST /newsletter` | — | `{ email }` | Subscribe to the newsletter |

### Examples

```bash
# Register (saves the cookie to cookies.txt)
curl -i -c cookies.txt -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com","password":"password123"}'

# Book 2 seats for an event
curl -b cookies.txt -X POST http://localhost:4000/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{"eventId":"<EVENT_ID>","seats":2}'

# Cancel a booking
curl -b cookies.txt -X PATCH http://localhost:4000/api/bookings/<BOOKING_ID>/cancel
```

### Status codes

`200` OK · `201` Created · `400` bad request (e.g. past event) · `401` unauthenticated ·
`403` forbidden (not your booking) · `404` not found · `409` conflict (not enough seats) ·
`422` validation error · `429` rate limited.

---

## Data model

- **User** — `name`, `email` (unique), `passwordHash` (never returned), timestamps.
- **Event** — `title`, `description`, `date`, `venue`, `city`, `category`, `organizer`,
  `totalSeats`, `availableSeats`; derived `status` / `isPast` / `isSoldOut`.
- **Booking** — `user`, `event`, `seats`, `status` (`CONFIRMED`/`CANCELLED`), `bookingCode`
  (e.g. `LM-7Q4K9P`), `cancelledAt`, timestamps.

`availableSeats` is the single source of truth for inventory and is always kept within
`[0, totalSeats]`.

---

## Design decisions

**Why MongoDB + an in-memory fallback.** The spec allows MongoDB. To make the project trivially
runnable for a reviewer, the server starts an in-memory MongoDB and seeds it when `MONGO_URI`
is unset — no install, no Docker required — while still supporting any real MongoDB/Atlas for
persistence.

**Concurrency-safe seat reservation.** Overbooking is prevented with a single **atomic**
`findOneAndUpdate` guarded by `availableSeats >= seats`:

```ts
Event.findOneAndUpdate(
  { _id, availableSeats: { $gte: seats }, date: { $gt: new Date() } },
  { $inc: { availableSeats: -seats } },
  { new: true },
);
```

Because the read, the check and the write happen as one atomic document operation, two
simultaneous requests can never drive the count below zero — at most one wins for the last
seat. This needs **no transaction** (and therefore no replica set), so it behaves identically
on a standalone `mongod`, Atlas, or the in-memory dev DB. If persisting the booking then fails,
the seats are returned (a compensating `$inc`). Cancellation uses the same idea: a
`CONFIRMED → CANCELLED` transition is matched atomically so seats are released **exactly once**,
clamped back to capacity. This is verified by a concurrency test that fires 40 simultaneous
bookings at a 10-seat event and asserts exactly 10 succeed.

**Auth in httpOnly cookies, not localStorage.** The JWT lives in an httpOnly, SameSite cookie,
so it can't be read by JavaScript — mitigating XSS token theft. Passwords are bcrypt-hashed;
login returns the same message for unknown email vs wrong password to avoid account
enumeration.

**Layered backend.** Each domain is a module (`model · service · controller · routes ·
schema`). Services hold business logic and are HTTP-agnostic; controllers stay thin; a central
error handler turns `AppError`s, Zod errors and Mongoose errors into one consistent envelope;
an `asyncHandler` forwards async rejections.

**Validation everywhere.** Zod schemas validate and coerce every body / query / params before
controllers run; parsed input is read from `req.valid` so raw input never reaches the database.

**Typed end-to-end.** Strict TypeScript on both sides; the frontend mirrors the API types and
unwraps the response envelope in one typed API client.

See [`docs/DESIGN.md`](docs/DESIGN.md) for the UI/UX rationale.

---

## Testing

```bash
npm test            # from the repo root
```

22 tests run against an ephemeral in-memory MongoDB:

- **Auth** — register, no-password-hash leak, duplicate email, weak password, login, account
  non-enumeration, `/me` protection, logout.
- **Events** — listing + pagination, derived status, category filter, past-exclusion, search,
  single event, 404/422.
- **Bookings** — auth gating, seat decrement, over-booking prevention, seat validation,
  past-event refusal, per-user isolation, cancel + release, double-cancel, ownership.
- **Concurrency** — 40 racing bookings on 10 seats → exactly 10 succeed; multi-seat races never
  drop below zero.

---

## Deployment

**Docker (full stack, one command):**

```bash
docker compose up --build
# → http://localhost:8080
```

This builds the API, runs MongoDB with a persistent volume, and serves the production frontend
via nginx (which proxies `/api` to the API). Override `JWT_SECRET` for anything real.

**Render** — [`render.yaml`](render.yaml) provisions the API (Docker) + the static frontend.
Set `MONGO_URI` (e.g. MongoDB Atlas) in the dashboard.

**Vercel / Netlify** — deploy `web/` as a static site (`web/vercel.json` includes the SPA
rewrite) and point `VITE_API_URL` at your deployed API; deploy `server/` anywhere that runs
Node/Docker. For cross-site cookies, set `COOKIE_SAMESITE=none` and `COOKIE_SECURE=true` on the
API and list the frontend URL in `CLIENT_ORIGIN`.

---

## Assumptions

- **Seat reservations are free.** The brief covers browsing and booking seats, not payment, so
  bookings are free RSVPs and no payment flow is implemented.
- **No assigned seating.** Seats are a quantity (inventory), not a seat map.
- **A user may book an event more than once** (each booking is independent); seats are capped at
  **10 per booking** as a sensible guard.
- **Cancellation keeps the record** (status `CANCELLED`) rather than deleting it, so history is
  preserved; the seats are returned to the event.
- **Events are seeded, not user-created** — there's no public "create event" endpoint, since the
  brief is about browsing and booking. Admin/organiser tooling would be the natural next step.
- One sample event is intentionally in the past and one is sold out, to exercise those states.

---

Built with care for the Linemate full-stack assessment.
