# Feeding India (feedingindia.org) — design reference

**Purpose:** Context for emulating layout, typography, and UX patterns on vihaar.me (e.g. Fundraise / annadaan).  
**Last captured from:** homepage snapshot, March 2026.

> This is **not** an official Feeding India document. Do not copy their branding, logo, or proprietary imagery without permission.

---

## Site & org (for linking in copy if appropriate)

| Item | Value |
|------|--------|
| Canonical URL | `https://feedingindia.org/` |
| Tagline | “Nourished children are the foundation of a thriving India.” |
| Meta description | Feeding India, a Zomato Giveback — daily nutritious meals, child malnutrition in India |
| Legal name note | Registered as **Hunger Heroes** (Indian Society Registration Act XXI, 1860) |
| Contact | `contact@feedingindia.org` |

---

## Typography (from their HTML)

- **Primary sans:** Lexend (variable) — clean, readable UI.
- **Accent / display:** Caveat (bold) — handwritten feel for warmth.
- **Pattern:** Large light headlines + colored emphasis word(s) (“make India malnutrition **free**”).

**Emulation without copying:** Use a similar pairing on vihaar.me, e.g.:

- `Lexend` or `DM Sans` / `Plus Jakarta Sans` for UI
- `Caveat` or `Patrick Hand` (you already use Patrick Hand + Crimson on the site) for accents

---

## Color / UI cues

- **Primary accent red:** `#EF4F5F` (buttons, icons, map markers).
- **Backgrounds:** Light “bg-primary” style neutrals; soft borders; rounded cards (`rounded-2xl` / `rounded-3xl`).
- **Hero:** Full-viewport video with dark bottom gradient + white headline.
- **Stats row:** 4 columns — icons + big number + muted caption (e.g. “1.5 L+ children served daily”, “23 Cr+ meals served”).
- **Meals section:** Horizontal day tabs + **circular meal carousel** (food photos in circles) + nutrition card (kcal, protein, fat, carbs, fibre).
- **Programs:** Two large cards with image + bullet features + “View details” chevron.
- **Footer:** Multi-column — org/legal, navigation, resources, social.

---

## Section order (homepage) — useful as a wireframe

1. Sticky header — logo, Our work (dropdown), About, Partner, **Donate now**
2. Full-bleed video hero + headline + scroll cue
3. **Stats** — mission line + 4 metrics
4. **Region / map** — “how food reaches children” + India map + regional accordions
5. **Meals** — weekly menu carousel + nutrition breakdown
6. **Our programs** — Daily Feeding Program, Anganwadi Program
7. **Stories** — horizontal cards, quotes
8. **Your impact** — Zomato / Blinkit CTAs + illustration
9. **Blogs** — horizontal scroll
10. **Logo + rotating meal image ring**
11. Footer

---

## CDN / image URLs (reference only — see “Images” below)

Assets are served from **`https://cdn.feedingindia.org/`** (and some `/_next/static/` paths on their domain). Examples from their page:

- Hero poster: `https://cdn.feedingindia.org/fi-web/assets/MTc2NzA3ODQyOTY4MzMyNjE4OA.webp`
- OG image: `https://cdn.feedingindia.org/fi-web/assets/MTc2NTk2Mjg3MjEwNDU1MzkzNA.webp`
- Meal carousel (examples): paths under `https://cdn.feedingindia.org/feedingindia%2F...webp` (URL-encoded filenames)

**Full asset list:** [`feeding-india-assets.html`](feeding-india-assets.html). **Local copies** (self-hosted): `artifacts/vihaar-me/public/feeding-india/` — hero video, poster, meals, programs, stories, social icons, carousel. Use paths from `public/feeding-india/manifest.json`.

---

## Images: can we “pull” them?

| Approach | Verdict |
|----------|---------|
| **Hotlink** their CDN in production | **Risky:** URLs can change, they may block hotlinking, **copyright/trademark** issues, looks like you’re them. |
| **Download & host** on vihaar.me | **Not OK** without a license or written permission. |
| **Use as visual reference** | **OK** — recreate layout, spacing, and *types* of shots (plates, school meals, India context) with **your own** photos, illustrations, or **properly licensed** stock. |

**You work with Feeding India:** Unsplash / Pexels / your own photography for “school lunch”, “thali”, “children eating together”, etc.; Confirm with them whether you can use their CDN assets; all URLs are in [`feeding-india-assets.html`](feeding-india-assets.html).

---

## Raw HTML snapshot

The full page HTML is not stored in-repo. To capture it:

- Open [feedingindia.org](https://www.feedingindia.org/) and use **Save Page As → Webpage, Complete** (Ctrl+S / Cmd+S)
- Save as `feeding-india-homepage-full.html` in this folder if you want it locally
- [`feeding-india-assets.html`](feeding-india-assets.html) has all image/graphics URLs in one place for reuse

---

## Implementation notes for vihaar.me

- Align Fundraise page with: **stats band**, **meal-forward imagery**, **rounded cards**, **one strong accent** (you could shift toward coral/red *in addition to* existing amber/green if it stays on-brand).
- Reuse patterns you already have: Framer Motion, Tailwind — mirror **section rhythm** and **typographic scale**, not their exact CSS class names.
- If you cite them as a **partner or inspiration** in copy, keep wording accurate (they are a separate NGO; your campaign is yours unless you have a formal relationship).
