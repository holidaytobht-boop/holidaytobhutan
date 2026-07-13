# Holiday to Bhutan

One **Next.js App Router** app — public website, admin CMS, and API together. MongoDB for data (with JSON file fallback for local dev).

## Quick start

```bash
npm install
cp .env.example .env   # set MONGODB_URI, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev              # http://localhost:3000
```

| URL | What |
|-----|------|
| `/` | Public website |
| `/admin/login` | Admin CMS login |
| `/admin/account` | Change admin email & password |
| `/api/tours` | API (same origin, no separate server) |

---

## Folder structure

```
├── app/                      # Next.js routes (pages + API)
│   ├── (site)/               # Public website
│   │   ├── layout.js         # Navbar + Footer
│   │   ├── page.js           # Home
│   │   ├── about/
│   │   ├── tours/
│   │   ├── destinations/
│   │   └── [categorySlug]/   # /trekking-tours, /cultural-tours, …
│   ├── admin/                # CMS console
│   │   ├── login/
│   │   ├── tours/
│   │   └── …
│   └── api/                  # Route Handlers (backend)
│       ├── tours/
│       ├── destinations/
│       ├── contact/
│       ├── bookings/
│       └── uploads/
│
├── components/
│   ├── site/                 # Public UI (Hero, Navbar, Tours page, …)
│   └── admin/                # Admin UI (Sidebar, modals, forms, …)
│
└── lib/
    ├── api/client.js         # Frontend fetch helper
    ├── server-auth.js        # JWT sessions (httpOnly cookies)
    ├── route.js              # API route wrapper (auth, rate limits)
    ├── db/
    │   ├── connect.js        # MongoDB connection
    │   ├── seed.js           # First-run database seed
    │   └── ensure.js         # Connect + seed on startup
    ├── models/               # Mongoose schemas
    ├── services/             # Business logic (tours, destinations, pages)
    ├── stores/               # JSON file fallback when DB is offline
    ├── seeds/                # Data used to seed MongoDB
    ├── content/              # Static UI fallbacks (rich tour/destination copy)
    ├── security/             # Rate limits, URL validation, CSRF checks
    └── utils/
```

---

## How it works

**No separate Express server.** API routes in `app/api/` call `lib/services/` directly:

```
Browser → /api/tours → lib/route.js → lib/services/tours.js → MongoDB
```

**Pages** in `app/` import UI from `components/`. Same Bootstrap UI as before.

**Data:** MongoDB when connected; `lib/stores/` + `lib/content/` as fallbacks.

---

## Environment

```env
MONGODB_URI=mongodb+srv://...
DB_NAME=holidaytobhutan
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=ChangeThisPassword1!
AUTH_SECRET=long-random-secret-min-32-chars
WEB3FORMS_ACCESS_KEY=...        # or SMTP_USER + SMTP_PASS for email
TRUST_PROXY=true                # set behind nginx/Vercel/load balancer
```

`NEXT_PUBLIC_API_URL` is optional — leave empty to use same-origin `/api`.

## Security

- Set strong `AUTH_SECRET` and `ADMIN_PASSWORD` before deploying to production.
- Admin credentials are hashed on first boot — no plaintext password comparison at login.
- Change admin credentials from **Admin → Account** after first login (invalidates other sessions).
- Production refuses to start with default/weak secrets.
- `/admin/*` routes are protected server-side in middleware (JWT cookie required).
- Login, contact forms, and uploads are rate-limited with persistent storage; failed logins trigger temporary lockout.
- Sessions use httpOnly cookies (24h), strict SameSite in production, and signed JWTs with revocation on password change.
- CMS link fields are validated against safe URL schemes.
- Origin checks on state-changing requests (CSRF mitigation).

## Admin features

- Full CMS for tours, destinations, pages, hero banners, footer
- **Trip Bookings** — edit, status workflow, delete, CSV export
- **Inquiries** — view, status updates, delete, CSV export
- **Traveler Reviews** — editable under Admin → Home Page
- Email notifications for both Contact form and Plan My Trip submissions

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run security unit tests |
| `npm run db:check` | Verify MongoDB connectivity |
| `npm run email:test` | Test contact email config |
