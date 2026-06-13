# CreativeDox

Marketing & product website for **CreativeDox** — a business software and
automation company. Built as a dark-first SaaS landing experience.

## Tech stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Framework      | Next.js 15 (App Router)                 |
| Language       | TypeScript (strict mode)                |
| Styling        | Tailwind CSS v4 (`@theme` token layer)  |
| Animation      | Framer Motion                           |
| Icons          | Lucide React                            |
| Tooling        | ESLint (flat config) + Prettier         |
| Font           | Inter via `next/font/google`            |

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable               | Required | Description                                          |
| ---------------------- | -------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | ✅       | Canonical origin (no trailing slash). Drives absolute URLs in metadata, sitemap, robots, OG, and JSON-LD. Build-time. |

See `.env.example` for the full list (incl. optional analytics/form placeholders).

## Scripts

| Script                 | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the dev server                 |
| `npm run build`        | Production build                     |
| `npm run start`        | Serve the production build           |
| `npm run lint`         | Run ESLint                           |
| `npm run typecheck`    | Type-check without emitting          |
| `npm run format`       | Format `src/` with Prettier          |
| `npm run format:check` | Verify formatting                    |

## Project structure

```
src/
├── app/                 # App Router: routes, layout, sitemap/robots/manifest
│   ├── services/        # /services + 5 service detail pages
│   ├── solutions/[slug] # 8 product detail pages (SSG)
│   ├── industries/      # /industries + 7 industry pages
│   ├── blog/[slug]      # blog listing + posts
│   ├── pricing, about, contact, book-consultation, login
│   └── privacy-policy, terms-of-service, refund-policy
├── components/
│   ├── ui/              # Primitives: Button, Card, Badge, Container, SectionHeading
│   ├── layout/          # Navbar, Footer, ScrollToTop
│   ├── sections/        # Hero, Stats, Solutions, Testimonials, CTA, …
│   ├── product/ services/ industries/ blog/ legal/   # page-specific sections
│   └── shared/          # Framer Motion reveal/stagger helpers, JsonLd
├── lib/                 # utils (cn), constants, types, structured-data, icons
├── hooks/               # Reusable React hooks (reduced-motion, media-query, …)
└── data/                # solutions, services, industries, products, blog, navigation
```

## Design tokens

Defined once in `src/app/globals.css` via Tailwind v4's `@theme` directive and
consumed as utilities (`bg-background`, `text-foreground`, `border-border`, …).

| Token        | Value     |
| ------------ | --------- |
| `background` | `#09090B` |
| `foreground` | `#FAFAFA` |
| `card`       | `#111113` |
| `border`     | `#27272A` |
| `primary`    | `#3B82F6` |
| `secondary`  | `#8B5CF6` |
| `muted`      | `#71717A` |

To change the theme, edit the `@theme` block — every utility updates from there.

Path alias `@/*` maps to `src/*` (configured in `tsconfig.json`).

## Deployment

Built for Docker on **Coolify** using Next.js standalone output
(`output: "standalone"` in `next.config.ts`). Full instructions, env setup, and
a pre/post-deploy checklist are in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

```bash
# Production-parity run with Docker
NEXT_PUBLIC_SITE_URL=http://localhost:3000 docker compose up --build
```
