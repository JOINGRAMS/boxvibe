# BoxVibe — Development Plan

> **Purpose:** This file is the single source of truth for building BoxVibe with Claude Code.
> Follow this plan phase by phase. Do not skip ahead. Each phase must be functional before moving to the next.

---

## Project Overview

BoxVibe is the "Shopify of meal plans" — a white-labeled, AI-powered platform for meal subscription businesses. It provides vendors with a branded web store for their customers, a management dashboard for their team, and AI agents that replace manual data entry across operations.

**First customer:** GRAMS (founder's own meal subscription company in the UAE).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Database | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Payments | Tap Payments (GCC-focused) |
| Deployment | Vercel |
| Notifications | WhatsApp API, SMS, Email (phase 2+) |

---

## Monorepo Structure

```
boxvibe/
├── apps/
│   ├── web/                  # Next.js app (landing + store + dashboard)
│   └── docs/                 # Internal docs (optional, later)
├── packages/
│   ├── ui/                   # Shared UI components (shadcn/ui based)
│   ├── db/                   # Supabase client, types, queries
│   ├── utils/                # Shared utilities and helpers
│   └── config/               # Shared config (tailwind, tsconfig)
├── supabase/
│   ├── migrations/           # SQL migration files
│   ├── seed.sql              # Seed data for development
│   └── config.toml           # Supabase project config
├── docs/
│   ├── background.md         # Business context and model
│   ├── plan.md               # This file
│   └── wireframes/           # Design references
├── turbo.json
├── package.json
└── README.md
```

**Why monorepo:** The mobile app (Expo) will be added later as `apps/mobile`. Shared packages (`db`, `ui`, `utils`) will be reused across web and mobile.

---

## Architecture Principles

1. **Vendor-scoped everything.** Every table, query, and API route is scoped by `vendor_id`. Multi-tenancy is not optional — it's the foundation.
2. **Supabase Row Level Security (RLS)** enforces access control at the database level. Never rely solely on application-level checks.
3. **Server Components by default.** Use Client Components only when interactivity is required (forms, modals, real-time).
4. **Type safety end-to-end.** Generate Supabase types and use them everywhere. No `any`.
5. **Mobile-first responsive.** The web store must work perfectly on mobile browsers (customers will use phones).
6. **Incremental delivery.** Each phase produces a deployable, testable product.

---

## Domain Model — Core Entities

Understanding the hierarchy is critical before writing any code:

```
Vendor
└── Plan (e.g. "High Protein", "Keto", "Balanced")
    └── Package (e.g. "Lunch + Dinner", "Breakfast + Lunch + Dinner + Snack")
        └── Portion Tier (e.g. "Tier 1: 1000-1200 kcal" → Small/Small)
            └── Meals (actual dishes, rotated daily/weekly)
                └── Ingredients (with grammage per portion size)
```

Other key entities:
- **Customer** — belongs to a vendor, has biometrics, subscribes to a Plan > Package > Tier
- **Subscription** — links customer to their active plan/package/tier, tracks status
- **Order** — daily meal order generated from subscription
- **Menu Schedule** — which meals appear on which days

---

## Build Phases

---

### PHASE 0: Project Setup
**Goal:** Repo initialized, Supabase connected, deployable to Vercel.

- [ ] Initialize monorepo with Turborepo
- [ ] Set up `apps/web` with Next.js 14+ (App Router, TypeScript, Tailwind)
- [ ] Install and configure shadcn/ui
- [ ] Set up `packages/db` with Supabase client
- [ ] Set up `packages/ui` for shared components
- [ ] Create Supabase project and connect locally via CLI
- [ ] Set up environment variables (.env.local)
- [ ] Deploy to Vercel (empty shell — confirms pipeline works)
- [ ] Set up ESLint + Prettier

**Completion check:** `pnpm dev` runs locally, Vercel deployment succeeds.

---

### PHASE 1: Landing Page
**Goal:** A polished, conversion-optimized landing page for BoxVibe that communicates the value prop to meal plan vendors.

**Route:** `/` (root)

**Sections:**
- [ ] Hero — headline, subheadline, CTA ("Get Early Access" or "Book a Demo")
- [ ] Problem statement — the pain of running a meal plan business without tech
- [ ] Solution overview — what BoxVibe provides (store, dashboard, AI)
- [ ] How it works — 3-step visual (sign up → configure → launch)
- [ ] Features grid — key capabilities with icons
- [ ] Social proof / credibility — "Built by the founder of GRAMS" + stats
- [ ] Pricing teaser — "Starting from..." or "Contact for pricing"
- [ ] CTA section — early access form (email capture)
- [ ] Footer — links, contact, socials

**Technical details:**
- Static page (no auth required)
- Email capture form → store submissions in Supabase `waitlist` table
- SEO optimized: meta tags, OG image, structured data
- Animations: subtle, tasteful (Framer Motion or CSS)
- Mobile-first responsive

**Completion check:** Landing page is live on Vercel, email capture works, looks professional on mobile and desktop.

---

### PHASE 2: Database Schema (Foundation)
**Goal:** Core database tables and RLS policies that support the web store.

**Tables to create (in order):**

```
vendors
├── id, name, slug, logo_url, brand_colors, domain
├── settings (JSONB — delivery zones, currency, timezone)
└── created_at, updated_at

plans
├── id, vendor_id, name, description, image_url
├── is_active, sort_order
└── created_at, updated_at

packages
├── id, plan_id, vendor_id, name, description
├── meal_types (JSONB array — e.g. ["lunch", "dinner"])
├── price, duration_days, is_active
└── created_at, updated_at

portion_tiers
├── id, package_id, vendor_id
├── name, calorie_range_min, calorie_range_max
├── portions (JSONB — e.g. {"lunch": "medium", "dinner": "large"})
├── price_modifier (if tiers affect pricing)
└── created_at, updated_at

meals
├── id, vendor_id, name, description, image_url
├── meal_type (enum: breakfast, lunch, dinner, snack, side, soup, salad)
├── ingredients (JSONB), macros (JSONB)
├── is_active
└── created_at, updated_at

meal_schedule
├── id, vendor_id, meal_id, date, meal_type
└── created_at

customers
├── id, vendor_id, user_id (Supabase auth)
├── name, email, phone, delivery_address (JSONB)
├── biometrics (JSONB — height, weight, age, activity_level, goal)
├── recommended_plan_id, recommended_package_id, recommended_tier_id
└── created_at, updated_at

subscriptions
├── id, customer_id, vendor_id
├── plan_id, package_id, portion_tier_id
├── status (enum: active, paused, cancelled, expired)
├── start_date, end_date, pause_history (JSONB)
├── payment_method_id
└── created_at, updated_at

orders
├── id, subscription_id, customer_id, vendor_id
├── date, status (enum: pending, confirmed, preparing, delivered)
├── meals (JSONB — selected meals for the day)
├── total_amount
└── created_at, updated_at

payments
├── id, order_id, customer_id, vendor_id
├── amount, currency, status, tap_payment_id
├── payment_method (JSONB)
└── created_at, updated_at

waitlist
├── id, email, source, created_at
```

**RLS Policies:**
- Vendors can only read/write their own data
- Customers can only read/write their own profile and orders
- Kitchen staff can read orders and meals for their vendor
- Super admin bypasses RLS via service role key (server-side only)

**Seed data:**
- Create GRAMS as the first vendor
- Add 2-3 sample plans with packages, tiers, and meals
- Add sample customers with subscriptions

**Completion check:** All tables created via migrations, RLS enforced, seed data loads cleanly, Supabase types generated.

---

### PHASE 3: Web Store — Storefront
**Goal:** A customer-facing web store where visitors can browse a vendor's meal plans and packages.

**Routes:**
- `/store/[vendor-slug]` — vendor storefront home
- `/store/[vendor-slug]/plans` — browse all plans
- `/store/[vendor-slug]/plans/[plan-slug]` — plan detail with packages
- `/store/[vendor-slug]/plans/[plan-slug]/[package-slug]` — package detail with tiers

**Features:**
- [ ] Vendor-branded storefront (logo, colors pulled from vendor settings)
- [ ] Plan cards with images, descriptions
- [ ] Package cards showing included meal types, price, duration
- [ ] Portion tier selector with calorie ranges
- [ ] Sample menu preview (upcoming week's meals)
- [ ] Responsive, mobile-first layout
- [ ] Clean URL structure using vendor slugs

**Technical details:**
- Server Components for data fetching (plans, packages, meals)
- Dynamic routes with `[vendor-slug]` param
- Vendor brand theming via CSS variables set from DB
- ISR (Incremental Static Regeneration) for performance

**Completion check:** Can browse GRAMS store, see plans, packages, tiers, and sample menus. Looks great on mobile.

---

### PHASE 4: Web Store — Customer Onboarding & Auth
**Goal:** Customers can sign up, input biometrics, and receive a plan recommendation.

**Routes:**
- `/store/[vendor-slug]/signup` — account creation
- `/store/[vendor-slug]/onboarding` — biometric input + plan recommendation

**Features:**
- [ ] Sign up / login via Supabase Auth (email + OTP preferred for GCC market)
- [ ] Multi-step onboarding form:
  - Step 1: Basic info (name, phone, delivery address)
  - Step 2: Biometrics (height, weight, age, activity level, fitness goal)
  - Step 3: AI/algorithm recommends Plan + Package + Tier
  - Step 4: Customer confirms or manually overrides recommendation
- [ ] Recommendation algorithm (v1 — rule-based, not AI yet):
  - Map fitness goal + activity level + calorie target to best plan/package/tier
  - Show reasoning: "Based on your goal of weight loss and moderate activity, we recommend..."
- [ ] Save customer profile + recommendation to database

**Technical details:**
- Supabase Auth with email OTP (magic link)
- Multi-step form with client-side state (React Hook Form + Zod validation)
- Recommendation logic as a server action or edge function
- Customer linked to vendor via `vendor_id`

**Completion check:** Full signup → onboarding → recommendation flow works. Customer record created in DB with biometrics and recommended plan.

---

### PHASE 5: Web Store — Checkout & Subscription
**Goal:** Customer can subscribe to their chosen plan and pay via Tap Payments.

**Routes:**
- `/store/[vendor-slug]/checkout` — review selection + pay
- `/store/[vendor-slug]/checkout/success` — confirmation
- `/store/[vendor-slug]/checkout/failure` — retry

**Features:**
- [ ] Order summary: plan, package, tier, price, duration
- [ ] Delivery address confirmation
- [ ] Start date selection
- [ ] Tap Payments integration (credit/debit card)
- [ ] Subscription record created on successful payment
- [ ] Confirmation page with subscription details
- [ ] Email/WhatsApp confirmation (stretch — can be Phase 6)

**Technical details:**
- Tap Payments server-side integration (create charge, handle webhook)
- Webhook handler for payment confirmation → create subscription + first order
- Idempotent payment processing (prevent double charges)
- Store payment reference in `payments` table

**Completion check:** Full checkout flow works with Tap Payments (test mode). Subscription created in DB. Customer sees confirmation.

---

### PHASE 6: Web Store — Customer Portal
**Goal:** Subscribed customers can manage their subscription and daily meals.

**Routes:**
- `/store/[vendor-slug]/portal` — customer dashboard
- `/store/[vendor-slug]/portal/meals` — view/swap today's meals
- `/store/[vendor-slug]/portal/subscription` — manage subscription

**Features:**
- [ ] Today's meals view with swap/mix-and-match
- [ ] Upcoming meals calendar
- [ ] Meal ratings (simple 1-5 star)
- [ ] Subscription management: pause, resume, cancel
- [ ] Profile editing (delivery address, biometrics)
- [ ] Subscription stats (days active, total orders)

**Technical details:**
- Protected routes (require auth)
- Real-time meal swaps via Supabase Realtime (optional)
- Server actions for subscription updates
- Optimistic UI for meal swaps

**Completion check:** Customer can log in, see today's meals, swap meals, pause subscription, update profile.

---

### PHASE 7: Vendor Dashboard
**Goal:** Vendor admin can manage their entire operation from a web dashboard.

**Routes:**
- `/dashboard` — main dashboard (requires vendor auth)
- `/dashboard/customers` — customer list and profiles
- `/dashboard/menu` — meal and menu management
- `/dashboard/kitchen` — kitchen operations (shopping → cooking → plating → packing)
- `/dashboard/orders` — order management
- `/dashboard/settings` — vendor settings (branding, delivery zones, etc.)

**Sub-phases:**

#### 7A: Dashboard Shell + Auth
- [ ] Vendor login (Supabase Auth — separate from customer auth)
- [ ] Dashboard layout: sidebar nav, header, content area
- [ ] Role-based access (Vendor Admin vs Kitchen Staff vs Sales Rep)
- [ ] Overview page with key metrics (active subscribers, today's orders, revenue)

#### 7B: Customer Management
- [ ] Customer list with search and filters
- [ ] Customer detail page (profile, biometrics, subscription, order history, LTV)
- [ ] Manual customer creation (for phone/walk-in signups)

#### 7C: Menu Management
- [ ] CRUD for plans, packages, portion tiers, meals
- [ ] Meal schedule builder (assign meals to dates)
- [ ] Menu import via Excel with AI auto-mapping (core differentiator — can be Phase 8)
- [ ] Ingredient and macro management per meal

#### 7D: Kitchen Operations
- [ ] Shopping list generator (aggregate today's orders → ingredient quantities)
- [ ] Cooking view (what to cook, how much)
- [ ] Plating view (per-customer portion instructions)
- [ ] Packing checklist (per-customer bag contents)

#### 7E: Orders & Payments
- [ ] Daily order list
- [ ] Order status tracking
- [ ] Payment history and reconciliation

#### 7F: Settings
- [ ] Vendor branding (logo, colors, store slug)
- [ ] Delivery zones and schedules
- [ ] Notification preferences
- [ ] Team member management (invite, roles)

**Completion check:** Vendor can log in, see dashboard, manage customers, build menus, run kitchen operations, track orders.

---

## Development Guidelines for Claude Code

### Code Style
- Use TypeScript strict mode — no `any` types
- Prefer Server Components; use `"use client"` only when needed
- Use Zod for all form validation and API input validation
- Use React Hook Form for complex forms
- Naming: `kebab-case` for files, `PascalCase` for components, `camelCase` for functions/variables
- Co-locate: keep component, types, and utils together in feature folders

### File Organization (within `apps/web`)
```
app/
├── (landing)/              # Landing page group
│   └── page.tsx
├── store/
│   └── [vendor-slug]/      # Customer-facing store
│       ├── page.tsx
│       ├── plans/
│       ├── signup/
│       ├── onboarding/
│       ├── checkout/
│       └── portal/
├── dashboard/              # Vendor dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   ├── customers/
│   ├── menu/
│   ├── kitchen/
│   ├── orders/
│   └── settings/
├── api/                    # API routes (webhooks, etc.)
└── layout.tsx              # Root layout
```

### Database Rules
- Always use migrations — never modify DB manually
- Generate types after every migration: `supabase gen types typescript`
- Write RLS policies for every table — no exceptions
- Use database functions for complex operations (e.g. creating a subscription + first order atomically)

### Testing Approach
- Test critical flows manually after each phase
- Write integration tests for payment and subscription logic
- Use Supabase local development for testing

### Git Workflow
- One branch per phase (e.g. `phase-1-landing`, `phase-2-schema`)
- Commit frequently with descriptive messages
- Merge to `main` when phase is complete and tested

---

## Definitions & Glossary

| Term | Meaning |
|------|---------|
| Vendor | A meal plan business using BoxVibe (e.g. GRAMS) |
| Plan | A dietary approach (e.g. High Protein, Keto) |
| Package | A bundle of meal types within a plan (e.g. Lunch + Dinner) |
| Portion Tier | A calorie/macro bracket that determines portion sizes |
| Meal | An actual dish served to customers |
| Grammage | Weight in grams of each component on a plate |
| Cooking Loss | % weight lost during cooking (e.g. chicken loses ~25%) |
| White-label | Vendor's customers see vendor branding, not BoxVibe |
| Dogfooding | Using your own product (GRAMS is BoxVibe's first customer) |

---

## Status Tracker

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0: Setup | ⬜ Not started | |
| Phase 1: Landing Page | ⬜ Not started | |
| Phase 2: Database Schema | ⬜ Not started | |
| Phase 3: Storefront | ⬜ Not started | |
| Phase 4: Onboarding & Auth | ⬜ Not started | |
| Phase 5: Checkout | ⬜ Not started | |
| Phase 6: Customer Portal | ⬜ Not started | |
| Phase 7: Vendor Dashboard | ⬜ Not started | |
