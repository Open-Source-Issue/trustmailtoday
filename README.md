# Trustmailtoday 🔥

AI-assisted **email warmup** that builds *real* sender reputation so your emails
land in the inbox, not spam — on a legitimate-deliverability foundation (gradual
volume ramp, real engagement, and proper SPF/DKIM/DMARC), not spam-filter tricks.

> **Approach note:** Trustmailtoday does **not** send fake "mark as not-spam" traffic
> between bot accounts (that gets domains blacklisted and violates provider
> terms). It connects via OAuth, ramps sending gradually, measures real
> placement/authentication signals, and helps you fix what's actually wrong.

## Features

- **Landing page** — Next.js + Tailwind v4 + Framer Motion, responsive.
- **Connect inbox** — Google OAuth 2.0 (no passwords; refresh tokens stay
  server-side).
- **Warmup engine** — 28-day gradual ramp; sends real emails via the Gmail API.
- **Reputation score** — 0–100 from real signals (auth, bounces, complaints,
  placement, engagement, consistency) with a transparent breakdown.
- **Inbox placement check** *(Premium)* — tagged self-test reports Primary /
  Promotions / Spam + SPF/DKIM/DMARC.
- **Email authentication guide** — live DNS lookups + copy-paste fixes.
- **Subscriptions** — Razorpay (Free / Pro ₹200 / Premium ₹500 / Enterprise
  ₹2000) with server-side plan gating and a signed webhook.
- **Persistence** — MongoDB (in-memory fallback for local demo).

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion ·
google-auth-library · razorpay · mongodb

## Local development

```bash
cd Trustmailtoday
npm install
cp .env.local.example .env.local   # then fill in values
npm run dev                        # http://localhost:3000
```

The app runs without any credentials in **demo mode** (OAuth/billing degrade
gracefully, state is in-memory). To exercise real flows, set the relevant
variables in `.env.local` — see `.env.local.example` and **[DEPLOY.md](./DEPLOY.md)**.

```bash
npm run build   # production build
npm start       # serve the production build
```

## Project structure

```
src/
  app/
    page.js                     # landing page
    dashboard/page.js           # connected dashboard
    api/
      auth/google/...           # OAuth initiate + callback + logout
      warmup/{start,send,status}# warmup engine
      reputation/               # reputation score
      inbox-check/              # placement check (Premium)
      auth-check/               # SPF/DKIM/DMARC DNS check
      payment/{subscribe,verify,webhook}  # Razorpay
  components/                   # Navbar, Hero, Features, Pricing, Footer,
                                # WarmupPanel, InboxCheck, AuthSetup, ...
  lib/                          # db, session, google, gmail, dns,
                                # warmup, reputation, plans, razorpay, checkout
```

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for the full Vercel guide: MongoDB Atlas,
Google OAuth, Razorpay plans + webhook, environment variables, and post-deploy
verification.

## Security & ethics

- Passwords are never collected; inbox access is via OAuth with minimal scopes.
- Warmup sends go to your own inbox plus any **consenting** seed addresses you
  configure (`SEED_RECIPIENTS`) — never to non-consenting third parties.
- Webhook signatures and session cookies are verified with timing-safe
  comparisons.
