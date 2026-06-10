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
npm run dev      # http://localhost:3000
```

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
├── app/                 # App Router entry (layout, page, globals.css, fonts/)
├── components/
│   ├── ui/              # Primitives: Button, Card, Badge, Container, SectionHeading
│   ├── layout/          # Navbar, Footer
│   ├── sections/        # Hero, Stats, Solutions, Products, Testimonials, CTA
│   └── shared/          # Framer Motion reveal/stagger helpers
├── lib/                 # utils (cn), constants, types
├── hooks/               # Reusable React hooks
├── data/                # solutions, products, testimonials, navigation
└── styles/              # Additional scoped stylesheets
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
