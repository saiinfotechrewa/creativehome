# Deployment Guide — CreativeDox

Production deployment via **Docker** on **Coolify** (self-hosted PaaS). The app
is a Next.js 15 App Router site built with `output: "standalone"`, so the
runtime image ships without `node_modules`.

---

## 1. Pre-deploy checklist

Run locally before every deploy:

```bash
npm ci                 # clean install from lockfile
npm run typecheck      # tsc --noEmit — must pass
npm run lint           # next lint — must pass
npm run format:check   # prettier — must pass
npm run build          # next build — must pass, emits .next/standalone
```

- [ ] `typecheck`, `lint`, `format:check`, `build` all green
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real production domain (no trailing slash)
- [ ] `.env*` files are **not** committed (only `.env.example` is)
- [ ] `src/lib/constants.ts` → `SITE_CONFIG` (name, email, phone, address, social
      links) reflects real production values
- [ ] Public assets present in `/public`: `favicon.ico`, `icon.svg`,
      `apple-icon.png`, `og.png`, `logo.png` (referenced by metadata/manifest/JSON-LD)
- [ ] `robots.txt`, `sitemap.xml`, `manifest.webmanifest` resolve after build
- [ ] DNS A/AAAA record points at the Coolify host

---

## 2. Environment variables

Copy `.env.example` → set values in Coolify's **Environment Variables** panel.

| Variable               | Required | Notes                                                  |
| ---------------------- | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | ✅       | Canonical origin. **Build-time** — inlined into bundle |
| `PORT`                 | auto     | Defaults to `3000`                                     |
| `HOSTNAME`             | auto     | `0.0.0.0` so the proxy can reach the container         |
| `NODE_ENV`             | auto     | `production`                                            |

> ⚠️ `NEXT_PUBLIC_*` values are inlined at **build time**. Changing
> `NEXT_PUBLIC_SITE_URL` requires a **rebuild**, not just a restart.

---

## 3. Deploy on Coolify

**Option A — Dockerfile (recommended)**

1. Coolify → **New Resource → Application → Public/Private Git Repository**.
2. Select the repo + branch (`main`).
3. **Build Pack: Dockerfile** (auto-detected from the repo root `Dockerfile`).
4. Add env var `NEXT_PUBLIC_SITE_URL=https://your-domain.com` as a
   **Build Variable** (so it's available during `npm run build`).
5. Set the domain under **Domains**; Coolify provisions HTTPS via Let's Encrypt.
6. **Port: 3000** (the container's exposed port).
7. **Deploy.**

**Option B — Docker Compose**

1. **Build Pack: Docker Compose**, file `docker-compose.yml`.
2. Set `NEXT_PUBLIC_SITE_URL` in the env panel.
3. Deploy.

Coolify auto-redeploys on push when the webhook is enabled.

---

## 4. Local production-parity test

```bash
# With Docker
NEXT_PUBLIC_SITE_URL=http://localhost:3000 docker compose up --build
# → http://localhost:3000

# Without Docker (uses the standalone output)
npm run build
node .next/standalone/server.js
```

---

## 5. Post-deploy verification

- [ ] Homepage loads over HTTPS; no console errors
- [ ] Spot-check routes: `/services`, `/solutions/crm-software`,
      `/industries/retail`, `/pricing`, `/about`, `/contact`,
      `/book-consultation`, `/blog`, a blog post, `/login`, a legal page, a 404
- [ ] Navbar + footer links resolve (no 404s); mobile menu works
- [ ] `https://your-domain.com/sitemap.xml` and `/robots.txt` return correct
      absolute URLs (i.e. `NEXT_PUBLIC_SITE_URL` took effect)
- [ ] OG/Twitter preview renders (test with a link debugger)
- [ ] Lighthouse: Performance / SEO / Accessibility ≥ 90
- [ ] Container healthcheck reports healthy in Coolify

---

## 6. Rollback

Coolify keeps previous deployments — use **Redeploy** on the last known-good
build, or revert the commit and push.

---

## 7. Troubleshooting

| Symptom                          | Cause / Fix                                                            |
| -------------------------------- | --------------------------------------------------------------------- |
| Sitemap/OG show `creativedox.com`| `NEXT_PUBLIC_SITE_URL` not set as a **build** var → rebuild with it    |
| `server.js not found` in image   | `output: "standalone"` missing from `next.config.ts`                  |
| 404 on static assets             | `.next/static` / `public` not copied — check Dockerfile COPY steps    |
| Build OOM on small host          | Give the builder ≥ 2 GB RAM, or build the image in CI and push it     |
| Container restarts / unhealthy   | Healthcheck can't reach `:3000` — confirm `PORT`/`HOSTNAME` envs      |
