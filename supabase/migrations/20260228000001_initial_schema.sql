-- ============================================================
-- BoxVibe — Initial Schema (Reference)
-- Phase 2: Database Schema
-- ============================================================
-- NOTE: This migration file documents the intended BoxVibe schema.
-- The actual Supabase project already contains a production schema
-- (created outside this migration system) which has been marked
-- as "applied" in supabase_migrations.
--
-- The live types are in: packages/db/src/types.ts
-- Regenerate with: supabase gen types typescript --project-id mubtcfcomznorttiidqc --schema public > packages/db/src/types.ts
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────
create type meal_type_enum as enum (
  'breakfast', 'lunch', 'dinner', 'snack', 'side', 'soup', 'salad'
);

create type subscription_status as enum (
  'active', 'paused', 'cancelled', 'expired'
);

create type order_status as enum (
  'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'
);

create type user_role as enum (
  'vendor_admin', 'kitchen_staff', 'sales_rep'
);

-- ─── vendors ─────────────────────────────────────────────────
-- One row per meal plan business (e.g. GRAMS).
-- slug is used in store URLs: /store/grams
create table vendors (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  logo_url      text,
  brand_colors  jsonb not null default '{"primary":"#1e293b","secondary":"#f97316"}'::jsonb,
  domain        text,
  -- settings: delivery zones, currency, timezone, etc.
  settings      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── user_roles ──────────────────────────────────────────────
-- Links a Supabase auth user to a vendor with a role.
-- Vendor staff (admin, kitchen, sales) are stored here.
-- Customers use the customers table instead.
create table user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  vendor_id   uuid not null references vendors(id) on delete cascade,
  role        user_role not null default 'vendor_admin',
  created_at  timestamptz not null default now(),
  unique(user_id, vendor_id)
);

-- ─── plans ───────────────────────────────────────────────────
-- Dietary approaches offered by a vendor.
-- e.g. High Protein, Keto, Balanced, Vegetarian
create table plans (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references vendors(id) on delete cascade,
  name        text not null,
  description text,
  image_url   text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── packages ────────────────────────────────────────────────
-- A bundle of meal types within a plan.
-- e.g. "Lunch + Dinner" or "Full Day (B+L+D)"
create table packages (
  id            uuid primary key default gen_random_uuid(),
  plan_id       uuid not null references plans(id) on delete cascade,
  vendor_id     uuid not null references vendors(id) on delete cascade,
  name          text not null,
  description   text,
  -- meal_types: array of meal_type_enum strings
  -- e.g. ["lunch", "dinner"]
  meal_types    jsonb not null default '[]'::jsonb,
  duration_days integer not null default 7,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── portion_tiers ───────────────────────────────────────────
-- Calorie brackets within a package.
-- Determines portion sizes per meal type and the price.
-- e.g. Tier 2 (1200–1500 kcal) → lunch: medium, dinner: medium → AED 590
create table portion_tiers (
  id                uuid primary key default gen_random_uuid(),
  package_id        uuid not null references packages(id) on delete cascade,
  vendor_id         uuid not null references vendors(id) on delete cascade,
  name              text not null,
  calorie_range_min integer not null,
  calorie_range_max integer not null,
  -- portions: map of meal_type → portion size label
  -- e.g. {"lunch": "medium", "dinner": "large"}
  portions          jsonb not null default '{}'::jsonb,
  price             numeric(10, 2) not null,
  price_modifier    numeric(5, 2) not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ─── meals ───────────────────────────────────────────────────
-- Individual dishes in the vendor's menu.
create table meals (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references vendors(id) on delete cascade,
  name        text not null,
  description text,
  image_url   text,
  meal_type   meal_type_enum not null,
  -- ingredients: [{name, quantity, unit, cooking_loss_pct}]
  ingredients jsonb not null default '[]'::jsonb,
  -- macros: {calories, protein, carbs, fat}
  macros      jsonb not null default '{}'::jsonb,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── meal_schedule ───────────────────────────────────────────
-- Assigns meals to specific dates for rotation planning.
create table meal_schedule (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references vendors(id) on delete cascade,
  meal_id     uuid not null references meals(id) on delete cascade,
  date        date not null,
  meal_type   meal_type_enum not null,
  created_at  timestamptz not null default now(),
  unique(vendor_id, date, meal_type, meal_id)
);

-- ─── customers ───────────────────────────────────────────────
-- End-customers who subscribe to a vendor's plans.
-- user_id links to Supabase auth — set when customer creates an account.
create table customers (
  id                      uuid primary key default gen_random_uuid(),
  vendor_id               uuid not null references vendors(id) on delete cascade,
  user_id                 uuid references auth.users(id) on delete set null,
  name                    text not null,
  email                   text not null,
  phone                   text,
  -- delivery_address: {street, area, city, emirate, notes}
  delivery_address        jsonb not null default '{}'::jsonb,
  -- biometrics: {height_cm, weight_kg, age, gender, activity_level, goal}
  biometrics              jsonb not null default '{}'::jsonb,
  recommended_plan_id     uuid references plans(id) on delete set null,
  recommended_package_id  uuid references packages(id) on delete set null,
  recommended_tier_id     uuid references portion_tiers(id) on delete set null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique(vendor_id, email)
);

-- ─── subscriptions ───────────────────────────────────────────
-- Active or historical subscription of a customer to a plan/package/tier.
create table subscriptions (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid not null references customers(id) on delete cascade,
  vendor_id        uuid not null references vendors(id) on delete cascade,
  plan_id          uuid not null references plans(id),
  package_id       uuid not null references packages(id),
  portion_tier_id  uuid not null references portion_tiers(id),
  status           subscription_status not null default 'active',
  start_date       date not null,
  end_date         date,
  -- pause_history: [{paused_at, resumed_at, reason}]
  pause_history    jsonb not null default '[]'::jsonb,
  payment_method_id text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── orders ──────────────────────────────────────────────────
-- One order per customer per day, generated from their subscription.
create table orders (
  id               uuid primary key default gen_random_uuid(),
  subscription_id  uuid not null references subscriptions(id) on delete cascade,
  customer_id      uuid not null references customers(id),
  vendor_id        uuid not null references vendors(id),
  date             date not null,
  status           order_status not null default 'pending',
  -- meals: [{meal_id, name, meal_type, portion_size}]
  meals            jsonb not null default '[]'::jsonb,
  total_amount     numeric(10, 2) not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── payments ────────────────────────────────────────────────
-- Payment records linked to orders. tap_payment_id is the Tap Payments charge ID.
create table payments (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid references orders(id) on delete set null,
  customer_id      uuid not null references customers(id),
  vendor_id        uuid not null references vendors(id),
  amount           numeric(10, 2) not null,
  currency         text not null default 'AED',
  status           text not null default 'pending',
  tap_payment_id   text,
  -- payment_method: {type, last4, brand, exp_month, exp_year}
  payment_method   jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── waitlist ────────────────────────────────────────────────
-- Landing page email capture (before full auth is live).
create table waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text not null default 'landing',
  created_at  timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────
-- Vendor lookups by slug (most common storefront query)
create index idx_vendors_slug on vendors(slug);

-- All vendor-scoped table lookups
create index idx_plans_vendor_id on plans(vendor_id);
create index idx_packages_plan_id on packages(plan_id);
create index idx_packages_vendor_id on packages(vendor_id);
create index idx_portion_tiers_package_id on portion_tiers(package_id);
create index idx_meals_vendor_id on meals(vendor_id);
create index idx_meal_schedule_vendor_date on meal_schedule(vendor_id, date);
create index idx_customers_vendor_id on customers(vendor_id);
create index idx_customers_user_id on customers(user_id);
create index idx_subscriptions_customer_id on subscriptions(customer_id);
create index idx_subscriptions_vendor_id on subscriptions(vendor_id);
create index idx_orders_vendor_date on orders(vendor_id, date);
create index idx_orders_customer_id on orders(customer_id);
create index idx_payments_vendor_id on payments(vendor_id);
create index idx_user_roles_user_id on user_roles(user_id);

-- ─── updated_at trigger ──────────────────────────────────────
create or replace function trigger_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on vendors
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on plans
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on packages
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on portion_tiers
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on meals
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on customers
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on subscriptions
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on orders
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on payments
  for each row execute function trigger_set_updated_at();

-- ─── RLS — Enable on all tables ──────────────────────────────
alter table vendors        enable row level security;
alter table user_roles     enable row level security;
alter table plans          enable row level security;
alter table packages       enable row level security;
alter table portion_tiers  enable row level security;
alter table meals          enable row level security;
alter table meal_schedule  enable row level security;
alter table customers      enable row level security;
alter table subscriptions  enable row level security;
alter table orders         enable row level security;
alter table payments       enable row level security;
alter table waitlist       enable row level security;

-- ─── RLS Helper functions ────────────────────────────────────
-- Returns the vendor_id for the currently authenticated vendor staff user.
create or replace function get_user_vendor_id()
returns uuid language sql stable security definer as $$
  select vendor_id from user_roles where user_id = auth.uid() limit 1;
$$;

-- Returns true if the current user is vendor staff for the given vendor.
create or replace function is_vendor_staff(vid uuid)
returns boolean language sql stable security definer as $$
  select exists(
    select 1 from user_roles
    where user_id = auth.uid() and vendor_id = vid
  );
$$;

-- ─── RLS Policies — vendors ──────────────────────────────────
create policy "vendor_staff_select"
  on vendors for select
  using (is_vendor_staff(id));

create policy "vendor_admin_update"
  on vendors for update
  using (is_vendor_staff(id));

-- ─── RLS Policies — user_roles ───────────────────────────────
create policy "own_role_select"
  on user_roles for select
  using (user_id = auth.uid());

-- ─── RLS Policies — plans ────────────────────────────────────
-- Active plans are publicly visible (needed for customer storefront).
create policy "plans_public_select"
  on plans for select
  using (is_active = true);

create policy "plans_vendor_all"
  on plans for all
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — packages ─────────────────────────────────
create policy "packages_public_select"
  on packages for select
  using (is_active = true);

create policy "packages_vendor_all"
  on packages for all
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — portion_tiers ────────────────────────────
create policy "portion_tiers_public_select"
  on portion_tiers for select
  using (true);

create policy "portion_tiers_vendor_all"
  on portion_tiers for all
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — meals ────────────────────────────────────
create policy "meals_public_select"
  on meals for select
  using (is_active = true);

create policy "meals_vendor_all"
  on meals for all
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — meal_schedule ────────────────────────────
create policy "meal_schedule_public_select"
  on meal_schedule for select
  using (true);

create policy "meal_schedule_vendor_all"
  on meal_schedule for all
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — customers ────────────────────────────────
-- Customers can see and update their own profile.
create policy "customer_own_select"
  on customers for select
  using (user_id = auth.uid());

create policy "customer_own_update"
  on customers for update
  using (user_id = auth.uid());

-- Vendor staff can do anything with their vendor's customers.
create policy "customers_vendor_all"
  on customers for all
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — subscriptions ────────────────────────────
create policy "subscription_own_select"
  on subscriptions for select
  using (
    customer_id in (
      select id from customers where user_id = auth.uid()
    )
  );

create policy "subscriptions_vendor_all"
  on subscriptions for all
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — orders ───────────────────────────────────
create policy "order_own_select"
  on orders for select
  using (
    customer_id in (
      select id from customers where user_id = auth.uid()
    )
  );

create policy "orders_vendor_all"
  on orders for all
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — payments ─────────────────────────────────
create policy "payment_own_select"
  on payments for select
  using (
    customer_id in (
      select id from customers where user_id = auth.uid()
    )
  );

create policy "payments_vendor_select"
  on payments for select
  using (is_vendor_staff(vendor_id));

-- ─── RLS Policies — waitlist ─────────────────────────────────
-- Anyone (including anonymous users) can add their email.
create policy "waitlist_public_insert"
  on waitlist for insert
  with check (true);
