# Styles

The design system lives in `src/app/globals.css` using the Tailwind CSS v4
`@theme` token layer (colors, fonts, radii, and reusable utilities).

Use this directory for **additional, scoped stylesheets** — for example a
print stylesheet or a heavy third-party component override — and import them
where needed:

```ts
import "@/styles/print.css";
```

Keep global design tokens in `globals.css` so they stay the single source of
truth for the theme.
