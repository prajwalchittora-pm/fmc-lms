# Find My College — Design System

> _A high-fidelity design system for **find my college (FMC)** — a college-discovery and counselling service built around a free-counselling lead-gen flow._

This folder is the working source of truth for FMC's visual language. It contains the brand foundations (color tokens, type, logos), low-level CSS variables, component recreations from the Figma library, and product-shaped UI kits for fast prototyping.

---

## Sources

This system was reconstructed from the materials the user attached. None of these are bundled here — store them externally if you want to round-trip changes.

| Source                                | What it gave us                                              |
|---------------------------------------|--------------------------------------------------------------|
| `FMC Design System 2.0.fig` (Figma)   | 142 color tokens, 8 components (CTA desktop/mobile, input fields desktop/mobile, dropdowns desktop/mobile, pill, CTA-animation). Variables live in `tokens.css`; one component per file under `components/`. |
| `FMC Logos.zip`                       | 10 SVGs across the icon-only, initialism, wordmark, stacked, and primary-horizontal lockups, in both light- and dark-background variants. |
| _Implicit product_                    | The CTA label `Get Free Counselling`, mobile-leaning component breadth, and 12px-radius forms imply the surface is a lead-gen marketing site / mobile flow for India ed-counselling. No live product code or screenshots were supplied — UI-kit screens are reconstructed from the component library plus inferred information architecture. |

> ⚠ The Figma file is **library-only** — it contains the component sheet, not finished screens. Marketing site, hero compositions, results pages, etc. were inferred and built fresh against the tokens. Anywhere the inference might diverge from the actual product, the UI kits include a "Reconstructed — not from screens" note inline.

---

## Index

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← portable agent skill (Claude Code compatible)
├── colors_and_type.css        ← all CSS vars + element defaults
├── fonts/                     ← Inter + Bricolage Grotesque variable .ttf binaries
├── assets/
│   └── logos/                 ← 10 SVG lockups (light + dark, all variants)
├── preview/                   ← Design System tab cards
└── _fig/                      ← raw Figma extraction (read-only reference)
```

---

## Brand at a glance

**find my college** — the wordmark is always lowercase, never capitalised, with **my** rendered in brand orange (`#FF6A00`). The icon mark is three offset parallelograms (orange / red / blue) that abstract a graduation-cap silhouette. Lockups: **primary-horizontal** (icon + wordmark in a row, default on desktop), **primary-stacked** (icon above wordmark, default on mobile + favicon contexts), **wordmark-only**, **icon-solo**, and **initialism-icon** (icon above the literal "fmc" lockup, used in compact / favicon contexts).

The brand reads bold, optimistic, India-ed-counselling-warm. It is **not** Silicon-Valley-cool, **not** prestige-academic, **not** government-formal. It is utility-with-energy.

---

## CONTENT FUNDAMENTALS

### Voice & tone
- **Confident, encouraging, plain-spoken.** This is a high-stakes decision (college choice) for users who are usually 17–22 or their parents — copy should feel like a knowledgeable senior friend, not a corporate brochure.
- **Action-forward.** The product is a counselling-funnel; almost every section asks the user to take one concrete next step (book, search, talk to a counsellor).
- **Indian-English idiom.** "Counselling" (not counseling), "Get free counselling," "Stream," "Branch," "Cut-off," "Placement," "Hostel" — these are the words students search for.

### Casing
- **Wordmark is always lowercase.** "find my college" — never title-case, never all-caps, never "Find My College" except in body copy as a proper noun where lowercase would be confusing.
- **Headings: Sentence case** — "Find the right college for you", not "Find The Right College For You".
- **Buttons: Title Case** — "Get Free Counselling", "Talk to a Counsellor", "Find My Match".
- **Labels & form chrome: Sentence case** — "Course you're interested in", not "Course You're Interested In".
- **Section eyebrows: ALL CAPS, tracking-wide, 12px** — sparingly, for category labels above big headings.

### Pronoun & person
- **Second person, "you".** "_Your_ next step starts here." "Find _your_ stream." Brand voice talks _to_ the user, never about them.
- **First-person plural sparingly** — "We'll match you with…" reserved for moments where the service is doing something on the user's behalf.

### Emoji
- **Do not use emoji** in product surface or marketing copy. The brand uses **shape-based iconography** (the parallelograms in the logo, line icons in UI). Emoji feels off-brand and undercuts the polished-but-warm tone.

### Vibe checks — examples
| Good ✅ | Off-brand ❌ |
|---|---|
| "Get Free Counselling" | "Sign up now!!" |
| "Find the college that fits your stream and your score" | "Discover your academic journey 🎓✨" |
| "Talk to a counsellor — it's free" | "Get matched with our AI-powered college recommendation engine" |
| "What course are you interested in?" | "Please select your course of preferred interest from the following options" |
| "Cut-off: 92.4% (2024)" | "Cut-off score for the year 2024 was 92.4 percent" |

### Microcopy conventions
- **Placeholder text** — Use specific, plausible content, not "Enter text". e.g. `"e.g. B.Tech Computer Science"`, `"Search by college, course, or city"`.
- **Form labels** — Short. Singular noun phrase. "Course", "City", "Phone number". No colons.
- **Errors** — Plain, no exclamation marks. "Please enter a valid phone number." Not "Oops! Something went wrong."
- **Empty states** — One sentence + one CTA. "No results match — try a different course or city. [Reset filters]"
- **Loading** — Verb-leading. "Finding matches…", "Loading counsellors…".

---

## VISUAL FOUNDATIONS

### Colors
- **Primary action: `--blue-700` (#072FB5)** — Used for the filled CTA, primary links, all heading text. This is the dominant interactive colour; it does the work that "brand blue" does in most systems.
- **Brand orange `#FF6A00`** — Only the logo's "my" highlight + occasional heading highlight (`--text-heading-hilite` is the darker `--orange-600` for accessible body use). Used **sparingly** as an accent; never as a CTA fill.
- **Warm beige page-section `#F8F5F1`** — The non-white page background, gives sections breathing room without going grey. Most "what's this section?" backgrounds are this beige, not white-or-grey.
- **9-hue pastel system** — `--bg-pastel-{blue,cyan,green,red,pink,purple,yellow,beige-1/2/3}` for category cards, tag chips, and section blocks. Pair each pastel with the matching `--label-*` text colour for legible chips.
- **Neutrals: 10-step** — `--neutral-50` through `--neutral-900`. 800 is the body-text default (not pure black). 100/200 are dividers and skeletons.

### Typography
- **Bricolage Grotesque (display) + Inter (body).** Bricolage is the brand display face — used for h1–h5, hero copy, big quotes, anywhere `var(--font-display)` is referenced. Inter handles body, labels, buttons, and form chrome via `var(--font-sans)`. Both ship locally as variable-font `.ttf` binaries in `fonts/` and are wired via `@font-face` in `colors_and_type.css` (no CDN dependency).
- **Bricolage is variable** (opsz, wdth, wght axes); **Inter is variable** (opsz, wght axes). Both `@font-face` rules cover their full weight ranges.
- **Headings: `--blue-700`, bold (700), tight tracking (`-0.02em`), line-height 1.1.** Headings are visually heavy and confident.
- **Highlight pattern** — Wrap a span inside an h1/h2 with `.highlight` for the orange callout. This is the same treatment as "my" in the wordmark and is the most distinctive type pattern in the system. Use 1× per heading, max.
- **Body: `--neutral-700`, regular (400), line-height 1.5.** Set in Inter.
- **Form labels: Inter 14px / 700.** Form-input chrome uses Inter 14/500 for placeholders.

### Spacing & layout
- **4-pt grid.** `--space-1` through `--space-20`. Tokens cover 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.
- **Default radius: 12px (`--radius-md`).** Inputs, dropdowns, large CTAs all share this — visual continuity matters. Small CTAs drop to 8px; pills are fully rounded.
- **Form widths: 396px desktop / 318px mobile.** Direct from Figma — these are the canonical input widths.
- **CTA heights: 50px large / 44px medium / 32px small** (desktop). Mobile uses 48 / 40 / 32.
- **Page max-width** — Marketing surfaces use ~1280px content max with generous outer gutters; counselling-form blocks centre at 480–640px.

### Backgrounds
- **No gradients** (with one exception below). Flat colour blocks are the rule; section-to-section variety comes from swapping pastel backgrounds, not gradient washes.
- **Exception:** The hero often has a beige `--bg-section` band with the brand mark colour-blocks reused at large scale as decorative figures (graduation-cap parallelograms in light tints).
- **No noise / grain / texture** — surfaces are clean and flat.
- **No full-bleed photography in the component library.** Real product surfaces likely use student / campus photography, but it isn't in the Figma — keep an `assets/photography/` slot ready for when it lands.

### Borders & dividers
- **Inputs / dropdowns: 1px `--border-subtle` (`rgba(215,215,215,0.5)`).** Very light — the form chrome should recede.
- **Selected states:** Inputs gain a 1px `--blue-700` border + `--shadow-focus-blue` glow. Pills go to `--bg-pastel-beige-3` fill + `--border-orange` stroke.
- **Cards: no border by default**, just radius + soft shadow.

### Shadows / elevation
| Token | Use |
|---|---|
| `--shadow-xs` | sticky chrome, divider replacement |
| `--shadow-sm` | inactive cards, chips |
| `--shadow-md` | resting cards (college tiles, counsellor cards) |
| `--shadow-lg` | modals, overlays, dropdown menus |
| `--shadow-focus-blue` | input + button focus ring |

All shadows are **near-black** (`rgba(15,15,15,…)`) not blue-tinted — keeps them honest on warm-beige backgrounds.

### Hover, press, focus
- **Hover (filled CTA):** background darkens one step (`--blue-700` → `--blue-800`). No scale, no shadow change.
- **Hover (secondary CTA):** background fills with `--blue-50` pastel; border stays.
- **Hover (tertiary / link):** underline appears; colour stays.
- **Hover (card):** `--shadow-md` → `--shadow-lg`, 120ms ease-out, no translate.
- **Press:** subtle `scale(0.98)` + colour darken; 60ms in / 120ms out.
- **Focus:** `outline: none; box-shadow: var(--shadow-focus-blue);` — the blue glow does double duty as visible-focus.
- **Disabled:** opacity 0.4 + `cursor: not-allowed`. No re-colouring.

### Motion
- **Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`** — a snappy ease-out for most UI. Pair with 160–220ms durations.
- **No bounce, no overshoot.** This is a trust-product; movement should feel decisive, not playful.
- **Page transitions: 200ms cross-fade.** Counselling-form step changes use a 240ms slide-left + fade.
- **CTA Animation component (`CTAAnimation` in Figma)** — there's a Figma component capturing the CTA's micro-animation (likely a 2-state press/hover loop). It's a hint that **state changes on the primary CTA are intended to feel kinetic** — the surface is happy to move when the user touches it.

### Transparency & blur
- **Transparency, sparingly** — only for the `--border-subtle` rgba stroke (so it reads softly on both white and beige) and for shadows.
- **Backdrop blur** — Reserved for sticky-nav scroll states (e.g. `backdrop-filter: blur(12px); background: rgba(255,255,255,0.7);`). Don't use it for modals.
- **No frosted-glass cards** — they fight the flat aesthetic.

### Imagery
- **No imagery in the Figma library.** When real photography arrives, the brief is: **warm-toned, daylight, on-campus or close-portrait students**. Cool-toned / b&w / studio-look is off-brand.
- **No illustrations in the Figma library either.** If illustrations get added later, they should reuse the parallelogram language from the logo (geometric, layered, primary-tri-colour).

### Cards
- **Resting card:** `--bg-white` fill, `--radius-md` (12px), `--shadow-sm`, no border, 24px inner padding.
- **Category card** (e.g. course-stream tile): same shape but `--bg-pastel-*` fill, no shadow, the matching `--label-*` text colour for the label chip in the corner.
- **Counsellor / college tile:** white card + soft shadow + a 12px corner-radius photo block at the top.

### Layout rules
- **Fixed top nav on marketing/desktop** — 64–72px tall, white background with subtle bottom shadow when scrolled.
- **Fixed bottom CTA on mobile** — A persistent "Get Free Counselling" bar (full-width, 16px outer padding, primary CTA inside). The mobile component sheet implies this pattern strongly.
- **Inputs and dropdowns stack vertically with 16–24px gap.** Side-by-side only on desktop (≥1024px) and only when fields are semantically peers (first name + last name).
- **Pills wrap on multiple lines** at 12px gap when used as filter chips.

---

## ICONOGRAPHY

### What we have
The Figma file does **not** ship a custom icon font, icon sprite, or named icon library. Component slots include icon stubs (placeholder `20px × 20px` rectangles in CTAs, `24px × 24px` chevrons in dropdowns), but the actual glyph assets are absent.

### What we use
- **System: Material Symbols Rounded (Google)** — loaded via the Google Fonts variable-font CSS endpoint. Default axes: `opsz 24, wght 400, FILL 0, GRAD 0`. Reach for `FILL 1` only when an icon needs emphasis (selected nav item, primary CTA leading-icon).
- **Default size: 24px** inside CTAs and dropdowns, 20px inline with body text, 28–32px for hero-feature icons.
- **Default colour:** matches the surrounding text colour (`currentColor`). Filled CTAs → white; secondary/tertiary → blue-700; in form chrome → neutral-500.

### Loading
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=swap">
```
```html
<span class="material-symbols-rounded">school</span>
```

### Common icons in this product
`school`, `menu_book`, `location_on`, `call`, `mail`, `search`, `tune` (filters), `expand_more`, `arrow_forward`, `check_circle`, `close`, `person`, `group`, `calendar_today`, `workspace_premium` (awards), `info`.

### Emoji & unicode
- **No emoji.** See Content Fundamentals.
- **Unicode glyphs used:** `→` (arrow), `•` (bullet), `×` (close) — only where a one-character replacement reads more cleanly than an SVG. Otherwise prefer Lucide.

### Logos
Ten SVGs in `assets/logos/`:
- `Primary_Horizontal_{LightBG,DarkBG}.svg` — default desktop / wide contexts
- `Primary_Stacked_{LightBG,DarkBG}.svg` — default mobile / square contexts
- `Wordmark_{LightBG,DarkBG}.svg` — text-only, when the icon is redundant
- `Icon_Solo_{LightBG,DarkBG}.svg` — app icon, favicon, social avatar
- `Initialism_Icon_{LightBG,DarkBG}.svg` — icon-above-"fmc" compact lockup

**Clear-space rule:** Around any lockup, reserve clear space equal to the height of the icon's middle (red) parallelogram. **Minimum sizes:** Primary horizontal — 120px wide. Stacked — 64px wide. Icon-solo — 24px (favicon floor).

---

## Caveats for users of this system

1. **Brand fonts ship locally.** Inter (body) and Bricolage Grotesque (display) are both bundled as variable `.ttf` files under `fonts/` and wired via `@font-face` in `colors_and_type.css`. No CDN dependency.
2. **Material Symbols Rounded is the chosen icon set** (confirmed by brand). Loaded via Google Fonts variable-font CSS — no local fallback needed.
3. **No screen designs were shipped** — only the component sheet. The UI-kit screens (hero composition, results layout, counsellor list) are educated reconstructions, not 1:1 copies of a real product surface. Treat as starting-points.
4. **No motion specs were exported** — the CTAAnimation component is in the Figma but its frames aren't extractable here. Motion details (timing, easing) above are best-guesses consistent with the static design.
