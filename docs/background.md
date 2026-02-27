# BoxVibe — Background & Business Model

## What Is BoxVibe?
BoxVibe is the "Shopify of meal plans" — a white-labeled, AI-powered platform 
that gives meal plan businesses (vendors) everything they need to operate: 
a branded mobile app for their customers, a web dashboard for their team, 
and agentic AI that replaces manual data entry across the entire operation.

Built by the founder of GRAMS, a meal subscription company in the UAE, 
BoxVibe is designed from real operational pain — not theory.

---

## The Problem It Solves
Meal plan companies in the GCC cannot build their own tech stack. They rely 
on spreadsheets, WhatsApp groups, and manual data entry teams (6-7 people) 
to run daily operations. There is no purpose-built software for this industry.

BoxVibe solves this by providing:
- A ready-made, white-labeled tech stack (web + mobile)
- AI agents that automate the painful operational workflows
- A vendor onboarding experience as simple as setting up a Shopify store

---

## Business Model
- **License fee:** Monthly SaaS subscription per vendor
- **Transaction fee:** ~5% on order value (per transaction)
- **Market:** UAE first, then GCC, then global
- **First customer:** GRAMS (the founder's own company — dogfooding from day one)

---

## User Roles

| Role | Access |
|------|--------|
| Super Admin (BoxVibe) | Full platform control, vendor management, licensing |
| Vendor Admin | Full dashboard access for their operation |
| Kitchen Staff | Kitchen-specific views (shopping, cooking, plating, packing) |
| Sales / Customer Rep | Customer management, support access |
| Customer | Mobile app only |

---

## The Hierarchy of a Meal Plan

### 1. Plan
The dietary goal or approach. Examples:
- High Protein
- Keto
- Low Carb High Protein
- Weight Loss
- Balanced
- Lunch Plan

### 2. Package
The bundle of meal types within a plan. Examples:
- Lunch + Dinner (High Protein)
- Breakfast + Lunch + Dinner + Snack (Balanced)
- Lunch only (Weight Loss)

### 3. Meal Types
- **Main meals:** Lunch, Dinner — hot meals, bowls, protein + carb based, come in sizes
- **Breakfast:** Semi-main, comes in sizes
- **Snacks, sides, soups, salads:** Standard size, no portioning matrix

### 4. Portion / Calorie Tier (The Matrix)
Each package has a calorie/macro matrix that determines portion sizes per meal.
Example for High Protein Lunch + Dinner:

| Tier | Calories | Lunch | Dinner |
|------|----------|-------|--------|
| Tier 1 | 1000–1200 kcal | Small | Small |
| Tier 2 | 1200–1400 kcal | Small | Medium |
| Tier 3 | 1400–1600 kcal | Medium | Medium |
| Tier 4 | 1600–1800 kcal | Medium | Large |

Portion sizes are defined in grams per macronutrient (protein + carbs).
Future goal: AI-personalized portions down to the gram per customer.

### 5. Meals (The Actual Dishes)
- Rotate daily or weekly — vendor configures the schedule
- Customers can mix and match meals
- Each meal has ingredients, grammage per portion size, and macro/calorie data

---

## Customer Journey

### Onboarding
1. Customer downloads vendor's white-labeled app
2. Inputs biometrics: height, weight, age, activity level, fitness goal
   - OR connects Apple Health to auto-fetch data
3. AI (or algorithm) recommends the best Plan + Package + Calorie Tier
4. Customer can override and choose manually (flexibility always preserved)
5. Subscription begins

### Daily App Experience
- View today's meals
- Swap / mix and match meals
- Rate meals
- Pause or resume subscription
- Track their subscription stats (days active, orders, LTV)

### Customer Profile (Dashboard View for Vendor)
- Biometrics and calorie targets
- Plan, package, and portion tier
- Meal choices and ratings
- Subscription status, pause history
- Days since joining, total orders, LTV
- Referrals generated
- Delivery location(s)

---

## Kitchen Operations Flow

All kitchen workflows are driven by customer app data. Zero manual input.

### Stage 1: Shopping List
- Aggregates all customer meal choices for the day
- Calculates total raw ingredient quantities needed (pre-cooking weight)
- Accounts for cooking loss (e.g. chicken breast loses ~25% weight when cooked)
- Output: ingredient shopping list by weight, eliminating waste

### Stage 2: Cooking
- Kitchen staff see exactly how much of each ingredient to cook
- Quantities are post-shopping-list, pre-plating
- Displayed on kitchen display / printable

### Stage 3: Plating
- Most critical stage
- Each customer's plate is assembled based on their portion tier
- Staff see per-customer portion instructions
- Future: AI-calculated gram-level precision per customer biometrics

### Stage 4: Packing
- Each bag is packed with the correct meals per customer's daily choices
- Verified against app data to prevent errors

---

## Vendor Menu Management

### Menu Structure
- Each vendor creates and manages their own menu
- Meals are assigned to Plan → Package → Portion Tier hierarchy
- Menus can rotate daily or weekly with per-day flexibility

### Menu Import (Core Differentiator)
- Vendors can import menus via Excel
- AI agent reads the Excel and auto-maps meals to the 
  Plan → Package → Portion Tier hierarchy
- AI infers ingredients, grammage, and macros where possible
- Vendor reviews and confirms — no manual 1-by-1 entry
- This solves one of the most painful vendor onboarding problems in the industry

---

## Delivery
- Delivered daily by default (flexibility for every 2–3 days or weekly)
- Logistics handled via third-party API integration (e.g. logistics portal)
- Vendor configures delivery schedule and zones

---

## Integrations
- **Payments:** Tap Payments
- **Notifications:** WhatsApp + SMS + Email
- **Health data:** Apple Health (biometric sync)
- **Logistics:** Third-party delivery API (TBD per vendor)
- **Kitchen:** Automated kitchen display + print

---

## Tech Stack
- **Web Dashboard:** Next.js, React, TypeScript
- **Mobile App:** Expo (React Native)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **AI:** To be defined — agentic workflows throughout

---

## Product Philosophy
- **AI as a Service, not just SaaS** — agents replace manual work, they are not a bolt-on
- **Ease of use is non-negotiable** — if it requires heavy manual input, it is not done
- **Vendor first** — every feature must reduce operational burden
- **Data driven** — every customer decision should eventually be driven by their data
- **Start GCC, scale global**

---

## MVP Scope (Phase 1)
- Vendor dashboard (web)
- Customer mobile app (Expo)
- Plan → Package → Portion Tier → Meal hierarchy
- Customer onboarding with biometric input + AI plan recommendation
- Kitchen flow: shopping list → cooking → plating → packing views
- Menu import via Excel with AI auto-mapping
- Tap Payments integration
- WhatsApp/SMS notifications
- Super admin panel (BoxVibe license management)
- Delivery scheduling (daily default, flexible)

---

## Future Roadmap
- Gram-level AI portion personalization per customer biometrics
- Fully personalized one-customer-one-plan model
- Referral and loyalty engine
- Expansion beyond GCC
