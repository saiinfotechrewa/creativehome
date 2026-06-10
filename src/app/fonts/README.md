# Local fonts

This project loads **Inter** via `next/font/google` in `src/app/layout.tsx`,
so no font files are required here by default.

To self-host a custom/local font instead, drop the font files (`.woff2`)
into this directory and load them with `next/font/local`:

```ts
import localFont from "next/font/local";

const customFont = localFont({
  src: "./MyFont-Variable.woff2",
  variable: "--font-custom",
  display: "swap",
});
```

Then add `customFont.variable` to the `<html>` className and reference
`var(--font-custom)` from `globals.css`.
