# Fileno — Free Online Tools

Free, private, browser-based file tools: PDF conversion/compression/merge/split, image
conversion/compression/resize, and HEIC→JPG. Built with Next.js (static export), Tailwind, and
zero backend — every tool processes files on the visitor's device.

"Fileno" is a placeholder brand name so the site could be built with real branding instead of
`TODO`. See **Renaming the site** below — it's a two-minute change.

---

## 1. Run it locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Every tool works locally exactly as it will in production, since
there's no server component to run separately.

## 2. Build for production

```bash
npm run build
```

This does two things:
1. `next build` — compiles the site to a fully static export in `out/` (HTML, CSS, JS — no Node
   server required to host it).
2. `postbuild` — walks the real files in `out/` and regenerates `out/sitemap.xml` from whatever
   actually got built (so it can never drift from the real page list, and automatically skips any
   page marked `noindex`, like the "coming soon" category pages).

## 3. Get a live URL to test on

This project wasn't deployed to a live domain as part of building it — do this part yourself,
it takes under a minute with either option below.

**Fastest — Netlify Drop (no account needed for a quick test):**
1. Run `npm run build`.
2. Go to https://app.netlify.com/drop
3. Drag the `out/` folder onto the page.
4. You get a live `*.netlify.app` URL immediately. Great for the "temporary/test domain" you'd
   use to try the site before pointing a real domain at it.

**For a real deployment with a custom domain (Vercel or Netlify, both have generous free tiers):**
1. Push this project to a GitHub repo.
2. Import it in Vercel or Netlify.
3. Build command: `npm run build` — Output directory: `out`.
4. Both platforms will build and redeploy automatically on every push, and let you attach a
   custom domain for free (they issue the SSL certificate for you).

## 4. Renaming the site

Everything brand-related is in one place:

```js
// lib/site.js
export const SITE = {
  name: 'Fileno',
  domain: 'https://www.fileno.online',
  ...
};
```

Also update the wordmark/color in `components/Logo.jsx` and the sitemap's `SITE_URL` constant in
`scripts/generate-sitemap.mjs`. A few name ideas if you want to move on from "Fileno" — all
short, not tied to a single file type, and reasonably brandable: **Corebit, Snaplet, Kitlyst,
Formix, Quicklet.** Check domain availability and trademark conflicts before committing to one.

## 5. Adding a new tool later

The architecture was built so a new tool doesn't require touching the design system, nav, footer,
or SEO scaffolding:

1. Add one entry to the `TOOLS` array in `lib/site.js` (slug, category, copy, keywords, related
   tools). This one object is the source of truth for the homepage grid, category page, related
   tools interlinking, and the sitemap.
2. Write the processing logic as a small function in `lib/` (see `imageProcessing.js` or
   `pdfTools.js` for the pattern).
3. Build a client component in `components/tools/` for the upload → process → download flow (copy
   the closest existing one as a starting point — most tools follow the same
   idle → ready → processing → done state machine).
4. Create `app/<slug>/page.jsx` using `<ToolPageShell>` (see any existing tool page) — it handles
   breadcrumbs, the ad slots, "how it works," FAQ, and related tools automatically.

Run `npm run build` — the new page is automatically picked up by the sitemap generator.

## 6. Ads

Every ad placement described in the brief exists as a clearly labeled placeholder component in
`components/AdSlot.jsx` (banner, in-content, sidebar, corner notification, post-download popup).
None of them are wired to a real ad network yet. To connect Google AdSense (or another network):

1. Replace the placeholder `<div>` markup inside each exported component in `AdSlot.jsx` with
   your ad unit's `<ins>`/script snippet.
2. Add the AdSense loader script to `app/layout.js`.
3. Update `app/privacy/page.jsx` and `app/cookies/page.jsx` — they currently state plainly that no
   ad network is connected; that copy needs to change once one is.

## 7. Analytics / Search Console

Not connected yet, on purpose (no invented IDs). To add Google Analytics, drop the standard GA4
script tag into `app/layout.js`. To verify Search Console, either add the DNS/HTML-tag method
Google gives you, or drop the meta-tag verification snippet into `app/layout.js`'s `metadata`
export (`verification: { google: '...' }`).

## 8. Known limitations, stated honestly

- **PDF to Word** extracts real text and rebuilds it as an editable `.docx`. It's genuinely good
  for single-column documents (letters, reports, invoices). Multi-column layouts and tables will
  extract but may read out of order — that's disclosed on the tool page itself, same as every
  competitor's fine print. Scanned/image-only PDFs have no text to extract (that's what a future
  OCR tool would solve) — those pages are flagged in the result instead of silently failing.
- **Compress PDF** gets its size reduction by re-rendering each page as an optimized image, the
  same core approach most browser-based compressors use. It's very effective for image-heavy and
  scanned PDFs, but the output's text is no longer selectable. Also disclosed on the tool page.
- Every tool was verified by running `npm run build` (a real production compile) and serving the
  static output locally to confirm every route, meta tag, and piece of server-rendered content is
  correct. The actual in-browser file processing (drag a PDF in, get a smaller one out, etc.)
  could not be exercised end-to-end in the sandbox this was built in, since it has no real
  browser available — test each tool with a real file once it's deployed, before relying on it.

## 9. Security & handling many concurrent users

**Why traffic spikes aren't the risk they'd be on a normal site.** Every tool runs entirely in
each visitor's own browser — there is no shared backend doing the actual file processing, so one
person compressing a 90 MB PDF has zero effect on anyone else's request. What *does* need to
scale is serving the static HTML/CSS/JS files themselves, and that's handled by the hosting
platform's CDN (Vercel or Netlify), which is built for exactly that — serving cached static
assets to a large number of simultaneous visitors is the easy case for a CDN, not the hard one.

What was hardened, concretely:

- **Security headers** (`vercel.json`) — `Content-Security-Policy`, `Strict-Transport-Security`
  (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (+ `frame-ancestors 'none'`
  in the CSP, belt-and-suspenders against clickjacking), and a `Permissions-Policy` that blocks
  camera/mic/geolocation access no tool here needs. These only apply once you're hosted on Vercel
  — headers can't be set on a static export from `next.config.js` itself, since there's no server
  running at request time to attach them.
  - The CSP explicitly avoids the broad `'unsafe-eval'`. It uses `'wasm-unsafe-eval'` instead — a
    narrower, modern directive that allows the WebAssembly compilation the PDF/HEIC libraries need
    without allowing arbitrary `eval()`.
  - **Disclosed limitation:** this CSP was written carefully but could not be exercised in a real
    browser in the sandbox this was built in. Test every tool (especially **HEIC to JPG**, the
    one most likely to hit a CSP restriction via its WASM worker) right after deploying. If
    something breaks, open the browser console — a CSP violation logs exactly which directive
    blocked what, which tells you precisely what to loosen in `vercel.json`.
  - If/when you add Google Analytics or AdSense (see section 6-7), you'll need to add their
    domains to `script-src` and `connect-src` in that same CSP — they will not work with the CSP
    as shipped, on purpose, since a static default has to start restrictive.
- **Enforced upload limits, not just hint text** (`lib/limits.js`) — 25 MB per image, 100 MB per
  PDF, up to 40 files per batch, 300 MB combined per batch. Previously these were just copy on the
  page; now a file that's too large is rejected with a clear message before any processing starts,
  so a huge/malformed upload can't hang a visitor's tab.
- **Error boundaries** (`app/error.jsx`, `app/global-error.jsx`) — if a tool hits an unexpected
  exception (a malformed PDF, an unusual HEIC variant, etc.), the visitor sees a normal-looking
  "Something went wrong, try again" screen instead of a blank or broken page.
- **`poweredByHeader: false`** in `next.config.mjs` — don't advertise the framework in responses.
- **Platform-level DDoS protection is automatic and free** on both Vercel and Netlify — no
  configuration needed. Vercel additionally offers a manual "Attack Challenge Mode" (Project →
  Firewall) you can switch on temporarily if you're ever actively targeted; it's free on every
  plan and shows visitors a quick verification page instead of taking the site down.

**`npm audit` will show 8 findings (some "critical").** Worth knowing so they don't cause alarm:
they're `postcss` (bundled *inside Next.js's own* internal build tooling, only reachable if you
fed it untrusted CSS at build time, which nothing here does) and `tar`/`canvas` (an optional,
Node-only fallback dependency of `pdfjs-dist`). The project's `.npmrc` sets `omit=optional`, so
`canvas` is never actually installed or compiled — confirmed by testing a from-scratch `npm
install` — and it's also excluded from the browser bundle via the `canvas: false` webpack alias in
`next.config.mjs` regardless. `npm audit` still lists it because it reads the full dependency graph
declared in `package-lock.json`, including optional branches that were never installed — that's
normal for any project depending on `pdfjs-dist`, not something specific to this build. Neither
finding is reachable by a visitor to the deployed site.

**Deploying to a platform with a newer Node.js version (24.x and up):** without `omit=optional`,
`npm install` can try to compile that same optional `canvas` package from source — since prebuilt
binaries often lag behind the newest Node releases — and fail without the system libraries (cairo,
pango, etc.) that compilation needs. The `.npmrc` above prevents that from happening at all.

## 10. What's deliberately not built yet

Per the brief's own priority order, breadth was cut before quality. Categories with **no tools
yet are still live routes** (`/qr-tools`, `/text-tools`, `/calculators`) but marked `noindex` so
they don't create thin content in Google, and show a real "coming soon" state rather than a
broken or empty page. Wiring up a new tool there just means following the 4 steps in section 5
above — the categories, nav, and footer links already exist.

The `QR Code Generator` from the original list was swapped out for `Resize Image` after a
competitive check (see the chat that produced this project): the market for "qr code generator"
is dominated by a handful of decade-old sites doing tens of millions of visits a month each, which
is a much tougher first fight than the fragmented, winnable image-resizing space. QR tools are
still a good phase-2 addition — just better approached as a small cluster of long-tail pages
(Wi-Fi QR, vCard QR, URL QR) than one page competing head-on for the broadest term.
#   m i a u  
 #   m i a u  
 #   m i a u  
 #   m i a u  
 