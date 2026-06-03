---
name: findmycollege-design
description: Use this skill to generate well-branded interfaces and assets for find my college (FMC) — an India-focused college-discovery and counselling service — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Brand:** `find my college` (FMC) — India-based free college counselling service. Wordmark always lowercase, "my" in brand orange.
- **Primary action color:** `--blue-700` (#072FB5). All CTAs, headings, links.
- **Brand orange:** `#FF6A00` — sparingly, for the logo only. `--orange-600` (#8F3B00) for AA-safe heading highlights.
- **Page bg pattern:** white surfaces alternating with warm beige `#F8F5F1` section bands.
- **Type:** Inter (Google Fonts). 400 / 500 / 600 / 700 / 800. Tight tracking on headings.
- **Default radius:** 12px. Small CTAs and chips drop to 8px. Pills are full-rounded.
- **Default form width:** 396px desktop, 318px mobile.
- **Icons:** Lucide via CDN (flagged substitution — no icon set was shipped).
- **No emoji.** Geometry-based iconography only.

## What's in this skill

- `README.md` — full content + visual guidelines (read first)
- `colors_and_type.css` — CSS variables + element defaults you can import directly
- `assets/logos/` — 10 SVG lockups (light + dark)
- `preview/` — specimen cards (typography, colors, components)
- `fonts/` — Inter + Bricolage Grotesque variable .ttf binaries

## When in doubt

- Lead with the headline + `.highlight` callout pattern — it's the most recognisable type treatment.
- Forms are the product. If you're prototyping FMC, you're probably prototyping a form. Use the Input / Dropdown / Pill components verbatim.
- Reach for `--bg-section` (warm beige) before `--neutral-100` (cool grey) for section backgrounds.
- "Get Free Counselling" is the canonical primary CTA copy. Reuse it.
