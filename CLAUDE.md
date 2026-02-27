# CLAUDE.md — BoxVibe

> Claude Code reads this file automatically at the start of every session.
> It provides project context, conventions, and rules to follow.

---

## Project Overview

BoxVibe is the "Shopify of meal plans" — a white-labeled, AI-powered SaaS platform for meal subscription businesses in the GCC region. The first customer is GRAMS, the founder's own meal subscription company in the UAE.

**Read these files for full context:**
- `docs/background.md` — Business model, domain knowledge, user roles, kitchen operations
- `docs/plan.md` — Development phases, schema design, build order, and status tracker

---

## Current Status

Check the **Status Tracker** at the bottom of `docs/plan.md` to see which phase we're on. Always confirm with the user which phase or task to work on before starting.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Payments:** Tap Payments
- **Deployment:** Vercel
- **Monorepo:** Turborepo
- **Package Manager:** pnpm

---

## Project Structure

```
boxvibe/
├── apps/
│   └── web/                  # Next.js app (landing + store + dashboard)
├── packages/
│   ├── ui/                   # Shared UI components (shadcn/ui based)
│   ├── db/                   # Supabase client, types, queries
│   ├── utils/                # Shared utilities
│   └── config/               # Shared config (tailwind, tsconfig)
├── supabase/
│   ├── migrations/           # SQL migration files (never edit DB manually)
│   └── seed.sql              # Development seed data
├── docs/
│   ├── background.md
│   ├── plan.md
│   └── wireframes/
└── CLAUDE.md                 # This file
```

---

## Code Conventions

### TypeScript
- Strict mode — no `any` types, ever
- Use Zod for all validation (forms, API inputs, webhook payloads)
- Generate and use Supabase types everywhere: `supabase gen types typescript --project-id <id> --schema public > packages/db/src/types.ts`
- Prefer `interface` for object shapes, `type` for unions and intersections

### React / Next.js
- **Server Components by default** — only add `"use client"` when the component needs interactivity (forms, modals, state, effects)
- Use Server Actions for mutations (form submissions, data updates)
- Use React Hook Form + Zod for complex forms
- Keep components small and focused — one responsibility per component
- Co-locate related files in feature folders

### Naming
- **Files:** `kebab-case.tsx` (e.g. `plan-card.tsx`, `checkout-form.tsx`)
- **Components:** `PascalCase` (e.g. `PlanCard`, `CheckoutForm`)
- **Functions/variables:** `camelCase`
- **Database columns:** `snake_case`
- **Route folders:** `kebab-case`

### Styling
- Tailwind CSS utility classes — no custom CSS files unless absolutely necessary
- Use shadcn/ui components as the base — customize via Tailwind, don't reinvent
- Mobile-first: always start with mobile layout, then add `md:` and `lg:` breakpoints
- Use CSS variables for vendor brand theming (colors, fonts pulled from DB)

### File Organization (apps/web)
```
app/
├── (landing)/              # Landing page (public)
├── store/[vendor-slug]/    # Customer-facing store (public + auth)
├── dashboard/              # Vendor dashboard (auth required)
├── api/                    # API routes (webhooks, cron)
└── layout.tsx              # Root layout
```

---

## Database Rules

1. **Always use migrations.** Create SQL migration files in `supabase/migrations/`. Never modify the database directly through the Supabase UI in production.
2. **RLS on every table.** Write Row Level Security policies for every new table. No exceptions. Test that unauthorized access is blocked.
3. **Vendor-scoped everything.** Almost every table has a `vendor_id` column. Every query must filter by vendor. Multi-tenancy is the foundation.
4. **Use database functions** for operations that must be atomic (e.g. creating a subscription + first order + payment record together).
5. **Regenerate types** after every migration: run the type generation command and commit the updated types file.

---

## Domain Knowledge

This is a meal subscription platform. The core hierarchy is:

```
Vendor → Plan → Package → Portion Tier → Meals → Ingredients
```

Key concepts to understand:
- **Plan** = dietary approach (High Protein, Keto, Balanced)
- **Package** = which meal types are included (Lunch+Dinner, Breakfast+Lunch+Dinner+Snack)
- **Portion Tier** = calorie bracket that determines portion sizes per meal type
- **Meals** = actual dishes, rotated on a schedule
- **Grammage** = weight in grams per ingredient per portion size
- **Cooking Loss** = weight lost during cooking (~25% for chicken, varies by ingredient)

Refer to `docs/background.md` for the full domain model, kitchen operations flow, and customer journey.

---

## Key Patterns

### Multi-tenancy
Every customer-facing route uses `[vendor-slug]` to scope to the correct vendor:
```
/store/grams/plans          → shows GRAMS plans
/store/another-vendor/plans → shows that vendor's plans
```

Vendor branding (logo, colors) is loaded from the `vendors` table and applied via CSS variables.

### Authentication
- **Customers:** Supabase Auth with email OTP (magic link) — no passwords
- **Vendor staff:** Supabase Auth with email + password
- Two separate auth flows, same Supabase project — differentiated by role in a `profiles` or `user_roles` table

### Payments
- Tap Payments for GCC market (supports AED, SAR, etc.)
- Server-side charge creation — never expose secret keys to the client
- Webhook handler at `/api/webhooks/tap` for payment confirmation
- Idempotent processing — handle duplicate webhooks gracefully

---

## Do's and Don'ts

### Do
- Read `docs/plan.md` to understand the current phase before coding
- Ask the user to clarify requirements when the plan is ambiguous
- Write clean, readable code with clear variable names
- Add brief comments for complex business logic (especially kitchen operations)
- Test RLS policies after creating them
- Commit frequently with descriptive messages
- Use existing shadcn/ui components before building custom ones

### Don't
- Skip phases or build features out of order
- Use `any` type — find or create the proper type
- Write raw SQL in components — use the `packages/db` query layer
- Create API routes for things that can be Server Actions
- Hardcode vendor-specific data — everything must be dynamic and vendor-scoped
- Install unnecessary packages — keep dependencies minimal
- Use `var` — always `const` or `let`

---

## Commands Reference

```bash
# Development
pnpm dev                    # Start all apps in dev mode
pnpm dev --filter web       # Start only the web app

# Database
supabase start              # Start local Supabase
supabase db reset           # Reset DB and run migrations + seed
supabase migration new <name>  # Create new migration file
supabase gen types typescript --local > packages/db/src/types.ts  # Regen types

# Build & Deploy
pnpm build                  # Build all apps
pnpm lint                   # Lint all apps

# Packages
pnpm add <pkg> --filter web       # Add dependency to web app
pnpm add <pkg> --filter db        # Add dependency to db package
```

---

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server-side only, never expose

# Tap Payments
TAP_SECRET_KEY=                     # Server-side only
NEXT_PUBLIC_TAP_PUBLIC_KEY=

# App
NEXT_PUBLIC_APP_URL=                # e.g. https://boxvibe.com
```

---

## User Context

The founder (Mustafa) is non-technical but learning. When explaining decisions or asking questions:
- Be clear and direct
- Explain the "why" behind technical choices briefly
- Don't assume deep coding knowledge
- Offer step-by-step guidance when needed
- When in doubt, keep it simple — complexity can be added later
