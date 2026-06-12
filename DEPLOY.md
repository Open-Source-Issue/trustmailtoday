# Deploying Trustmailtoday to Vercel

This guide takes Trustmailtoday from local dev to a live production deployment.
Work top-to-bottom: set up the external services first, then deploy.

> **Important:** In production the app **requires MongoDB**. Vercel runs each
> request on a potentially different serverless instance, so the in-memory
> fallback store will not work (sessions would vanish between requests). Set
> `MONGODB_URI` before going live.

---

## 0. Prerequisites

- A Vercel account and the project pushed to a Git provider (GitHub/GitLab/Bitbucket)
- A custom domain you control (recommended for real email auth)
- Accounts: Google Cloud, Razorpay, MongoDB Atlas

---

## 1. MongoDB Atlas (persistence)

1. Create a free cluster at <https://www.mongodb.com/atlas>.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → allow Vercel. Simplest is `0.0.0.0/0` (any IP); tighten
   later with Vercel's egress IPs if you need to.
4. **Connect → Drivers** → copy the connection string, e.g.
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. You'll use this as `MONGODB_URI`. The app uses database `Trustmailtoday` by default
   (`MONGODB_DB`).

**Recommended indexes** (run once in Atlas → Collections → `Trustmailtoday.sessions`):

```js
db.sessions.createIndex({ "subscription.id": 1 })
db.sessions.createIndex({ "pendingSubscription.id": 1 })
// Optional: auto-expire stale sessions after 30 days
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
```

---

## 2. Google OAuth (Connect inbox + Gmail send/read)

1. Go to <https://console.cloud.google.com/> and create/select a project.
2. **APIs & Services → Library** → enable the **Gmail API**.
3. **OAuth consent screen**:
   - User type: External
   - Add scopes: `gmail.send`, `gmail.modify`, `userinfo.email`, `openid`
   - Add test users while in "Testing"; submit for **verification** before
     public launch (Gmail restricted scopes require Google review).
4. **Credentials → Create credentials → OAuth client ID → Web application**:
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback` (local)
     - `https://YOUR_DOMAIN/api/auth/google/callback` (production)
5. Copy the **Client ID** and **Client secret**.

---

## 3. Razorpay (subscriptions)

1. <https://dashboard.razorpay.com> → **Settings → API Keys** → generate keys
   (use **Test mode** first).
2. **Subscriptions → Plans** → create a monthly plan for each tier and copy each
   `plan_id`:
   - Pro ₹200/mo → `RAZORPAY_PLAN_PRO`
   - Premium ₹500/mo → `RAZORPAY_PLAN_PREMIUM`
   - Enterprise ₹2000/mo → `RAZORPAY_PLAN_ENTERPRISE`
3. **Settings → Webhooks → Add New Webhook**:
   - URL: `https://YOUR_DOMAIN/api/payment/webhook`
   - Secret: choose one → use it as `RAZORPAY_WEBHOOK_SECRET`
   - Events: `subscription.activated`, `subscription.charged`,
     `subscription.cancelled`, `subscription.completed`, `subscription.halted`
4. The webhook is the source of truth for plan state. The post-checkout
   `/api/payment/verify` only updates the UI immediately.

---

## 4. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (Production,
and Preview if you want previews to work). Mirror them in `.env.local` for local
dev. See `.env.local.example` for the annotated list.

| Variable | Example / Notes |
| --- | --- |
| `MONGODB_URI` | Atlas connection string (**required in prod**) |
| `MONGODB_DB` | `Trustmailtoday` |
| `SESSION_SECRET` | 32+ random bytes: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `APP_BASE_URL` | `https://YOUR_DOMAIN` |
| `GOOGLE_CLIENT_ID` | from step 2 |
| `GOOGLE_CLIENT_SECRET` | from step 2 |
| `GOOGLE_REDIRECT_URI` | `https://YOUR_DOMAIN/api/auth/google/callback` |
| `RAZORPAY_KEY_ID` | live or test key id |
| `RAZORPAY_KEY_SECRET` | matching secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | same key id (exposed to browser by design) |
| `RAZORPAY_WEBHOOK_SECRET` | from step 3 |
| `RAZORPAY_PLAN_PRO` / `_PREMIUM` / `_ENTERPRISE` | plan ids from step 3 |
| `SEED_RECIPIENTS` | *(optional)* comma-separated consenting warmup addresses |

> **Never commit real secrets.** `.gitignore` ignores `.env*` (only
> `.env*.example` templates are committed).

---

## 5. Deploy

### Option A — Vercel Dashboard (recommended)

1. Push the repo to GitHub.
2. <https://vercel.com/new> → **Import** the repo.
3. Framework preset auto-detects **Next.js**. Leave build settings as default
   (`next build`).
4. Add the environment variables from step 4.
5. **Deploy**.
6. Add your custom domain in **Settings → Domains**, then update
   `APP_BASE_URL` and `GOOGLE_REDIRECT_URI` to the final domain and redeploy.

### Option B — Vercel CLI

```bash
npm i -g vercel
cd Trustmailtoday
vercel            # first run links the project (preview)
vercel --prod     # production deploy
```

Set env vars with `vercel env add <NAME> production` (repeat per variable), or
paste them in the dashboard.

---

## 6. Post-deploy verification

- [ ] **Landing page** loads at `https://YOUR_DOMAIN`.
- [ ] **Connect inbox**: click *Start Warmup* → Google consent → lands on
      `/dashboard` showing your email + plan badge.
- [ ] **Warmup**: *Start warmup*, then *Send batch* → a test email arrives in
      your own inbox; the activity log shows `inbox`.
- [ ] **Reputation** gauge and factor breakdown render and update.
- [ ] **Inbox placement check** (Premium): subscribe to Premium in Razorpay
      **Test mode** (card `4111 1111 1111 1111`), then *Run check* → placement +
      SPF/DKIM/DMARC results show.
- [ ] **Email authentication**: enter your sending domain → records + any
      recommended fixes appear.
- [ ] **Billing webhook**: in Razorpay dashboard, confirm the webhook delivered
      `subscription.activated`. The dashboard plan badge should reflect it.

---

## 7. Production notes & hardening

- **Serverless timeouts:** `/api/inbox-check` polls Gmail for delivery and is
  tuned to finish within ~10s (Vercel Hobby cap). On Pro you can raise
  `maxDuration` and `attempts` for reliability.
- **Encrypt refresh tokens at rest.** Tokens are stored in the `sessions`
  document; encrypt `tokens.refresh_token` (e.g. AES-256-GCM with a KMS key)
  before storing for a real launch.
- **Scheduled warmup:** sends are currently triggered from the dashboard. For
  hands-off daily warmup, add a **Vercel Cron** hitting an authenticated
  internal endpoint that iterates active warmups and sends the day's batch.
- **Multi-provider placement:** the inbox check measures the user's own Gmail.
  A competitor-grade seed network (Gmail/Outlook/Yahoo seed mailboxes) can plug
  into `findDeliveredMessage` / `placementFromLabels`.
- **Rate limiting:** add rate limits on `/api/warmup/send` and
  `/api/inbox-check` to prevent abuse.
