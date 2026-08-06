# Lumière Parfums — Luxury Perfume E-Commerce

A production-architecture Next.js 15 storefront: 3D product viewer (React
Three Fiber), full Prisma/PostgreSQL data model, Stripe + PayPal checkout,
Auth.js authentication, and an admin dashboard.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Three.js /
React Three Fiber · Framer Motion · Zustand · Prisma · PostgreSQL · Stripe ·
PayPal · Auth.js · Cloudinary

## Getting Started

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, Stripe/PayPal/OAuth keys
npx prisma db push        # create tables from prisma/schema.prisma
npm run db:seed           # load sample brands, products, a coupon, a blog post
npm run dev
```

Visit `http://localhost:3000`. Admin routes (`/admin`) require a user with
`role: ADMIN` — set this directly in the database or via Prisma Studio
(`npm run db:studio`) after registering an account.

## What's real vs. what needs your keys

Every page and API route in this repo is real, working code — not mockups.
What it needs from you to run end-to-end:

| Feature | Needs |
|---|---|
| Database | A Postgres instance (Supabase, Neon, Railway, or local) in `DATABASE_URL` |
| Sign in with Google/GitHub | OAuth app credentials in `.env` |
| Stripe checkout | A Stripe account + webhook pointed at `/api/webhooks/stripe` |
| PayPal checkout | A PayPal developer app (sandbox works out of the box) |
| Product images | Cloudinary account, or swap `next.config.mjs` remote patterns for your own CDN |
| 3D bottle model | The bottle in `components/three/Bottle.tsx` is procedurally generated (lathe geometry) — no external `.glb` file required |

## Project Structure

See `PROJECT_TREE.txt` in this repo for the full file tree.

- `src/app` — routes (App Router): shop, product, cart, checkout, account,
  admin, and all API routes under `app/api`
- `src/components` — `layout/` (nav, footer, cart drawer), `three/` (3D
  bottle + scene), `home/`, `product/`, `shop/`, `admin/`
- `src/lib` — Prisma client, Auth.js config, Stripe client, data helpers
- `src/store` — Zustand stores (cart, wishlist, compare)
- `prisma/schema.prisma` — full data model
- `prisma/seed.ts` — sample data

## Known gaps to fill before shipping

This is a strong foundation, not a finished, audited production app.
Before launch you'll want to:

- Add pagination controls to `/shop` (the API supports `page`/`pageSize`,
  the UI doesn't render page links yet)
- Wire the Stripe Elements / PayPal Buttons SDKs into the checkout UI
  (the API routes that create sessions/orders exist; the client-side
  payment widgets are currently a plain button)
- Build out `/admin/products/[id]` edit forms and image upload via
  Cloudinary's upload widget
- Add rate limiting (e.g. `@upstash/ratelimit`) to public API routes
- Add transactional email templates (order confirmation, shipping update,
  abandoned cart) via Resend
- Run an accessibility and Lighthouse pass once real product photography
  is in place
