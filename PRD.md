# PRD: JD Restaurant Digital Menu + Admin Dashboard

**Target tool:** Google Antigravity (agent-driven build)
**Framework:** Next.js (App Router) + TypeScript
**Restaurant:** JD Restaurant, Mini Bazar, Varachha Road, Surat, Gujarat - 395006 (Ph 0261-2556649, Mo 94291 65549)
**Seed data:** `menu-seed.json` (full menu already transcribed from the printed menu; import it as the first database state)

---

## 1. Goal

Replace the printed menu with a QR-scannable digital menu.

1. **Customer Menu** (`/menu`): public, **mobile-first**, view-only, no login, no long scrolling.
2. **Admin Dashboard** (`/admin`): **desktop-first**, password protected. The owner edits the menu and generates a QR code that opens the customer menu.

Out of scope: online ordering, payments, customer accounts, table-wise ordering.

**Quality bar:** Redis caching, search-engine ready, Lighthouse mobile 95+ / 100 / 95+ / 100, secure and monitored. See sections 10-13.

---

## 2. Hard Constraints (from the client)

| # | Constraint | How to meet it |
|---|-----------|----------------|
| C1 | Two separate dashboards | `/menu` (customer) and `/admin/*` (owner) with separate layouts |
| C2 | Customer menu is **mobile view** | Designed for 360-430px wide. On desktop browsers, show the menu in a centered 430px column, do not stretch it |
| C3 | Admin is **desktop view** | Designed for 1280px+ wide. Below 1024px show a plain message: "Please open the admin on a desktop or laptop" |
| C4 | **Avoid long scrolling in the menu** | See section 4.2. The menu never scrolls as one long page |
| C5 | **No AI-generated-looking design** | See section 3. Follow the restaurant's own printed menu style |
| C6 | Next.js | App Router, Route Handlers for API, no separate backend |
| C7 | Simple category header; language switch at the **top** | Section 4.1: short-name tabs, a category sheet, a side drawer, and a switch in the top bar |
| C8 | Redis, SEO, Lighthouse and production quality | Sections 10-13 |

---

## 3. Visual Direction (v2: rich, but still this restaurant's own look)

The design must feel like holding JD Restaurant's real menu: a **maroon leather-bound binder with laminated cream pages, green frames and ribbon headers**. Rich in detail and motion, but every detail comes from the real menu, not from a generic template.

### 3.1 Brand tokens
- Green `#1B6B3A` (ribbons, frames), deep green `#124A28` (pressed/shadow), maroon `#8E1B22` (prices, stamps), binder maroon `#5E0F18`, cream paper `#FBF1EC`, laminate white `#FFFFFF`, ink `#1E1E1E`, antique gold `#C9A24B` (binder corner caps only). Sample real colors from the photos and adjust.
- Fonts (max 3): a bold old-style serif for ribbon titles (e.g. Playfair Display or Abril Fatface), a clean humanist sans for items (e.g. Mukta, which also supports Gujarati well), and Noto Sans Gujarati for Gujarati text. Self-host with `next/font`.

### 3.2 Signature elements (build all of these)
1. **Binder frame:** the whole mobile screen sits inside a maroon leather-textured border with small gold metal corner caps, exactly like the physical menu holder. Subtle stitched/embossed texture via a tiled CSS/SVG pattern.
2. **Laminated page:** cream paper with a faint paper grain and a thin glossy highlight along one edge. Content panel is white with the rounded green outline frame from the print.
3. **Cover screen:** the first screen shows the printed cover: "Enjoy the Taste", "Welcome", the JD circular badge with palm leaves, restaurant name and address. Tap or swipe up to "open the menu". Plays a short page-open animation.
4. **Food line-art watermark:** the print has pale outline doodles (burger, sandwich, hot dog, fries) behind the text. Recreate these as hand-built SVG line art at about 6% opacity behind each page, different doodle per category. Original drawings only, no stock or AI-generated images.
5. **Ribbon headers:** green ribbon with folded back-ends and a notched tip (like "SP. PUNJABI" in the print), serif title in white, Gujarati title in a second smaller ribbon beside or under it. Subtle fold shadow, nothing else.
6. **Item rows:** veg symbol (green-bordered square with dot) before each name, name, dotted leader, price in maroon with a small rupee mark. Gujarati name below in lighter ink. Alternate rows have a very faint cream tint for scanability.
7. **Stamps:** small round maroon rubber-stamp badges for "Chef's Special", "Popular", "New", slightly rotated (-6deg), distressed edge via SVG filter. Set from admin.
8. **Category icons:** a consistent set of about 16 custom two-color line icons (1.5px stroke, green + maroon accent): bowl, spring roll, dosa, naan, biryani pot, glass, ice cream cone, pizza slice, etc. Shown beside the ribbon title on each page and in the admin category list, **not** in the header tabs (those stay text-only). Draw as inline SVGs in `components/icons/`. Do not use emoji.
9. **Combo cards (Party Menu):** each combo is a card shaped like a ticket with a perforated edge and a large maroon price, the included dishes listed with checkmark dots. Add a simple SVG thali plate illustration for the Gujarati Thali.
10. **Optional dish photos:** if the admin uploads a photo for an item, show a 56px rounded thumbnail on the row; tap to enlarge. If no photo, show nothing (no placeholder images).

### 3.3 Navigation design (still no long scrolling)
- **Header:** two slim rows (see 4.1): menu button + brand + language switch + search + info, then one row of short plain-text category tabs with a sliding green underline and a pinned "All" button. Categories can be reached three ways: tabs, the All sheet, or the side drawer. No tile grid, no icons in the tabs.
- **Page turn:** swiping between item pages uses a short slide with slight 3D tilt (about 6deg) and a moving shade, like turning a laminated page. About 250ms, ease-out. Provide `prefers-reduced-motion` fallback (plain fade).
- **Bottom:** only the page dots / "2 / 5" indicator.
- **Press feedback:** tiny scale press (0.97) on tap; no bouncing, no confetti.

### 3.4 Motion and polish rules
- One consistent easing and duration scale (150 / 250 / 400ms). Animate only transform and opacity.
- Skeleton states shaped like ribbon + rows, not generic grey bars.
- Safe-area insets respected (notch phones). Minimum tap target 44px.
- Contrast: maroon on cream and white on green must meet WCAG AA.

### 3.5 Banned (these read as AI-generated)
- Purple/blue gradients, glassmorphism, neon glow, blurred blobs
- Emoji as icons, generic gradient cards, stock or AI-generated food photos
- Generic hero taglines, shadow-lg on every card, default shadcn/MUI look
- More than the three listed fonts, or colors outside the token list

---

## 4. Customer Menu (`/menu`) - Mobile

### 4.1 Header (simple, always visible)

**Row 1 - top bar (about 52px)**
- Left: **menu button** (three lines, opens the side drawer), then the JD round badge + "JD Restaurant" wordmark.
- Right: **language switch**, then search icon, then info "i" icon.

**Language switch (at the top)**
- A compact pill switch with two labels, **EN** and **ગુજ**, and a sliding green knob. Tap anywhere on the pill to flip.
- Implement as an accessible switch (`role="switch"`, `aria-checked`, label "Gujarati"), 44px tap target, keyboard operable.
- **Language lives in the URL** so each language can be indexed: English at `/menu/...`, Gujarati at `/gu/menu/...` (see section 11). Flipping the switch navigates to the same category in the other language and saves the choice in a `lang` cookie. On a later visit to an unprefixed URL, a saved Gujarati choice redirects to `/gu/...`. Never redirect based on the browser language header or IP. Default is English. If a name has no Gujarati version, show the English one.
- It translates everything on screen: tabs, category sheet, drawer, item names, buttons, notices.

**Row 2 - category tabs (about 44px)**
- One row of **short plain-text tab names** (`shortNameEn` / `shortNameGu`, for example "Chinese" instead of "House of Dragon - Chinese", "Punjabi" instead of "Sp. Punjabi"). No icons, no pills, no second row.
- Active tab: green bold text with a 2px green underline that slides to the new tab. Inactive: ink text.
- The tabs scroll sideways with a soft cream fade on the left edge. The active tab auto-scrolls into view when you swipe pages and cross into the next category.
- A **pinned "All" button** (text "All" + small down arrow) sits at the right end of the row and does not scroll with the tabs. It opens the category sheet.
- Tapping a tab jumps to that category's first page.

**Category sheet (opened by "All")**
- A bottom sheet in the laminated white style with a green ribbon title "Categories" (and Gujarati).
- **Two-column grid** of all categories using the short names, each with a small item count; the current category is highlighted green. 16 categories fit as 8 rows of 44px, so the sheet needs no scrolling on a 360x640 phone.
- Tap a category: closes the sheet and jumps to it. Close with the X, a tap on the dimmed background, or by swiping down.

**Side drawer (opened by the menu button)**
- Slides in from the left (about 80% width) over a dimmed background. Same cream paper and green ribbon look.
- Shows categories **by group** using their full names: Starters & Sides, Main Course, Chinese & Fast Food, South Indian, Drinks & Desserts, and Party Menu. Groups are collapsible: only one group is open at a time, so the drawer fits the screen without scrolling.
- Bottom of the drawer: restaurant address, tap-to-call phone numbers (0261-2556649 and 94291 65549), and the "pure milk paneer / FSSAI" line.
- Close by tapping the dimmed background, swiping left, or pressing the X. Opening the drawer or sheet never changes the current page until a category is chosen.

**Info sheet ("i")**
- Holds the notices from the printed menu (20 minutes preparation, no cancellation, parcel charge extra, 5% GST extra) in the selected language.

### 4.2 No-long-scroll layout (core requirement)

The page is a **fixed-height app screen** (`100dvh`): header on top, item page in the middle, page dots at the bottom. The browser page itself never scrolls.

1. **One category at a time:** only the selected category's items are on screen.
2. **Pagination and page filling (no empty gaps):** the layout is computed at runtime (`ResizeObserver`), never hard-coded.
   - Measure the free height `H` between the category ribbon and the bottom area (note strip + page dots).
   - Minimum row height 44px (56px if rows have a photo or a second line). Rows that fit per page = `floor(H / minRowHeight)`, clamped to 5-12.
   - **Balanced pages:** `pages = ceil(items / rowsThatFit)`, then spread items evenly so page sizes differ by at most 1 (13 items with room for 10 becomes 7 + 6, never 10 + 3 or 8 + 5). Avoid a last page with fewer than 3 items.
   - **Stretch to fill:** rows on a page share the free height equally (`flex: 1`), capped at 64px per row (72px with a photo). Item name and price scale slightly with row height (15-17px). All pages of a category use the same row height, taken from the fullest page, so the layout does not jump between pages.
   - If rows hit the cap and space is still left (short categories such as Soups), the leftover space goes to the **note strip** and the line-art watermark, not to an empty gap.
   - The user **swipes left/right** (or taps Next/Prev arrows) to move between pages. Dots or "2 / 5" indicator at the bottom.
   - **Note strip:** a slim strip pinned at the bottom of every item page, above the dots. It shows the category's own note if set (for example "Extra butter Rs. 5/-" on Tandoor), otherwise the default "5% GST extra - Parcel charge extra" (Gujarati when the switch is on).
3. Swiping past the last page of a category moves to the first page of the next category (and updates the active tab). Swiping back works the same way.
4. **Search:** tapping the search icon opens a full-screen overlay with an input; results paginate the same way (max about 8 per page). No infinite list.
5. Long categories such as Sp. Punjabi (41 items) become about 5 swipeable pages instead of a long scroll.
6. Party Menu combos render as large ticket cards (Punjabi Rs. 325, Gujarati Thali Rs. 225) with their included items listed; each fits on one page.

Acceptance: on a 360x640 device, no vertical page scroll exists anywhere in `/menu` (search overlay included).

### 4.3 Item row
`[veg] Name ............ Rs. 260`
- Row height comes from the page layout in 4.2, not a fixed value.
- **Optional second line** (smaller, lighter ink): the one-line description if the item has one; otherwise the other-language name when the **"Show both languages on rows"** setting is on (English name with Gujarati below, or the reverse in Gujarati mode). Off by default.
- Optional stamp badge, optional photo thumbnail (tap to enlarge).
- A "Sold out" item is greyed with the price struck through. Hidden items do not appear.
- Rows are view-only: no buttons to add or order.

### 4.4 Performance
Caching, SEO and the performance budgets are specified in sections 10-12. Short version: the menu pages are statically generated and served from the CDN, menu data comes from Redis when it has to be rebuilt, the menu route ships under 100 KB of JavaScript, and Lighthouse mobile targets are 95+ / 100 / 95+ / 100.

---

## 5. Admin Dashboard (`/admin`) - Desktop

### 5.1 Auth
- `/admin/login`: single owner password, stored only as a hash in the `ADMIN_PASSWORD_HASH` env var (argon2id or bcrypt), compared in constant time.
- On success, set a signed, httpOnly, secure session cookie (use `jose`, 7-day expiry). Middleware protects every `/admin/*` route and every write API.
- Rate-limit login with Redis (5 attempts per 10 minutes per IP, then a growing lockout). See 10.4 and 13.1.
- Logout button in the sidebar.

### 5.2 Layout
Fixed left sidebar (about 240px) with: **Menu**, **QR Code**, **Restaurant Info**, **Preview**. Main area is a wide work surface. Same green/maroon/cream palette as the menu, but plainer: tables, thin borders, no decoration.

### 5.3 Menu management (`/admin/menu`)
Two-pane desktop layout:
- **Left pane:** list of categories. Add, rename (full name, short tab name, group and optional page note, English + Gujarati), delete (with confirm), drag to reorder, show/hide toggle, item count.
- **Right pane:** table of items for the selected category with columns: drag handle, Name (EN), Name (GU), Price, Available toggle, Visible toggle, Actions (edit/delete).
  - **Inline edit** for name and price (click, type, Enter to save, Esc to cancel).
  - "Add item" row at the top of the table.
  - Drag to reorder items.
  - Bulk actions: mark selected as sold out, hide, delete, change price by % or by Rs.
  - Search box to filter items across the whole menu.
- Every save shows a small toast; failed saves keep the edit open with an error.
- **Preview** button opens `/menu` in a phone-sized frame beside the editor so the owner sees changes immediately.
- Undo for the last delete (soft delete for 10 seconds).

### 5.4 QR Code (`/admin/qr`)
- Shows the public URL (`NEXT_PUBLIC_SITE_URL + /menu`), editable in settings.
- Generates a QR code live using the `qrcode` npm package (high error correction level `H`).
- Options: size (256 / 512 / 1024 px), foreground color (default green `#1B6B3A`), optionally center the JD logo (keep error correction H so it still scans).
- Buttons: **Download PNG**, **Download SVG**, **Print table card**.
- **Print table card:** a print-optimised page (A5 / A6) with restaurant name, QR, "Scan to view our menu" in English and Gujarati, and the phone number. Use `@media print` CSS.
- Test hint: "Scan with your phone camera to check".

### 5.5 Restaurant info (`/admin/settings`)
Edit name, tagline, address, phones, notices (EN + GU), pure-milk-paneer banner text, site URL, logo upload, **"Show both languages on rows"** switch.

### 5.6 Admin dashboard home (`/admin`) - added in v2
- Landing page with summary tiles: total categories, total items, sold-out count, hidden count, "last edited" time. Below: a "needs attention" list (items with price 0, missing Gujarati name, duplicate names).
- Quick actions: Add item, Mark sold out, Open QR page, Open live menu.
- Visual style: same binder palette as the menu (maroon sidebar with gold accents, cream work area, green ribbon section titles) so the admin feels like the same product. Data tables stay dense and plain for speed.

### 5.7 Extra editor controls - added in v2
- Per category: pick an icon from the icon set and the doodle watermark.
- Per item: optional photo upload (WebP conversion, max 300 KB), stamp badge (None / Chef's Special / Popular / New), veg flag (default on), Gujarati description.
- **Live phone preview** shows the real menu component in a binder-framed phone mock and updates as the owner types.
- QR page: choose between 3 print-card templates (table tent, A5 poster, small sticker) in the binder/green style.

### 5.8 Backup, change history and stats (admin)
- **Export / Import:** download the whole menu as JSON (same shape as `menu-seed.json`) or CSV; import a JSON file with a preview of what will change before applying. Keep a weekly reminder banner "Last export: 12 days ago".
- **Change history:** every create, edit, delete, reorder and setting change is written to an audit log (who, what, when, before and after). A "Recent changes" page lists them with a **Revert** button per change.
- **Stats tiles** on the admin home (from the Redis counters in 10.5): page views for the last 7 days, **QR scans** (visits that came from the QR link), and the most viewed categories. Counts only, no personal data.

---

## 6. Data Model

Use **Prisma**. SQLite for local dev, **Postgres (Neon or Supabase)** for production deployment on Vercel (Vercel's filesystem is read-only, so do not store data in JSON files in production).

```
Restaurant   id, name, tagline, address, phone, mobile, banner, siteUrl, logoUrl, showBothLanguages (default false),
             metaDescription?, openingHours? (JSON), geoLat?, geoLng?, mapsUrl?, fssaiNo?,
             priceRange? (e.g. "INR INR"), sameAs? (JSON list of profile URLs)
Notice       id, restaurantId, textEn, textGu, sort
Category     id, slug (unique), nameEn, nameGu, shortNameEn, shortNameGu, groupEn, groupGu,
             note?, noteGu?, kind ("list" | "combo"), iconKey, sort, visible, createdAt, updatedAt
Item         id, categoryId, nameEn, nameGu?, description?, descriptionGu?, price (Int, rupees),
             imageUrl?, badge? ("SPECIAL" | "POPULAR" | "NEW"), isVeg (default true),
             sort, available, visible, createdAt, updatedAt
AuditLog     id, action ("CREATE" | "UPDATE" | "DELETE" | "REORDER" | "SETTINGS"),
             entity, entityId, before (JSON?), after (JSON?), createdAt
```

- `sort` is an integer; reorder writes new sort values in one transaction.
- Prices are whole rupees (Int).
- `prisma/seed.ts` reads `menu-seed.json` and creates everything. Fields starting with `_` in the JSON (like `_verify_with_owner`) are ignored by the seed.

---

## 7. Routes and API

| Route | Type | Notes |
|-------|------|-------|
| `/` | redirect | to `/menu` |
| `/menu`, `/menu/[category]` | public page | mobile menu; every category has its own crawlable URL |
| `/gu/menu`, `/gu/menu/[category]` | public page | Gujarati version (hreflang pair) |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | generated | SEO and "Add to Home Screen" |
| `/opengraph-image` | generated | social share preview image |
| `GET /api/health` | public | DB + Redis status for the uptime monitor (no secrets) |
| `POST /api/stats` | public, rate-limited | tiny beacon that increments view counters in Redis |
| `/admin/login` | page | |
| `/admin` | page | home: menu counts, needs-attention list |
| `/admin/menu` | page | menu editor |
| `/admin/qr` | page | QR generator |
| `/admin/settings` | page | restaurant info |
| `GET /api/menu` | public | full menu JSON (cached) |
| `POST /api/auth/login`, `POST /api/auth/logout` | | |
| `POST/PATCH/DELETE /api/admin/categories[/id]` | protected | |
| `POST/PATCH/DELETE /api/admin/items[/id]` | protected | |
| `POST /api/admin/reorder` | protected | body: `{type, ids[]}` |
| `PATCH /api/admin/settings` | protected | |
| `GET /api/admin/export`, `POST /api/admin/import` | protected | menu backup and restore |
| `GET /api/admin/audit`, `POST /api/admin/audit/[id]/revert` | protected | change history and revert |
| `GET /api/admin/stats` | protected | counters for the admin home |

Validate all bodies with `zod`. After any write call `revalidateTag("menu")`.

---

## 8. Suggested Structure

```
app/
  [lang]/menu/[[...category]]/page.tsx   # /menu, /menu/sp-punjabi, /gu/menu/sp-punjabi
  sitemap.ts  robots.ts  manifest.ts  opengraph-image.tsx
  not-found.tsx  error.tsx  global-error.tsx
  admin/(auth)/login/page.tsx
  admin/(dashboard)/layout.tsx      sidebar + auth check
  admin/(dashboard)/menu/page.tsx
  admin/(dashboard)/qr/page.tsx
  admin/(dashboard)/settings/page.tsx
  api/...
components/
  menu/  Header, LangSwitch, CategoryTabs, CategorySheet, CategoryDrawer, ItemPage, Pager,
         SearchOverlay, InfoSheet
  admin/ CategoryList, ItemTable, InlineEdit, QrPanel, PrintCard
lib/  db.ts, redis.ts, cache.ts, ratelimit.ts, stats.ts, auth.ts, schemas.ts,
      paginate.ts, i18n.ts, seo.ts (metadata + JSON-LD), env.ts (validated env)
middleware (or `proxy` in newer Next.js): locale rewrite, security headers, admin guard
tests/  unit/, e2e/ (Playwright), lighthouserc.json
prisma/ schema.prisma, seed.ts
menu-seed.json
```

`paginate.ts` implements the page-filling algorithm in section 4.2: measure free height at runtime (ResizeObserver), compute rows per page, balance page sizes, and return the row height so rows stretch to fill the page. Keep it a pure function with unit tests (for example 13 items / room for 10 = pages of 7 and 6).

---

## 9. Tech Choices

- Next.js (latest stable), React, TypeScript, App Router
- Styling: Tailwind CSS with the colors above defined as theme tokens, or CSS Modules. No component library that brings its own look (no default shadcn/MUI theme left untouched).
- Drag and drop: `@dnd-kit/core` (admin only)
- QR: `qrcode`
- **Redis:** Upstash Redis (available through the Vercel Marketplace) with `@upstash/redis` and `@upstash/ratelimit`; a local Redis container for development behind the same `lib/redis.ts` interface
- Images: `sharp` (re-encode to WebP, strip metadata); file storage on Vercel Blob or Cloudflare R2 (not local disk)
- Password hashing: argon2id (`@node-rs/argon2`) or `bcryptjs`
- Monitoring: Sentry (errors), an uptime monitor on `/api/health`, Vercel Analytics or similar cookieless analytics (optional)
- Testing: Vitest, Playwright, `@axe-core/playwright`, Lighthouse CI (`@lhci/cli`)
- CI/CD: GitHub Actions + Vercel preview deployments
- Auth: `jose`
- DB: Prisma + SQLite (dev) / Postgres (prod)
- Fonts: self-hosted via `next/font`

---

## 10. Caching with Redis

Redis is a **cache and counter store**. The database (Postgres) stays the single source of truth for the menu.

### 10.1 What Redis is used for
1. **Menu cache:** the whole menu as one JSON document (about 20-30 KB) so rebuilding a page or answering `GET /api/menu` does not query the database every time.
2. **Cache versioning and invalidation:** one version counter so a menu edit invalidates everything at once.
3. **Rate limiting and login lockout:** shared across serverless instances (in-memory counters do not work on Vercel).
4. **Counters for stats:** page views, QR scans, category views (section 10.5).
5. **Session revocation:** a short deny-list so "Log out" really ends a session.

### 10.2 Keys

| Key | Value | TTL |
|-----|-------|-----|
| `menu:version` | integer, `INCR` on every admin write | none |
| `menu:v{N}:json` | full menu JSON for version N | 24 hours |
| `menu:v{N}:etag` | hash of the JSON, used for `ETag` / 304 | 24 hours |
| `menu:stale` | last good menu JSON (copy), used if the DB fails | none |
| `menu:lock` | rebuild lock (`SET NX EX 10`) | 10 seconds |
| `rl:login:{ip}` | failed login counter | 10 minutes |
| `lock:login:{ip}` | lockout flag with growing duration | 15 minutes up to 24 hours |
| `rl:stats:{ip}` | beacon rate limit | 1 minute |
| `sess:revoked:{jti}` | revoked session id | until token expiry |
| `stats:views:{YYYY-MM-DD}` | integer | 90 days |
| `stats:scans:{YYYY-MM-DD}` | integer | 90 days |
| `stats:cat:{YYYY-MM-DD}` | hash: category slug to count | 90 days |

### 10.3 Read and write paths
- **Read:** CDN / Next.js static cache first. On a miss, read `menu:v{N}:json` from Redis; on a Redis miss, take `menu:lock`, load from the database, write the key and `menu:stale`, release the lock. Callers that do not get the lock wait about 100 ms and retry, or serve `menu:stale`.
- **Write (admin save):** DB transaction, then `INCR menu:version`, then delete old keys, then call Next.js `revalidateTag("menu")` and `revalidatePath` for `/menu`, `/gu/menu`, every category page and the sitemap (check the exact signatures in the installed Next.js version).
- **HTTP caching:** `GET /api/menu` sends `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600` and an `ETag`. The customer pages are statically generated, so most QR scans never touch Redis or the database.
- **Stale-if-error:** if the database is down, serve `menu:stale` with a short `s-maxage` and log the incident.

### 10.4 Failure behaviour
- Redis down: the **menu cache fails open** (read the database directly, skip the cache, log it). The **login limiter falls back to a stricter in-memory limit** per instance. Stats counters are dropped silently.
- Never put the Redis URL or token in a `NEXT_PUBLIC_` variable. Use TLS. Use separate Redis databases for production and preview.

### 10.5 Stats counters
- A tiny client beacon (`POST /api/stats`, sent after the page loads, no cookies, no IP stored) increments `views`, `cat` and, when the URL has `?src=qr`, `scans`. The QR codes generated in admin always include `?src=qr`.
- Filter obvious bots by user agent. Only counts are stored, so no consent banner is needed.
- Losing the counters (for example after a Redis reset) is acceptable; nothing else depends on them.
- Check the provider's free-tier command limits; if traffic grows, sample or batch the counters.

---

## 11. SEO

Goal: people searching "JD Restaurant Surat menu", "pure veg restaurant Varachha" or a dish name should find the menu, and Google should understand it.

### 11.1 Crawlable by design (the fixed-screen UI must not hide content)
- **Server-rendered HTML:** every item of the current category (name, price, Gujarati name) is in the initial HTML, even though the UI shows it page by page. Pagination is done with CSS (scroll-snap or transforms) and JavaScript only refines it. Hiding items in a client-only component is not allowed.
- **One URL per category:** `/menu/sp-punjabi`, `/menu/chinese`, and so on, with `/menu` showing the first category. Tabs, the category sheet and the drawer are **real `<a href>` links**, so crawlers can follow them. Tapping a tab updates the URL without a full reload; swiping between pages inside a category does not change the URL.
- Semantic HTML: one `<h1>` per page (the category name), items in a `<ul>`, landmarks (`header`, `nav`, `main`, `footer`).

### 11.2 Languages
- `/menu/...` (English) and `/gu/menu/...` (Gujarati), `<html lang="en">` / `<html lang="gu">`.
- `hreflang` alternates for `en`, `gu` and `x-default` (English) on every page, set with the Next.js metadata `alternates.languages` option.
- Self-referencing `canonical` on every page. Parameters such as `?src=qr` are not part of the canonical URL.

### 11.3 Metadata

| Page | Title (max about 60 chars) | Description (max about 155 chars) |
|------|----------------------------|------------------------------------|
| `/menu` | JD Restaurant Menu - Pure Veg, Varachha Road, Surat | Punjabi, Chinese, South Indian and Gujarati thali, with prices. Pure veg restaurant at Mini Bazar, Varachha Road, Surat. |
| `/menu/[category]` | {Category} Menu and Prices - JD Restaurant Surat | {Category} at JD Restaurant, Varachha Road, Surat: {first 3 dishes} and more, with prices. |
| `/gu/...` | Same templates in Gujarati | Same templates in Gujarati |

- Generated from data with `generateMetadata`; the owner can override the site description in Restaurant Info.
- Open Graph and Twitter cards on every page; `/opengraph-image` (1200x630) generated with `ImageResponse` from the brand colors, name and address. Text and flat shapes only, no stock or AI-generated pictures.
- `theme-color` = green `#1B6B3A`; favicon, `apple-touch-icon` and a `manifest.webmanifest` (name, short name, standalone display, 192 and 512 icons) so the menu can be added to the home screen. Logo file needed (open question 1).

### 11.4 Structured data (JSON-LD)
- `Restaurant` on every page: name, address (PostalAddress: Mini Bazar, Varachha Road, Surat, Gujarat 395006), telephone, `servesCuisine` (Punjabi, Chinese, South Indian, Gujarati), `priceRange`, `openingHoursSpecification`, `geo`, `hasMap`, `sameAs`, `image`, `url`, `hasMenu`.
- `Menu` > `MenuSection` > `MenuItem` for the current category: name, `offers` (`Offer` with `price`, `priceCurrency: "INR"`), `suitableForDiet: VegetarianDiet`.
- Serialize JSON-LD safely (escape `<` as `\u003c`). Values come from the database, never typed twice. Validate in Google's Rich Results Test and the Schema Markup Validator. Google has no special menu result, so the benefit is understanding and local search, not a guaranteed rich result.

### 11.5 Sitemap, robots, indexing rules
- `app/sitemap.ts`: all public category URLs in English and Gujarati with `alternates` and `lastModified` from the database `updatedAt`.
- `app/robots.ts`: allow everything public, `Disallow: /admin` and `/api`, and point to the sitemap.
- Admin pages send `noindex, nofollow` (meta and `X-Robots-Tag`). Missing pages return a real 404 status.
- One canonical host (with or without `www`), HTTPS only, no duplicate trailing-slash URLs.

### 11.6 Local SEO checklist (owner and launch tasks)
- Add the menu URL to the Google Business Profile and to Instagram / Facebook bios.
- Keep name, address and phone identical to the Google Business Profile.
- Verify the site in Google Search Console and Bing Webmaster Tools, submit the sitemap, and check "Core Web Vitals" and "Pages" reports a week after launch.
- Print the QR with the final domain only (a changed URL means reprinting).

---

## 12. Performance and Lighthouse

### 12.1 Targets (production build, Lighthouse mobile, simulated slow 4G, mid-range phone)

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 95+ |
| Lighthouse SEO | 100 |
| LCP | 2.0 s or less (Google "good" is 2.5 s) |
| INP | 200 ms or less |
| CLS | 0.05 or less (Google "good" is 0.1) |
| TBT | 150 ms or less |
| TTFB (CDN cached) | under 600 ms |

Admin pages are not held to the Performance target (keep it at 85+), but Accessibility and Best Practices stay at 95+.

### 12.2 Budgets for the customer menu route (enforced in CI)
- JavaScript 100 KB gzip or less on first load, CSS 30 KB or less, fonts 80 KB or less in total, about 15 requests or less, first load under 300 KB excluding dish photos.
- No animation or UI library for things CSS can do. Swipe uses scroll-snap or a tiny gesture handler.

### 12.3 How to get there
- **Static first:** category pages are statically generated and revalidated on demand (section 10), served from the CDN in the Mumbai region; no database call on a normal scan.
- **Fonts:** `next/font` self-hosted, `display: swap`, font fallback size adjustment, **subsets** (Latin and Gujarati), at most 2 weights per family. Gujarati text appears in the ribbons even in English mode, so keep the Gujarati font small (one variable file or 2 weights).
- **No layout shift:** the page is a fixed `100dvh` screen, header heights are fixed, images have width and height, and the first server render already shows the first page of items with the same row positions as after hydration. Suggested technique: size rows with CSS first (for example rows-per-page from `round()` / container units) and let JavaScript only confirm. CLS is checked in CI.
- **Images:** `next/image`, WebP or AVIF, explicit sizes, lazy loading, thumbnails around 56 px with a 2x source. Doodles, binder texture and icons are inline SVG or small CSS patterns, not large PNGs.
- **JavaScript:** server components by default; client components only for tabs, swipe, switch, sheet and drawer; code-split search, the drawer and the info sheet; no heavy dependencies on the public route.
- **Network:** Brotli, immutable caching for hashed assets, `stale-while-revalidate` for HTML and the API, no third-party scripts on the customer menu (analytics is cookieless and tiny or server-side).
- **Low-end phones:** animate only transform and opacity, honor `prefers-reduced-motion`, avoid large box-shadows and filters on scrolling layers.
- **Offline (nice to have):** a small service worker (Serwist) that caches the shell and the last menu so it still opens with poor signal.

### 12.4 Measuring
- **Lighthouse CI** (`lighthouserc.json`) runs in GitHub Actions on `/menu`, `/menu/sp-punjabi` and `/gu/menu` (3 runs each, median), with assertions for the scores and metrics above. A failing assertion fails the pull request.
- Run Lighthouse only on a production build; check one real mid-range Android phone on mobile data before launch.
- After launch watch field data in Search Console (Core Web Vitals) and PageSpeed Insights.

---

## 13. Security, Accessibility, Reliability and Quality

### 13.1 Security
- **Auth:** hashed password only (argon2id or bcrypt), signed httpOnly + Secure + SameSite=Strict session cookie, 7-day expiry, logout revokes the session in Redis. Login lockout grows after repeated failures (section 10).
- **CSRF:** SameSite=Strict plus an `Origin` check on every admin mutation; admin APIs accept JSON only.
- **Headers on every response:** `Strict-Transport-Security` (1 year, includeSubDomains), `Content-Security-Policy` (default-src 'self'; script-src with a nonce; img-src 'self' data: plus the image storage host; frame-ancestors 'self' so the admin preview can embed `/menu`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation off).
- **Input:** `zod` on every body, Prisma for queries (no raw SQL), React escaping, no `dangerouslySetInnerHTML` except JSON-LD that is serialized safely.
- **Uploads:** accept PNG, JPEG, WebP only, check file signature (not just the extension or MIME type), maximum 5 MB, re-encode with `sharp` to WebP (this strips EXIF and location data), random file names, store in object storage.
- **Secrets:** environment variables only, `.env` git-ignored, `.env.example` committed, env validated at boot with `zod`, nothing secret in `NEXT_PUBLIC_`.
- **Dependencies:** lockfile committed, Dependabot (or Renovate), `npm audit` in CI.
- **Audit log:** every admin change is recorded (section 5.8).

### 13.2 Accessibility (WCAG 2.1 AA, Lighthouse 100)
- Landmarks and one `<h1>` per page; `lang="gu"` on Gujarati text inside English pages.
- Tabs are links with `aria-current="page"`; the category sheet and drawer are `role="dialog"` with `aria-modal`, focus trap, Escape to close, and focus returned to the button that opened them.
- The language control is a proper switch (`role="switch"`, `aria-checked`); page changes are announced politely ("Page 2 of 5"); swipe always has a button alternative.
- Contrast checked for every color pair (maroon on cream, white on green, green on white); gold is decorative only.
- Tap targets 44 px or larger; visible focus rings; text still readable and not clipped at 200% browser text size (the page-filling algorithm in 4.2 must re-flow); pinch zoom is never disabled; `prefers-reduced-motion` respected.

### 13.3 Reliability and operations
- **Health and monitoring:** `/api/health` (DB and Redis), an uptime monitor with alerts to the owner or developer, Sentry for client and server errors (personal data scrubbed), structured server logs.
- **Error pages:** branded `not-found`, `error` and `global-error` pages; empty states in admin.
- **Resilience:** stale-if-error menu (section 10.3); the menu never shows a blank screen because of a cache failure.
- **Backups:** automatic database backups (point-in-time recovery if the provider offers it) plus the admin JSON export; a documented restore step.
- **Environments:** local, preview (per pull request) and production, each with its own database and Redis; seed data only for local and preview; production is seeded once.
- **Region:** Vercel functions in Mumbai (`bom1`), database and Redis in a nearby region (for example AWS ap-south-1), because the customers and staff are in Surat.
- **Domain:** custom domain with HTTPS, one canonical host, DNS documented in the README.

### 13.4 Testing and CI/CD
- **Unit (Vitest):** `paginate.ts` (for example 13 items with room for 10 gives pages of 7 and 6), i18n helpers, JSON-LD and sitemap builders, price formatting, cache key and version logic.
- **End to end (Playwright)** on 360x640, 390x844, 412x915 and 1440x900, English and Gujarati: no vertical page scroll on `/menu`; unused page space under 10%; tab, sheet and drawer navigation updates the URL; the language switch keeps the category; every seed item and price appears; admin login, edit, reorder, hide, sold-out, QR download, export and import; an edit shows on `/menu` within 5 seconds; login lockout; unauthenticated admin access is rejected.
- **Accessibility:** `@axe-core/playwright` on every page, zero serious or critical violations.
- **Visual regression:** screenshots of the cover, a menu page, the sheet, the drawer and the admin menu editor.
- **SEO checks in CI:** fetch pages without JavaScript and assert that all items, the `<h1>`, canonical, hreflang and JSON-LD are present; assert that `/admin` is `noindex`.
- **Pipeline (GitHub Actions):** install, lint, typecheck, unit tests, build, Playwright, Lighthouse CI; Vercel preview per pull request; main is deployed only when all checks pass.

### 13.5 Browser and device support
- Android Chrome and Samsung Internet (last 3 years of versions), iOS Safari 15.4 and later, current desktop Chrome, Edge, Firefox and Safari. Use `100dvh` with a `100vh` fallback, safe-area insets, and progressive enhancement for newer CSS.
- Must stay usable on a low-end Android phone (2 GB RAM) and on slow mobile data (menu readable within about 4 seconds).

### 13.6 Legal and content
- Show the **FSSAI license number** and the "pure milk paneer / FSSAI approved ingredients" line in the info sheet (number needed from the owner).
- Keep "5% GST extra" and "parcel charge extra" visible on every page (the note strip in 4.2).
- Vegetarian symbol follows the standard green square-and-dot mark.
- No personal data is collected; the only cookies are the language preference and the admin session, plus cookieless counters. If forms, analytics or ordering are added later, add a privacy notice and review consent rules (India's DPDP Act, 2023).
- Use only dish photos and logos the owner owns; the chosen fonts must have open licenses (Google Fonts are OFL).

---

## 14. Acceptance Criteria

1. Seeding loads all 16 categories and about 190 items from `menu-seed.json`.
2. `/menu` at 360x640: no vertical page scroll; categories switch by tab; items paginate by swipe; every item and price matches the seed.
3. `/menu` on a desktop browser: a centered 430px column, not stretched.
4. Menu shows the cover screen, binder frame, laminated page texture, ribbon headers, line-art watermark, stamps and category icons from section 3.2, and none of the banned styles in 3.5.
4a. Header has two slim rows: top bar with the menu button on the left and the **EN / ગુજ switch at the top right**, then short plain-text category tabs with a pinned "All" button. Tab names are short enough to read in full, "All" opens a two-column category sheet that fits 360x640 without scrolling, and the menu button opens a grouped drawer that also fits without scrolling. Switching language updates every label instantly and persists after refresh.
4b. Page-turn animation works at 360x640 with no vertical page scroll.
5. Admin requires login; unauthenticated requests to `/admin/*` and write APIs are rejected.
6. Admin can add, edit, delete, reorder, hide, and mark sold-out for categories and items; changes show on `/menu` within 5 seconds of saving.
7. QR page generates a scannable code for the menu URL, downloads PNG and SVG, and prints a table card.
8. Admin on a screen narrower than 1024px shows the desktop-only message.
9. Lighthouse mobile (production build, throttled) on `/menu`, a category page and `/gu/menu`: Performance 95+, Accessibility 100, Best Practices 95+, SEO 100. Core Web Vitals within the budgets in section 12.
10. All interactive elements are keyboard accessible in admin; text contrast meets WCAG AA.
11. Pages are filled: at 360x640, 390x844 and 412x915, unused vertical space on any item page (above the note strip) is under 10% of the page area, and rows never exceed the 64px cap.
12. Pages are balanced: within a category, page item counts differ by at most 1, and no last page has fewer than 3 items unless the whole category does.
13. Every item page shows the bottom note strip (category note or the default GST / parcel line). Turning on "Show both languages on rows" adds the second line and the page re-flows without overflow.
14. Redis: after an admin save, the new menu is visible on `/menu` within 5 seconds; with Redis stopped the menu still loads from the database (fail-open) and the login limiter falls back to a stricter in-memory limit.
15. SEO: each category has its own URL, title, description, canonical and hreflang; `/sitemap.xml` and `/robots.txt` are correct; JSON-LD validates in the Rich Results Test and Schema Markup Validator; `/admin` and `/api` are not indexable.
16. All menu items of the current category are present in the server-rendered HTML (checked with `curl`, JavaScript off).
17. Performance budgets in section 12 are enforced in CI; a pull request that breaks them fails.
18. Security: required headers from 13.1 are present on every response; login brute-force lockout works; uploads reject non-images and oversized files.
19. `/api/health` reports DB and Redis status; Sentry receives a test error; branded 404 and 500 pages show.
20. The Playwright suite (360x640, 390x844, 412x915, 1440x900; English and Gujarati) passes with zero serious or critical axe violations.

---

## 15. Build Order (for Antigravity agents)

1. Scaffold Next.js + TS + Tailwind; theme tokens, fonts, validated env (`lib/env.ts`), ESLint, Vitest, Playwright, GitHub Actions skeleton.
2. Prisma schema, migration, seed script from `menu-seed.json`.
3. Redis adapter (`lib/redis.ts`), menu read-through cache with versioned keys and invalidation (section 10), `GET /api/menu`, `GET /api/health`.
4. Public menu: `[lang]/menu/[[...category]]` server-rendered pages, tabs as real links, swipe pagination, page-filling algorithm with unit tests.
5. Polish menu visuals against the printed menu photos; EN/GU switch with URL locales, category sheet and side drawer, info sheet, search.
6. SEO: metadata, canonical, hreflang, sitemap, robots, JSON-LD, Open Graph image, manifest, icons (section 11).
7. Auth (hashed password, session cookie, middleware guard, Redis rate limit and lockout).
8. Admin layout and category/item CRUD with inline edit and reordering; audit log; cache invalidation on every write.
9. Live preview pane, QR page (generate, download, print card), settings page, desktop-only guard.
10. Backup/export/import, change history with revert, Redis stats counters and admin stats tiles.
11. Security headers and CSP, upload pipeline, error pages, Sentry, uptime check.
12. Performance pass against the budgets (section 12), Lighthouse CI, axe and Playwright suites (360x640, 390x844, 412x915, 1440x900; EN and GU).
13. Deploy to Vercel (Mumbai region) with Postgres and Redis in a nearby region; set the custom domain; submit the sitemap to Google Search Console and Bing Webmaster Tools; add the menu link to the Google Business Profile.

---

## 16. Environment Variables

```
DATABASE_URL=
UPSTASH_REDIS_REST_URL=      # or REDIS_URL for a local container
UPSTASH_REDIS_REST_TOKEN=
ADMIN_PASSWORD_HASH=         # argon2id / bcrypt hash, never the plain password
SESSION_SECRET=              # 32+ random characters
NEXT_PUBLIC_SITE_URL=        # final domain, e.g. https://menu.jdrestaurant.in
BLOB_READ_WRITE_TOKEN=       # or S3 / R2 credentials for image uploads
SENTRY_DSN=
GOOGLE_SITE_VERIFICATION=    # Search Console verification token
```

---

## 17. Open Questions for the Owner

1. Logo file (PNG/SVG) for the QR center and menu header?
2. Confirm unclear prices flagged in `menu-seed.json` under `_verify_with_owner`.
3. Gujarati names are included only at category level in the seed; should they be added for every item?
4. Final domain for the QR code (the QR must be reprinted if the URL changes).
5. Confirm the short tab names and group names in `menu-seed.json` (especially the Gujarati ones), and whether the owner wants different groups.
6. For SEO and the Google listing: opening hours, Google Maps location (or latitude/longitude), Google Business Profile link, Instagram/Facebook links, and the FSSAI license number to show in the info sheet.
7. Confirm the "Pure Veg" label and the price range symbol (for example INR INR) used in search results.
8. Hosting and budget: is it OK to use free tiers of Vercel, a Postgres provider, Upstash Redis and Sentry to start, and which region is closest (Mumbai)?
