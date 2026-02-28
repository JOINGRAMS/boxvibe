# BoxVibe Landing Page — UI Redesign Specification

> **Reference:** Modern SaaS landing page (reel.ai style) — minimal, sharp typography, floating illustrative cards, black-and-white with pastel accents.
> **Scope:** Header, Hero, and illustrative cards. Other sections (Problem, Solution, etc.) can follow the same design system.

---

## 1. Design System — Tokens

### Colors

| Token | Current | New (Reference) | Usage |
|-------|---------|-----------------|-------|
| Primary | Indigo (`indigo-600`) | Black (`black`, `#000`) | Buttons (filled), headings, nav links |
| Background | White (`white`) | White (`white`, `#fff`) | Page bg |
| Text primary | Slate 900 | Black | Headlines, nav |
| Text secondary | Slate 500/600 | Black with ~0.7 opacity | Subheadings, body |
| Accent (cards) | — | Pale blue `#E8F4FC`, Yellow `#F5E6A3`, Pink `#FFE4E6`, Green `#E8F5E9` | Floating card backgrounds |
| Border | Slate 200 | Black with thin weight | Outline buttons, card edges |

### Typography

| Element | Spec |
|---------|------|
| Headline (h1) | Large, bold, sans-serif. ~4rem–5rem desktop. Black. |
| Subheadline | Smaller, black, clean sans-serif. ~1.125rem. |
| Nav links | Clean sans-serif, black, medium weight. |
| CTA buttons | Bold, rounded corners. |

### Buttons

| Variant | Spec |
|---------|------|
| Primary (filled) | Solid black background, white text, rounded corners (`rounded-lg` or `rounded-xl`). |
| Secondary (outline) | Thin black border, black text, transparent bg, same rounding. |
| Size (hero) | Slightly larger than nav — `h-12 px-8` or similar. |

---

## 2. Header / Navigation

### Layout

```
[ Logo + email-style label ]  [ Products ▼ | Customer Stories | Resources | Pricing ]  [ Book A Demo ] [ Get Started ]
```

### Specific Changes

| Element | Current | New |
|---------|---------|-----|
| Logo area | "BoxVibe" text only | Logo icon (gear/sunburst or BoxVibe mark) + `hello@boxvibe.com` in black |
| Nav links | Features, How it Works, Pricing | Products (with chevron dropdown), Customer Stories, Resources, Pricing |
| Right CTAs | Single "Book a Demo" button | **Book A Demo** (outline) + **Get Started** (filled black) — two buttons, side by side |

### Styling

- Sticky header, white background, border-b (thin black or slate)
- Nav links: `text-sm font-medium text-black`
- Book A Demo: `variant="outline"`, black border
- Get Started: `variant="default"` with `bg-black text-white`

---

## 3. Hero Section

### Layout

```
                    AI-Driven [Meal Plan] Growth Right Away
        From concept to conversion — manage your meal subscription seamlessly.

                    [ Download Free App ]  [ Get Started Free ]

                    [ Floating illustrative cards — see Section 4 ]
```

### Content Mapping (BoxVibe)

| Reference copy | BoxVibe adaptation |
|----------------|-------------------|
| "AI-Driven Conversion Growth Right Away" | "AI-Driven Meal Plan Growth Right Away" or "Scale Your Meal Business Right Away" |
| "From concept to conversion — manage thousands of successful influencers ads seamlessly." | "From menu to delivery — manage your meal subscription business seamlessly." |

### Structure

- **Centered layout** (not two-column like current hero)
- Headline: `text-4xl md:text-5xl lg:text-6xl font-bold text-black text-center`
- Subheadline: `text-lg text-black/80 text-center max-w-2xl mx-auto`
- CTAs: **Two buttons**, centered, horizontally:
  - Primary: "Get Started Free" or "Book a Demo" (filled black)
  - Secondary: "Download Free App" or "See How It Works" (outline black)

### Remove

- Badge ("Built for GCC Meal Businesses")
- Left/right grid — hero is **single-column, centered**
- Current dashboard mockup (replaced by floating cards)

---

## 4. Floating Illustrative Cards

### Concept

Several rounded cards with different backgrounds, positioned around the hero, giving a "floating" 3D effect. Use `absolute` / `relative` with varying `top`, `left`, `right`, `bottom` and `z-index` for layering.

### Card Inventory (Adapted for BoxVibe)

| Card | Background | Content | Position |
|------|------------|---------|----------|
| **Product card** | Pale blue `#E8F4FC` | Meal/product image or icon + small "2:01" overlay (video length or prep time) | Top-left |
| **Engagement / metric** | Yellow `#F5E6A3` | Bar chart icon + "Engagement 40%" or "Retention 85%" | Bottom-left |
| **Stars / rating** | Pastel pink `#FFE4E6` | 5 white star icons | Between product and engagement |
| **Phone / live** | White + border | Vertical phone mockup: profile pic, "Live" badge, meal preview | Center (most prominent) |
| **Sales card** | Light green `#E8F5E9` | "X meals sold this week" + price + product image | Top-right |
| **Social post** | White | Cropped meal/food image + heart, cart, share icons + "1.5k" likes | Bottom-right |

### Styling

- All cards: `rounded-xl` or `rounded-2xl`
- Shadows: `shadow-lg` or `shadow-xl` for depth
- Slight rotation or offset for "floating" feel (e.g. `rotate-[-2deg]` on some)
- Responsive: hide or simplify on mobile; show full layout on `md:` and up

### Implementation Notes

- Use a wrapper `<div className="relative min-h-[400px] md:min-h-[500px]">` for the hero visual area
- Cards as absolutely positioned children
- Use BoxVibe-specific content: meals, subscribers, orders, retention, etc.

---

## 5. Brand Logos Strip (Bottom of Hero or New Section)

### Layout

Horizontal strip of partner/vendor logos in monochrome (grey/black).

### Content

- "Trusted by" or "Powered by"
- Logos: GRAMS, plus placeholders (TOZO, cocokind, etc.) or "Coming soon" partners
- Style: `grayscale` or `opacity-60`, consistent height (e.g. `h-8`)

---

## 6. Component-Level Checklist

### Nav (`nav.tsx`)

- [ ] Add logo asset or icon + `hello@boxvibe.com`
- [ ] Replace nav links with: Products (chevron), Customer Stories, Resources, Pricing
- [ ] Add second CTA: "Get Started" (filled black)
- [ ] Style "Book A Demo" as outline
- [ ] Ensure `rounded-lg` or `rounded-xl` on both buttons

### Hero (`hero.tsx`)

- [ ] Switch to single-column, centered layout
- [ ] Update headline and subheadline copy
- [ ] Replace DemoForm with two CTA buttons (or keep form in a modal/secondary CTA)
- [ ] Remove current dashboard mockup
- [ ] Add floating cards container and individual card components

### New: `hero-cards.tsx` (or similar)

- [ ] Product card (pale blue)
- [ ] Engagement/metric card (yellow)
- [ ] Stars card (pink)
- [ ] Phone mockup card (center)
- [ ] Sales card (green)
- [ ] Social post card
- [ ] Responsive: simplify or hide on mobile

### Button Variants

- [ ] Ensure `rounded-lg` or `rounded-xl` (not `rounded-md`) for landing
- [ ] Primary: `bg-black text-white hover:bg-black/90`
- [ ] Outline: `border border-black text-black bg-transparent`

### Colors

- [ ] Replace indigo accents with black in hero, nav, and CTAs
- [ ] Add pastel card colors to Tailwind if needed (or use arbitrary values)

---

## 7. File Changes Summary

| File | Action |
|------|--------|
| `nav.tsx` | Restructure links, add second CTA, add logo+email |
| `hero.tsx` | Full redesign: centered, new copy, remove mockup, add cards |
| `hero-cards.tsx` | **New** — floating card components |
| `demo-form.tsx` | Keep; move to modal or Final CTA section (optional) |
| `button.tsx` | Add `rounded-lg` to default or create landing-specific variant |
| `tailwind.config` | Add card accent colors if desired |

---

## 8. Copy Suggestions (BoxVibe-Specific)

- **Headline:** "Scale Your Meal Plan Business Right Away"
- **Subheadline:** "From menu to delivery — manage your meal subscription seamlessly with AI-powered operations."
- **Primary CTA:** "Get Started Free" or "Book a Demo"
- **Secondary CTA:** "See How It Works" or "Watch Demo"

---

## 9. Responsive Behavior

| Breakpoint | Hero | Cards | Nav |
|------------|------|-------|-----|
| Mobile | Stacked, smaller text | Hide or show 1–2 simplified cards | Hamburger menu, CTAs in drawer |
| Tablet | Centered, medium text | Show 3–4 cards, simplified layout | Full nav or condensed |
| Desktop | Full centered hero | All 6 cards, floating effect | Full nav, two CTAs |

---

*Document version: 1.0 — Based on reference design provided 2026-02-28*
