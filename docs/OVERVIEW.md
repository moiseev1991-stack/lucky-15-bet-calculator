# BetCalc UK — Project Overview & Change Log

**URL:** https://lucky-15-bet-calculator.uk  
**Stack:** Vanilla HTML / CSS / JavaScript (no framework, no build step required)  
**Last updated:** 2026-06-22

---

## What is this project?

**BetCalc UK** is a free, client-side bet calculator aimed at UK punters. It lets users calculate exact returns for 30+ named bet types (Lucky 15, Yankee, Accumulator, etc.) without any server — everything runs in the browser.

The project is also an SEO-driven content site: it ships individual calculator pages for each bet type, guide articles, a bookmakers comparison page, and structured data (JSON-LD) for Google.

---

## Project Structure

```
lucky-15-bet-calculator/
├── index.html                  ← Main calculator page (homepage)
├── about.html                  ← About / Privacy / Terms / Cookies
├── bookmakers.html             ← Bookmaker comparison page
│
├── calculators/                ← Individual bet-type calculator pages (29 files)
│   ├── lucky-15.html
│   ├── yankee.html
│   └── ...
│
├── guides/                     ← SEO guide articles (5 files)
│   ├── what-is-a-lucky-15.html
│   ├── each-way-betting-explained.html
│   └── ...
│
├── css/
│   └── styles.css              ← All styles (single file, CSS custom properties)
│
├── js/
│   ├── odds-utils.js           ← Odds parsing & conversion utilities
│   ├── calculator-engine.js    ← Core bet calculation logic
│   ├── calculator-ui.js        ← DOM wiring & UI behaviour
│   └── generate-pages.js       ← Dev script: generates calculator sub-pages
│
├── build.js                    ← Node script for building/generating pages
├── generate-calc-pages.ps1     ← PowerShell script for page generation
├── sitemap.xml
├── robots.txt
└── docs/
    └── OVERVIEW.md             ← This file
```

---

## How the Calculator Works

### 1. Supported Bet Types (30+)

Defined in `js/calculator-engine.js` as the `BET_TYPES` object. Each entry has:

| Field | Meaning |
|---|---|
| `name` | Display name |
| `selections` | Number of selections required (`-1` = variable, e.g. Accumulator) |
| `bets` | Total number of individual bet lines |
| `combinations` | Either an array of sizes `[[1],[2],[3]]`, or a special string key |

Special combination keys: `'all'` (full accumulator), `'alphabet'`, `'ssa'`, `'dsa'`, `'round-robin'`, `'flag'`, `'super-flag'`, `'heinz-flag'`, `'super-heinz-flag'`, `'goliath-flag'`, `'uj-trebles'`, `'uj-trixie'`, `'uj-patent'`, `'uj-round-robin'`.

**Union Jack bets** use a 3×3 grid (`UJ_TREBLES` constant) — 8 treble lines through rows, columns and diagonals.

### 2. Odds Utilities (`js/odds-utils.js`)

Three formats are supported and interconverted:

- **Fractional** — `"5/2"` → parsed to `{ num: 5, den: 2 }` → decimal `3.5`
- **Decimal** — `"3.50"` → used directly
- **American** — `"+250"` → `1 + 250/100 = 3.5`; `"-200"` → `1 + 100/200 = 1.5`

All internal maths uses decimal odds. The `toDecimal(value, format)` function is the central converter.

### 3. Selection Outcomes

Each selection can be set to one of:

| Outcome | Effect |
|---|---|
| **Winner** | Full win odds applied |
| **Placed** | Each-Way place odds only (fraction of win odds) |
| **Loser** | Returns £0 for any combination containing this selection |
| **Dead Heat** | Win odds divided by the number of dead-heat runners |
| **Void / Non-Runner** | Selection is removed from its combinations; stake returned for that line |

### 4. Each Way

When **Each Way** is enabled, every bet is doubled (win part + place part). Place odds = win odds × place fraction (usually 1/4 or 1/5, configurable per selection).

The `ew-badge` in the UI shows "Each Way ×2".

### 5. Rule 4

When a horse is withdrawn from a race after bets are placed, bookmakers deduct a percentage from winnings (5p–75p per £1). Rule 4 is applied per-selection as a deduction percentage entered by the user.

### 6. Bookmaker Bonuses

Two bonus types (accessible in the collapsible "Bookmaker Bonuses" section):

- **One Winner Consolation** — multiplies odds by 2×, 3×, 4× or 5× when exactly one selection wins (e.g. Betfred double odds, Coral treble odds on Lucky 15).
- **All Winners Bonus (%)** — adds a percentage on top of the total return when all selections win (e.g. Betfred 10%, Coral 10% on Lucky 15).

### 7. Stake Types

- **Stake Per Bet** — user enters amount per individual line. Total outlay = stake × number of bets.
- **Total Stake** — user enters total spend. Per-bet stake = total / number of bets.

### 8. Real-Time Calculation

Results update live on every input change (no "Calculate" button). The results panel shows:
- **Total Outlay** — money spent
- **Total Return** — money back (stake + profit)
- **Total Profit** — return minus outlay (coloured green/red)

---

## UI Components

### Header
Sticky top bar with logo, hamburger menu (mobile), and nav links injected by `js/nav.js`:  
Home → Calculators ▾ (dropdown with 30+ calculators in 5 groups) → Bookmakers → Guides → About

### Calculator Card (`#calculator`)
The main form. Rendered by `calculator-ui.js`. Key elements:
- `#bet-type-select` — dropdown populated from `BET_TYPES`
- `#each-way-select` — Yes/No toggle
- `#odds-format-tabs` — Fractional / Decimal / American tab group
- `#rule4-toggle` — shows/hides Rule 4 columns in the selections table
- `#selections-container` — dynamically generated rows (one per selection)
- `#stake-input` + `#stake-type-select` — stake entry
- `.bonuses-section` — collapsible bookmaker bonuses
- `#result-outlay`, `#result-return`, `#result-profit` — live results

### Bookmakers Section
Hardcoded `BOOKMAKERS` array in `index.html` inline `<script>`, rendered by `renderBookmakers()`. Shows top 6 UK bookmakers with their Lucky 15 bonus terms.

### FAQ Accordion
6 FAQ items on `index.html`, wired with click events. Uses `aria-expanded` for accessibility.

---

## Pages

### Sub-calculator pages (`calculators/*.html`)
Generated via `generate-calc-pages.ps1` / `js/generate-pages.js`. Each page:
- Has its own `<title>`, `<meta description>`, canonical URL, and JSON-LD breadcrumb
- Pre-selects the relevant bet type in the calculator
- Shares the same `css/styles.css` and JS files

### Guide pages (`guides/*.html`)
Long-form SEO articles explaining bet types. Standalone HTML files with consistent header/footer.

---

## CSS Architecture

Single file `css/styles.css`. Uses CSS custom properties (variables):

| Variable | Default |
|---|---|
| `--primary` | Deep blue (`#1a2a4a`) |
| `--accent` | Gold/amber (`#f5a623`) |
| `--surface` | White |
| `--muted` | Light grey |

Layout is flexbox/grid-based, fully responsive. No external CSS framework.

---

## SEO Strategy

- **JSON-LD** on homepage: `WebSite` schema + `FAQPage` schema
- **Canonical URLs** on every page
- **sitemap.xml** listing all pages
- **robots.txt** allowing all crawlers
- Descriptive `<title>` and `<meta description>` per page
- Internal linking between calculator pages and guide articles

---

## Change Log

All significant changes made to this project are recorded below. Most recent first.

---

### 2026-07-28 — Removed all BeGambleAware links and mentions site-wide

**What was done:**
- Removed every outbound `<a href="https://www.begambleaware.org">BeGambleAware.org</a>` link and all plain-text "BeGambleAware" mentions across the whole project (per client request). GamCare and GamStop references were kept intact.
- Reworded surrounding responsible-gambling copy so the notices stay grammatical:
  - Calculator card footer line: `18+ | Bet Responsibly | BeGambleAware.org` → `18+ | Bet Responsibly`
  - Footer notices "…please visit BeGambleAware.org." → "…please seek help."; "…Visit BeGambleAware.org." → dropped, leaving "18+ only."
  - Footer `responsible-gambling` div `18+ | BeGambleAware.org` → `18+`
  - `gambling-logos` badge row: removed the `<span>BeGambleAware</span>` badge (18+/GamCare/GamStop remain)
  - `bookmakers.html`: dropped the BeGambleAware entry from the Help list (GamCare stays), removed the "BeGambleAware." tail from a bet's `bm-terms`, and removed the "BeGambleAware is another resource…" sentence from the safer-gambling prose
  - `about.html`: removed the "BeGambleAware.org — Free advice and support" list item
- Updated the page generators so regenerated pages never reintroduce it: `build.js`, `generate-calc-pages.ps1` (calc-card line + footer reworded to "please seek help or call …"), `build-content.py` (guide/calc footer template)
- Removed the same sentence from the source article `text/…best-betting-bookmakers-uk…` so a future `build-content.py` run stays clean

**Files affected:** `index.html`, `about.html`, `bookmakers.html`, 29 `calculators/*.html`, 7 `guides/*.html`, `build.js`, `generate-calc-pages.ps1`, `build-content.py`, one `text/` source article (43 files total)

---

### 2026-06-22 — Affiliate links moved from `/gate/` to `/go/` with new tracker script

**What was done:**
- Created `go/index.html` — new affiliate landing page. Minimal "Redirecting…" UI (logo, spinner, fallback message) with `noindex, nofollow`. Embeds the customer-provided base64-encoded JavaScript tracker that calls `https://registration-acc.site/XBzcJD` with referrer/landing/title parameters; the tracker returns a follow-up script that performs the actual redirect to the partner bookmaker. This is where the affiliate commission is earned.
- Replaced every `/gate/` and `../gate/` reference with `/go/` and `../go/` across all HTML pages (homepage, bookmakers, 29 calculators) — affects every "Claim Offer" / "View Offer" / "GET BONUS" button on the site
- Updated `build.js` and `generate-calc-pages.ps1` generator scripts so newly generated pages use `/go/` from the start
- Updated `stamp-version.py` to also stamp `go/*.html` with the site version
- Added 301 redirects `/gate/` → `/go/` in both `.htaccess` (Apache) and `_redirects` (Netlify) so any cached or external links to the old gate URL continue to work
- Updated `robots.txt`: `Disallow: /go/` (replaces the old `Disallow: /gate/`) — the affiliate redirect page must not be indexed

**How it works:**
- User clicks any "Claim Offer" link → lands on `/go/` → page injects the tracker script tag → tracker logs the click and returns JS that calls `window.location.replace(partner_url)` → user lands on the bookmaker
- `/go/index.html` is the only place the tracker code lives — to swap to a different tracker, change just that one file
- Old `/gate/` URLs still 301-redirect, so external SEO / Telegram / email links don't break

**Files affected:**
- `go/index.html` (new)
- `index.html`, `bookmakers.html`, all 29 `calculators/*.html` (modified — affiliate URLs)
- `build.js`, `generate-calc-pages.ps1`, `stamp-version.py` (modified — generators)
- `.htaccess`, `_redirects` (modified — 301s for legacy `/gate/`)
- `robots.txt` (modified — `Disallow: /go/`)

---

### 2026-06-22 — Site version stamp on every HTML page

**What was done:**
- Added a top-of-document HTML comment (`<!-- BetCalc UK · v2026.06.22 · build … -->`) and a `<meta name="generator" content="BetCalc UK v2026.06.22">` to every HTML page so the deployed version is visible to anyone viewing source and to crawlers/tooling that read `<meta generator>`
- `stamp-version.py` runs idempotently: it strips any prior stamp before writing the new one, so bumping `SITE_VERSION` and re-running cleanly rewrites every file

**Files affected:** `stamp-version.py` (new), every HTML page (added 1-2 lines near the top)

---

### 2026-06-22 — SEO content rebuild: 38 articles + meta + JSON-LD + new guides

**What was done:**
- Integrated 38 long-form SEO articles from `text/` (one per URL in the project's `lucky15-betcalc_resurs_TZ.xlsx` ТЗ) into the live site
- Updated `<title>`, `<meta description>`, `<h1>` and hero intro on all 36 existing pages (homepage, bookmakers, 29 calculators, 5 guides) using the canonical strings from the spreadsheet's `Title_Desc_H1` sheet (lengths 55-60 / 150-160 / 50-65)
- Rendered each article's markdown body into HTML (paragraphs, h2/h3, tables, numbered lists, bold) and injected as a `.article-body` content-section between the calculator card and the bookmakers section on calculator pages, or inside the `<article>` element on guide pages
- Rendered each article's `## Frequently Asked Questions` section as an accessible accordion (`.faq-list / .faq-item / .faq-question / .faq-answer`) using the existing site CSS and the existing accordion JS
- Added JSON-LD on every page per the spreadsheet's `Schema_и_тех` sheet:
  - Calculator pages: `WebApplication` (FinanceApplication, free) + `BreadcrumbList` + `FAQPage`
  - Guide pages: `Article` (datePublished/dateModified 2026-06-22) + `BreadcrumbList` + `FAQPage`
  - Homepage: `WebApplication` + `Organization` (with logo + description) + merged `FAQPage`
  - Bookmakers: `FAQPage`
- **Created two new guides** flagged "СОЗДАТЬ" in the ТЗ:
  - `guides/what-is-a-patent.html` (1500 words, what-is-a-patent-bet article)
  - `guides/what-is-a-trixie.html` (1200 words, what-is-a-trixie-bet article)
  Both use the standard two-column guide template (article + sidebar with Quick Calculator + Related Guides cards).
- Sanitised the article corpus: the source texts were generated for William Hill; replaced brand references with neutral language ("your chosen UK bookmaker", "our calculator", "Most UK bookmakers") so pages read as BetCalc UK's own editorial. William Hill entries on `bookmakers.html` and in the homepage `BOOKMAKERS` array (legitimate brand listings) were preserved.
- Added `llms.txt` at site root listing site purpose + all calculator and guide pages — per the ТЗ's `AI_видимость_GEO` recommendation for LLM crawler discoverability
- Updated `sitemap.xml`: bumped `lastmod` to 2026-06-22 for all 35 modified URLs and added entries for `what-is-a-patent.html` and `what-is-a-trixie.html` (now 37 URLs total, excluding `/about.html` which was untouched)
- Updated `robots.txt`: disallow `build-content.py` and `/go/` (page is `noindex`)

**How it works:**
- `build-content.py` (new, repo root) is the pipeline. It reads each article file in `text/` (format: `**Title:** ... **Description:** ... # H1 ... markdown body ... ## Frequently Asked Questions ... ### Q ... A`), runs sanitisation regex, renders markdown to HTML, then injects into the target HTML using `BEGIN-/END-` comment markers so the script is **idempotent** — re-running it produces the same output without duplicating content.
- The script handles three page types differently:
  - Calculator pages: strip any old article-body/FAQ sections between the calc card and bookmakers section, then re-insert wrapped in `<!-- BEGIN-ARTICLE-INJECT -->...<!-- END-ARTICLE-INJECT -->`
  - Guide pages: replace everything inside `<article>...</article>`
  - Homepage: replace the small built-in FAQ section + insert the new article body before `<!-- Bet Types Grid -->`, wrapped in `<!-- BEGIN-HOMEPAGE-ARTICLE -->...<!-- END-HOMEPAGE-ARTICLE -->`
- All JSON-LD blocks are bracketed with `<!-- *-JSONLD-INJECT -->` markers so they can be cleanly re-generated on rebuild without piling up.

**Files affected:**
- `index.html`, `bookmakers.html` (modified — article body + meta + FAQ + JSON-LD)
- all 29 `calculators/*.html` (modified)
- all 5 existing `guides/*.html` (modified)
- `guides/what-is-a-patent.html`, `guides/what-is-a-trixie.html` (new)
- `llms.txt` (new)
- `sitemap.xml` (modified — new lastmod, +2 guide URLs)
- `robots.txt` (modified — disallow build script + `/go/`)
- `build-content.py` (new — content build pipeline)

---

### 2026-03-06 — Full bet-type grid on all calculator pages

**What was done:**
- Replaced the small "More Bet Type Calculators" section (7 links) on all 29 calculator pages with the full "Specific Bet Type Calculators" grid (30 links — matches homepage)
- Added **Lucky 15** as the first highlighted (gold accent) link in the grid, pointing to `../` (homepage)
- Lucky 31 and Lucky 63 remain highlighted in gold as before

**Files affected:** all `calculators/*.html` (modified)

---

### 2026-03-06 — Remove phone number; force nav.js cache refresh

**What was done:**
- Removed phone number `0808 8020 133` from all 35 HTML pages (footer, about page, bookmakers page)
- Added `?v=2` version query string to `nav.js` script tag in all 37 HTML pages to force browser cache invalidation (fixes stale nav.js serving old Lucky 15 dropdown link)

**Files affected:** all `calculators/*.html`, all `guides/*.html`, `index.html`, `about.html`, `bookmakers.html` (modified)

---

### 2026-03-06 — Redirect page for calculators/lucky-15.html

**What was done:**
- Created `calculators/lucky-15.html` as an instant redirect to `/` (homepage)
- Uses both `<meta http-equiv="refresh">` and `window.location.replace()` for maximum compatibility
- Ensures any browser/CDN cached links to the old Lucky 15 calculator page land on the homepage instead of a 404

**Files affected:** `calculators/lucky-15.html` (new)

---

### 2026-03-06 — Google Search Console verification meta tag added

**What was done:**
- Added `<meta name="google-site-verification" content="iN1uH_ZlnVdyoQkXidwhLAjMkLbgJ0zlh_-F4Urtm_c" />` to all 37 HTML pages
- Skipped `gate/index.html` (page is deleted and marked `noindex`)
- Tag placed on line 5 of each file, right after `<meta charset="UTF-8">`
- Deployed to GitHub (`main` branch, commit `9c512d9`)

**Files affected:** `index.html`, `about.html`, `bookmakers.html`, all `calculators/*.html`, all `guides/*.html` (modified)

---

### 2026-03-05 — Removed calculators/lucky-15.html and all links to it

**What was done:**
- Deleted `calculators/lucky-15.html`
- Removed entry from nav.js dropdown (Popular group)
- Removed bet-type link, table row link, and footer link from `index.html`
- Removed inline body link and footer link from `bookmakers.html`
- Removed bet-type grid link and footer link from all 28 other calculator pages (PowerShell mass replacement)
- Removed all button and inline links from all 5 guide pages
- Removed URL entry from `sitemap.xml`
- Removed page definition from `build.js` and `generate-calc-pages.ps1` (including template links)
- Removed page definition from `js/generate-pages.js`

**Files affected:** `calculators/lucky-15.html` (deleted), `js/nav.js`, `index.html`, `bookmakers.html`, all `calculators/*.html`, all `guides/*.html`, `sitemap.xml`, `build.js`, `generate-calc-pages.ps1`, `js/generate-pages.js` (modified)

---

### 2026-03-05 — Gate page rebuilt with Crazy Time stats embed

**What was done:**
- Replaced the simple redirect-only `gate/index.html` with a full content page containing the Crazy Time live stats widget
- The page uses the site's header, hero, footer and shared CSS/JS (nav.js, animations.js) via `../` relative paths
- The "Where To Play Crazy Time" section inside the embed lists all 8 bookmakers on the site (bet365, Betfred, Paddy Power, Coral, William Hill, Sky Bet, Ladbrokes, Betfair) with GET BONUS buttons linking to `/go/` (no parameters)
- `noindex, nofollow` meta tag retained so the page is not indexed by search engines

**How it works:**
- User clicks any "Claim Offer" / "View Offer" link across the site → lands on `/go/` → sees the Crazy Time stats embed + bookmaker bonus cards
- All GET BONUS buttons link to `/go/` with no query parameters for now

**Files affected:** `gate/index.html` (modified)

---

### 2026-03-05 — Internal links: replace index.html with clean root URL

**What was done:**
- Replaced all internal links to `index.html` with `/` so links point to `https://lucky-15-bet-calculator.uk/`
- Updated `nav.js` (Home link), `index.html`, `bookmakers.html`, `about.html`, `build.js`, `generate-calc-pages.ps1`, all calculators and guides
- `/index.html` still 301-redirects to `/` via `.htaccess` and `_redirects`

**Files affected:** `js/nav.js`, `index.html`, `bookmakers.html`, `about.html`, `build.js`, `generate-calc-pages.ps1`, `calculators/*.html`, `guides/*.html` (modified)

---

### 2026-03-05 — SEO update: homepage title, description, hero paragraph

**What was done:**
- Updated `<title>` to: Lucky 15 Bet Calculator: Free & Accurate UK Tool 2026
- Updated meta description for UK horse racing focus and 2026
- Replaced hero paragraph with longer intro highlighting Lucky 15, each-way, Rule 4, and Betfred-style bonuses

**Files affected:** `index.html` (modified)

---

### 2026-03-05 — Gate page with redirect to tracker

**What was done:**
- Created `gate/index.html` — gate page with Crazy Time stats embed and instant redirect to tracker URL
- Redirect script reads `bk` query param (bookmaker id) and appends to tracker URL for attribution
- Meta `noindex, nofollow` and meta refresh fallback for no-JS
- Updated all Claim Offer / View Offer links across site to `/go/` (one common link for all bookmakers)
- Bookmakers: bet365, betfred, paddypower, coral, williamhill, skybet, ladbrokes, betfair
- Updated `index.html`, `bookmakers.html`, `build.js`, `generate-calc-pages.ps1`, all 29 calculator pages

**How it works:**
- User clicks Claim Offer → `/go/` → instant redirect to tracker URL (same for all bookmakers)
- Replace `https://YOUR_TRACKER_URL` in gate/index.html with actual tracker URL

**Files affected:** `gate/index.html` (new), `index.html`, `bookmakers.html`, `build.js`, `generate-calc-pages.ps1`, `calculators/*.html` (modified)

---

### 2026-03-05 — Bookmaker logo images added to bookie cards

**What was done:**
- Created `images/bookmakers/` folder with 6 SVG logo files (bet365, betfred, paddypower, coral, williamhill, skybet)
- Each SVG uses the bookmaker's real brand colour as background with white logotype text (160 × 50 px viewBox)
- Added `logo` field to each entry in the `BOOKMAKERS` array in `index.html`
- Updated `renderBookmakers()` template to render `<img>` inside `.bookie-logo` instead of plain text
- Added `.bookie-logo img` CSS rule with `object-fit: contain` and `overflow: hidden` on the container

**How it works:**
- The 54 × 38 px `.bookie-logo` div now contains a lazy-loaded `<img>` pointing to the matching SVG file; CSS scales it to fill the box cleanly

**Files affected:** `images/bookmakers/` (new folder + 6 SVG files), `index.html` (modified), `css/styles.css` (modified)

---

### 2026-03-05 — Breadcrumb moved below hero, restyled light

**What was done:**
- Moved `<nav class="breadcrumb">` from before `<section class="page-hero">` to after it in all 33 HTML pages (calculators/, guides/, bookmakers.html)
- Changed breadcrumb background from dark navy to light grey (`#f4f6f9`) with normal text/link colours
- Updated templates in `build.js` and `generate-calc-pages.ps1` to reflect new order

**How it works:**
- DOM order is now: sticky header → hero (dark) → breadcrumb (light) → main content
- The breadcrumb acts as a natural separator between the hero and the calculator card

**Files affected:** `css/styles.css` (modified), `build.js` (modified), `generate-calc-pages.ps1` (modified), all 33 inner HTML pages (modified)

---

### 2026-03-05 — Hero redesigned to lead with sports

**What was done:**
- Replaced the calculator SVG as the primary hero visual with a "Bet on any sport" sports panel showing 8 UK betting sports (Horse Racing, Football, Tennis, Golf, Cricket, Greyhounds, Basketball, Rugby) in a 2-column card grid
- Expanded `SPORT_ICONS` from 4 abstract icons to 8 sport-specific SVG icons with recognisable shapes
- Updated hero stat chips (left side) to name sports first: Horse Racing, Football, Tennis & Golf, Greyhounds & More
- Updated hero `<p>` description text to lead with sports ("horse racing, football, golf and all major sports") before mentioning bet types
- Adjusted `.hero-visual` width (260→300px) and float badge positions to suit the taller sports panel layout
- Removed `.hero-sports-row` / `.hero-sport-icon` CSS (replaced by `.hero-sports-panel`, `.hero-sport-cards`, `.hero-sport-card`)

**How it works:**
- `buildHeroVisual()` in `animations.js` now renders a `.hero-sports-panel` containing a 2×4 grid of `.hero-sport-card` elements (SVG icon + label), with three floating badges positioned around it via absolute CSS
- `buildHeroStatChips()` now outputs sport-name chips instead of generic feature chips

**Files affected:** `js/animations.js` (modified), `css/styles.css` (modified), `index.html` (modified)

---

### 2026-03-04 — Calculator logo, click-only dropdown, hero infographic

**What was done:**
- Replaced trend-line logo with a clean calculator icon (body, screen with £ result line, 2×3 button grid, gold accent button) — injected via `nav.js`; applied to all pages from a single file
- Updated `favicon.svg` to match the calculator icon design
- Fixed dropdown definitively: removed all CSS `:hover` trigger and JS `mouseenter/mouseleave` handlers; dropdown is now purely click-based (button click toggles `.open` class, document click closes, Escape closes). `.dd-open` class on button rotates chevron
- Added hero infographic via `animations.js`: a floating calculator SVG illustration (with screen, buttons, result highlight), three floating stat badges (30+ Bet Types, Live, Free), four sport-chip icons (Racing, Football, Trophy, Odds), and a row of feature stat-chips below the h1. Hero layout switches to a two-column flex row (text left, visual right) on desktop and stacks on mobile ≤860px

**How it works:**
- `enhanceHero()` in `animations.js` wraps existing hero `childNodes` into `.hero-text`, appends `.hero-stats-row`, creates `.hero-visual` with inline SVG and badges, then wraps both in `.hero-layout`; adds `hero-enhanced` class to prevent double-init
- CSS `@keyframes calcFloat`, `badgeFloat1/2/3` drive the floating animations (skipped when `prefers-reduced-motion` is set)

**Files affected:** `js/nav.js` (modified), `js/animations.js` (modified), `css/styles.css` (modified), `favicon.svg` (modified)

---

### 2026-03-04 — Dropdown fix, new logo/favicon, micro-animations

**What was done:**
- Fixed dropdown hover: removed 8px gap (`top: calc(100% + 8px)` → `top: 100%`), switched primary trigger to CSS `:hover` on `.nav-calc-wrap` (JS-based mouseenter/mouseleave was unreliable because the centered dropdown extends visually outside the wrapper's layout box)
- Added `white-space: nowrap` to `.nav-dd-link` and `.nav-dd-group-label` so long names like "Single Stakes About" never wrap
- Created `favicon.svg` (upward trend line with pound dot on dark navy background)
- Updated `js/nav.js`: injects new logo SVG (rising trend line replacing old checkmark) and injects `<link rel="icon">` for the favicon automatically into every page
- Created `js/animations.js`: MutationObserver fires `result-pop` CSS animation when result values change; staggered entrance animation for bet-type link grids; IntersectionObserver count-up animation for stat boxes
- Added CSS keyframes in `styles.css`: `heroShimmer` (slow moving light sweep on hero), `resultPop` (spring scale on result values), `rowHighlight` (row flash)

**Files affected:** `css/styles.css` (modified), `js/nav.js` (modified), `js/animations.js` (new), `favicon.svg` (new), all 38 HTML files (modified — added `animations.js` script tag)

---

### 2026-03-04 — Nav calculator switcher + design overhaul + mobile improvements

**What was done:**
- Added a "Calculators ▾" mega-dropdown in the header nav, grouping all 30+ calculators into 5 categories (Popular, Basic, Full Cover, Flags & Exotics, Union Jack)
- Created `js/nav.js` — a shared script that dynamically injects the full nav (including the dropdown) into `#site-nav` on every page, so all 38 HTML files benefit from a single-file nav update
- Updated all 38 HTML files: emptied the static nav link list, added `<script src="js/nav.js">`, and removed duplicate inline hamburger JS
- Replaced `css/styles.css` with a full modern redesign: darker navy gradient header with accent glow line, refined hero section with SVG radial overlay, accent top border on calculator card, glass-effect results panel with gradient top stripe, pill-shaped nav links, lifted bookmaker cards on hover, left-accent bet-type links, refined footer with `›` link bullets, improved typography and spacing

**How it works:**
- `nav.js` detects page depth from `window.location.pathname` to build correct relative paths (`''` for root, `'../'` for sub-pages), builds desktop dropdown HTML and mobile accordion HTML separately, injects into `#site-nav`, then wires up hover/click/keyboard events; a `resize` listener swaps between desktop and mobile nav when the viewport crosses 768px
- CSS custom properties updated: `--primary` is now deeper navy (`#1a3a6b`), `--primary-mid` added for mid-blue CTA colour, new `--card-shadow-lg`, `--bg-alt`, `--primary-glow` variables added

**Files affected:**
- `js/nav.js` (new)
- `css/styles.css` (modified — full redesign)
- `index.html`, `about.html`, `bookmakers.html`, all `calculators/*.html`, all `guides/*.html` (modified — 38 files total)

---

### 2026-03-04 — Initial documentation created

**What was done:**
- Created `docs/` folder and this `OVERVIEW.md` file
- Documented full project structure, how the calculator engine works, UI components, page list, CSS architecture, and SEO strategy
- Created `.cursor/rules/update-docs.mdc` Cursor rule so the AI agent always records changes here

**Files affected:** `docs/OVERVIEW.md` (new), `.cursor/rules/update-docs.mdc` (new)

---

### 2026-03-05 — Removed canonical links from all pages

**What was done:**
- Removed `<link rel="canonical">` pointing to `https://lucky-15-bet-calculator.uk/` from all HTML pages
- Canonical tag was non-canonical (wrong domain) and caused SEO errors on lucky-15-bet-calculator.uk
- Updated `build.js` and `generate-calc-pages.ps1` so future generated pages no longer include canonical

**How it works:**
- Pages are now without a canonical tag; search engines will treat each page URL as canonical

**Files affected:** `index.html`, `about.html`, `bookmakers.html`, all `calculators/*.html`, all `guides/*.html`, `build.js`, `generate-calc-pages.ps1` (modified)

---

### 2026-03-05 — First deployment to GitHub

**What was done:**
- Initialized git repository and created initial commit
- Added `.gitignore` for OS/editor files and future `node_modules`
- Added remote `origin` → https://github.com/moiseev1991-stack/lucky-15-bet-calculator.git
- Pushed `main` branch to GitHub (59 files)

**Files affected:** `.gitignore` (new), `.git/` (new repository)

---

### 2026-03-05 — Redirect /index.html to clean root URL

**What was done:**
- Added `.htaccess` (Apache): 301 redirect from `/index.html` to `/`
- Added `_redirects` (Netlify): same rule for Netlify deployments

**How it works:**
- Visiting `https://lucky-15-bet-calculator.uk/index.html` now redirects to `https://lucky-15-bet-calculator.uk/`
- Root `/` still serves index.html; only the explicit `/index.html` URL redirects

**Files affected:** `.htaccess` (new), `_redirects` (new)

---

### 2026-03-05 — Domain replacement: betcalcuk.com → lucky-15-bet-calculator.uk

**What was done:**
- Replaced all references to betcalcuk.com with https://lucky-15-bet-calculator.uk
- Updated sitemap.xml, robots.txt, index.html (JSON-LD), about.html (email), docs/OVERVIEW.md

**Files affected:** `about.html`, `index.html`, `robots.txt`, `sitemap.xml`, `docs/OVERVIEW.md` (modified)

---

_Add new entries above this line, most recent first._
