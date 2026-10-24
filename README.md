# Ayyappa Padi Pooja — Animated Invitation

A single-page animated invitation. Vite + React 18 + TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis.
Mobile portrait is the primary design; it scales up to desktop.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # type-checks (tsc --noEmit) then builds to dist/
npm run preview    # serve the production build locally
```

## Deploy to Vercel

1. Push this folder to a Git repo and import it at vercel.com/new (framework: Vite, defaults are fine),
   or run `npx vercel --prod` from this folder.
2. `vercel.json` already handles the SPA rewrite, immutable caching for `/assets`, and security headers.
3. **Link previews (WhatsApp / Twitter):** the Open Graph image URL must be absolute. The build uses
   `VERCEL_PROJECT_PRODUCTION_URL` automatically. If you attach a custom domain, set
   `VITE_SITE_URL=https://your-domain.com` in Vercel → Project Settings → Environment Variables and redeploy.
4. If WhatsApp shows a stale preview, re-scrape it at <https://developers.facebook.com/tools/debug/>.

## Editing the invitation

All copy, the date/time and the map link live in [`src/data/event.ts`](src/data/event.ts). Nothing is hardcoded in components.
`startsAt` carries an explicit `+05:30` offset, so the countdown and the `.ics` file are correct on any device time zone.
`durationMinutes` (default 180) is only used for the calendar end time; it is not shown on the invitation.

## Regenerating the favicon and share image

```bash
npm run og
```

Writes `public/favicon.svg`, `public/og.svg`, `public/og.png` (1200×630) and `public/apple-touch-icon.png`
from the same ornament geometry the page uses. Text is outlined from the self-hosted Marcellus font.

## Structure

```
src/
  components/ornaments/   Diya, Padi, Glyph, Divider, Petal, CornerFrame (hand-authored SVG)
  components/             Petals, ProgressRail, Countdown, ActionButtons, icons
  sections/               Hero, Invitation, Ascent, Details, Venue, Closing
  hooks/                  useReducedMotion, useMotion (context)
  data/event.ts           all content
  lib/                    gsap setup, Lenis, theme (dawn) transitions, reveal, ics, share, countdown
```

## Motion notes

- The entry sequence (~3.2 s) plays once per session (`sessionStorage`), and any tap, click, key or scroll skips to the end.
- `prefers-reduced-motion: reduce` disables the entry, smooth scrolling, the pin, petal movement and flame flicker;
  content fades in simply and every lamp is lit.
- The Ascent section is pinned for one screen height at ≥1024px and is a normal-flow scrubbed section below that.
