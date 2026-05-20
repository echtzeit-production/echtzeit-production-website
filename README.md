# Handoff: Echtzeit Production — Website Redesign

## Overview
A high-fidelity, editorial portfolio website for **Echtzeit Production** (Mika Henes — Videograph based in Berlin / Brandenburg). Single-page site with hero wordmark, filterable 2-column project grid, about, services, contact, and footer. Visual direction: warm sand background, ultramarine accent, large condensed display typography, minimal chrome, filmic.

## About the Design Files
The files in this bundle are **design references created in HTML/React (via inline Babel)** — a prototype showing intended look and behavior, NOT production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (Next.js / Astro / Nuxt / SvelteKit / WordPress, etc.) using established patterns. If no environment exists yet, **Next.js (App Router) + Tailwind** is a good default for this kind of editorial site, with images served via `next/image` and an MDX or CMS-backed `projects` collection.

## Fidelity
**High-fidelity.** All colors, type sizes, spacing, borders, hover states and animations are final. Recreate pixel-perfect using the codebase's libraries and patterns.

## Screens / Views

### Single-page layout, top to bottom

#### 1. Header (`<header class="top">`)
- **Position**: absolute, top of page, padding `38px 40px 0`
- **Layout**: 3-column CSS grid (`1fr auto 1fr`), brand center, About button right
- **Brand wordmark**: text `ECHTZEIT PRODUCTION`, JetBrains Mono 600, 14px, letter-spacing 0.28em, uppercase, color `--accent`
- **About button**: bordered ghost button, JetBrains Mono 600, 11px, padding `10px 22px`, 1px solid accent border, transparent bg, fills with accent on hover

#### 2. Hero (`<section class="hero">`)
- **Padding**: `220px 40px 90px`, max-width 1640px, centered
- **Headline**: `clamp(68px, 13.2vw, 220px)`, Antonio 700, line-height 0.92, color `--accent`, single line, white-space nowrap. Pattern: `<word> + <word>` (e.g. "FILM + STORY"). The `+` is rendered as `<span class="plus">` weight 400.
- **Halo**: radial gradient behind headline, warm yellow `rgba(255,228,160,0.55)` 55% × 45% at 50% 38%
- **Info row** below headline (margin-top 130px, padding `0 60px`): 3-column grid — left "Based in Berlin / Brandenburg", center phone, right "Email Me" mailto. JetBrains Mono 600, 12px, letter-spacing 0.22em, uppercase, color `--accent`, with underlined link styling.

#### 3. Portfolio (`<section class="work">`)
- **Filter row**: grid `auto repeat(6, 1fr)`, padding-bottom 80px, gap 24px
  - "Filter Work:" label JetBrains Mono 600 12px uppercase accent
  - 6 chips: `All / Hochzeiten / Imagefilm / Werbung / Social Media / Events`
  - Inactive chip: accent color at 0.55 opacity; active: full opacity prefixed with `● `
- **Grid**: 2 columns, gap 8px (thin)
- **Tile**: `aspect-ratio: 16/10`, no border radius, no shadow
  - Image: `object-fit: cover`, saturate 0.95, contrast 1.02; on hover scales to 1.05 over 1.2s `cubic-bezier(.2,.7,.2,1)`
  - Bottom gradient veil fades in on hover (`linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)`)
  - Tile-num top-left (Mono 10px, mix-blend difference)
  - Play badge top-right (44px circle, accent bg, white play SVG), scales in from 0.6 on hover
  - Meta bottom: title (Antonio 600 28px uppercase) + category/runtime/location/year (Mono 10px)
  - Entry animation: fade + 14px translate-Y, 700ms ease, staggered by `index % 8 × 60ms`

#### 4. About (`<section class="about">`)
- 2-column grid `1fr 1.4fr`, gap 80px, padding 120px 40px, top border
- Left: kicker `A/01 · Über mich` + portrait image (`aspect-ratio: 3/4`, grayscale 0.15)
- Right: `<h2>` Antonio 600 `clamp(40px, 5vw, 78px)` uppercase with `<em>` Instrument Serif italic accent in color `--accent`
- 2 body paragraphs, 17px Manrope, color `--ink-2`, max-width 56ch
- Stats row: 3 columns — `700+`, `5y+`, `100M` in Antonio 700 54px accent, with Mono labels

#### 5. Services / Leistungen (`<section class="services">`)
- Editorial row list, padding 80px 40px
- Heading "Leistungen" Antonio 600 `clamp(40px, 6vw, 96px)` uppercase
- Each row: grid `60px 1.2fr 2fr 1fr`, padding 28px 0, bottom border
  - Index (Mono 11px muted) / Title (Antonio 600 `clamp(24px, 2.6vw, 38px)`) / Description / Arrow circle 46px
  - On hover: title → accent, arrow → filled accent + rotated -45deg

#### 6. Contact (`<section class="contact">`)
- Dark bg (`--ink` `#1a1714`), color `--bg`, padding 100px 40px, margin-top 60px
- Kicker "K/01 · Sag Hallo" Mono 11px accent
- Headline "Let's create something *real.*" — Antonio 600 `clamp(54px, 11vw, 200px)`, `<em>` Instrument Serif italic accent
- 4-column bottom grid (`2fr 1fr 1fr 1fr`): Email / Standort / Antwortzeit / Send button
- Send button: pill (border-radius 999px), accent bg, padding `22px 32px`, Mono uppercase

#### 7. Footer (`<footer class="foot">`)
- Dark bg, 28px padding, Mono 11px uppercase
- Left: copyright + name. Right: Instagram, YouTube, Impressum, Datenschutz

#### 8. Project Modal (opens on tile click)
- Fixed overlay, `rgba(20,18,15,0.78)` backdrop
- Card max-width 1100px, 2-column grid `1.4fr 1fr`, no border radius
- Left media pane (16:10), right body with kicker, h4, description, credits grid (Year / Runtime / Location / Discipline)
- Close button top-right 42px circle. Escape key closes.

## Interactions & Behavior
- **Smooth scroll** between sections via `html { scroll-behavior: smooth }`
- **Scroll-reveal**: elements with `.reveal` fade-in (opacity + 20px translate) via IntersectionObserver at 0.15 threshold
- **Active section** tracked in scroll handler (sections crossed top 40% of viewport)
- **Tile entrance**: staggered fade-in animation on mount
- **Tile hover**: image zoom 1.05 + veil fade + meta slide-up + play badge scale
- **Project modal**: opens on tile click, Escape closes, click backdrop closes, 350ms transition
- **Filter**: filtering applied via `display: none` on non-matching tiles; container has `key={filter}` so children remount and replay entry animation

## State Management
- `filter`: string, default `"All"`. Active category.
- `modalOpen` / `modalProject`: modal state.
- `scrolled`, `active`: scroll observers for header/nav.
- `t` (tweaks): `{ accent, headline, grain, displayFont, darkContact }` — persisted via host edit-mode protocol in prototype; in production, drop the Tweaks panel entirely and pick one set of values.

## Design Tokens

### Colors
```css
--bg:           #ecd9a8;   /* warm yellow sand */
--bg-2:         #e3cc92;
--ink:          #1a1714;   /* warm near-black */
--ink-2:        #3a342c;
--muted:        #7a6f5e;
--line:         rgba(26,23,20,0.18);
--line-strong:  rgba(26,23,20,0.4);
--accent:       #1d22e8;   /* ultramarine */
--accent-ink:   #0b0fb0;
--paper:        #f3ead5;
```
Alternate accents available in the prototype (Tweaks): bordeaux `#7a141e`, forest `#1f4a2a`, ember `#c4361d`. Default ship: ultramarine.

### Typography
- **Display**: Antonio (Google Fonts), weights 400/500/600/700, letter-spacing `-0.01em` on huge sizes
- **Mono / utility**: JetBrains Mono, weights 400/500/600
- **Body**: Manrope, weights 300–700
- **Italic accent**: Instrument Serif, italic, used for emphasized words in headlines

### Spacing
- Page max-width 1640px, gutter 40px (mobile 20px)
- Section vertical padding: 80–120px
- Grid gap: 8px (portfolio tiles), 24px (filter row), 30–80px (about/services)

### Border / radius / shadow
- **No border radius** on tiles, modal, sections (intentionally editorial / filmic)
- Round only on icon buttons (44–46px circles) and pill CTAs (999px)
- **No drop shadows** anywhere — flat editorial aesthetic

### Animation
- Hover transitions: `.25s–.4s ease`
- Image zoom: `transform 1.2s cubic-bezier(.2,.7,.2,1)`
- Reveal: `0.9s ease`
- Tile entry: 700ms staggered 60ms

### Grain
Fixed-position SVG noise overlay, `mix-blend-mode: multiply`, opacity 0.18 default (slider 0–0.4 in prototype). Drop into production if desired or omit — site works without it.

## Responsive Behavior
- Below 1200px: hide "EST. 2019" sub-label (already removed in this build, leftover rule)
- Below 1080px: collapse 3-col header to 2-col, hide nav (now N/A — header already has no nav)
- Below 900px: hero padding shrinks; portfolio grid → 1 column; about → single column; services rows collapse (description + arrow hidden); footer stacks; modal → single column

## Assets
- All portfolio thumbnails currently use **Unsplash** placeholder photos (URLs in `app.jsx` PROJECTS array). Replace with Echtzeit's real video poster frames in production.
- Portrait in About is also an Unsplash placeholder — swap with photo of Mika.
- No icon library used. SVGs are inline (arrow, play, close).
- Fonts loaded via Google Fonts `<link>` in `<head>`.

## Current Content (May 2026)

### Filter categories
Only three: **Hochzeiten · Imagefilm · Social Media** (centered, JetBrains Mono uppercase, accent color, active state = underline + full opacity).

### Project videos embedded
All thumbnails come from `i.ytimg.com`; modal opens an iframe at `https://www.youtube.com/embed/<id>?autoplay=1&rel=0`. Shorts use `oar2.jpg` (YouTube's portrait thumbnail), regular videos use `maxresdefault.jpg` with `hqdefault.jpg` fallback (detected via `onLoad` checking `naturalWidth ≤ 120`).

**Hochzeiten (4 videos, 16:10 tiles, 2 cols)**
1. `jFerr3Xefao` — Dayana & Michi
2. `aOjbw06vjCA` — Reel II
3. `olIoMkXWGaQ` — Reel III
4. `7Dnk1RHRXuo` — Reel IV

**Imagefilm (1 video, 16:10 tile, 2 cols)**
- `4cn3k2qXDpw`

**Social Media (5 shorts, 9:16 tiles, 3 cols)**
- `4upU0GoXatk`, `AgNIc5qt5xw`, `dVLQtHcbmTw`, `rVkmCNuvPVE`, `Jg8oq-0qlNE`

### Tile chrome
- No number badge (top-left removed)
- Play button: 64px circle, paper-white bg `rgba(243,234,213,0.95)`, dark ink play icon, centered, scales in on hover from 0.85 → 1
- Views badge bottom-left only renders if `p.views` is truthy (all currently empty — fill in real counts via YouTube Data API or manually)
- Modal credits row shows Year / Runtime / Location / Views

### Hero info row
Mono uppercase: "Based in Berlin / Brandenburg" · "+49 173 421 0890" (placeholder phone) · "Email Me" (mailto:info@echtzeit-production.de).

## Files in this bundle
- `index.html` — Page shell, fonts, all CSS, mounts React app
- `app.jsx` — All React components (Header, Hero, Work, About, Services, Contact, Footer, Modal, Tweaks wiring)
- `tweaks-panel.jsx` — Tweaks UI (host-protocol; **remove for production**)

## Notes for the implementing developer
1. **Strip the Tweaks panel** entirely — it's a designer-time iteration tool that hooks into a host edit-mode protocol. Choose one variant (default: ultramarine accent, Antonio display, dark contact, grain 0.18) and ship that.
2. **Drop React** if a static framework (Astro / Eleventy) fits — there's nothing here that requires React state except the filter + modal. Both are trivial to recreate with Alpine, Petite-Vue, or vanilla JS.
3. **Replace stock imagery** with real video stills and Vimeo / YouTube embeds for the modal media pane.
4. **Add legal pages** (Impressum, Datenschutz) — they're linked in the footer but not built.
5. **SEO + OG tags** are not in the prototype — add them in production.
6. **Contact form**: prototype only has a mailto button. If you want a real form, add server-side handling (Resend, Formspree, Netlify Forms, etc.).
