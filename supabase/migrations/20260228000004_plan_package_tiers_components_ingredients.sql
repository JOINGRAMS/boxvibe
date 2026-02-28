-- ============================================================
-- BoxVibe — Rename plan_variance → plan_package_tiers
--           Add components and ingredients tables
-- ============================================================
-- Updated hierarchy:
--   plans                    = dietary approach  (High Protein, Keto…)
--   packages                 = meal combination  (Full Day B+L+D, Lunch…)
--   plan_package_tiers       = calorie/price tier within a package
--   items                    = actual dishes / recipes
--   components               = sub-recipes within a dish
--   component_ingredients    = raw materials + quantities per component
--   ingredients              = ingredient catalog (raw materials)
-- ============================================================

-- ─── Step 1: Rename plan_variance → plan_package_tiers ─────────────────────
alter table plan_variance               rename to plan_package_tiers;
alter table plan_variance_item_categories rename to plan_package_tier_item_categories;

-- ─── Step 2: Rename FK columns ─────────────────────────────────────────────
-- plan_package_tier_item_categories: package_variance_id → plan_package_tier_id
alter table plan_package_tier_item_categories
  rename column package_variance_id to plan_package_tier_id;

-- subscriptions: plan_variant_id → plan_package_tier_id
alter table subscriptions
  rename column plan_variant_id to plan_package_tier_id;

-- ─── Step 3: Create ingredients table ──────────────────────────────────────
-- Ingredient catalog: raw materials used across all recipes
create table ingredients (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid not null references vendors(id) on delete cascade,
  name_en         text not null,
  name_ar         text not null,
  unit            text not null,          -- 'g', 'ml', 'pcs', 'kg', 'l'
  cost_per_unit   numeric(10,4),          -- optional, enables food cost reports
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table ingredients enable row level security;

create policy "ingredients_select"
  on ingredients for select
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "ingredients_insert"
  on ingredients for insert
  with check (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "ingredients_update"
  on ingredients for update
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "ingredients_delete"
  on ingredients for delete
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

-- ─── Step 4: Create components table ───────────────────────────────────────
-- Named sub-recipes that make up an item/dish
-- Example: "Spiced Chicken Breast", "Garlic Basmati Rice", "House Salad Dressing"
create table components (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid not null references vendors(id) on delete cascade,
  item_id         uuid not null references items(id) on delete cascade,
  name_en         text not null,
  name_ar         text not null,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table components enable row level security;

create policy "components_select"
  on components for select
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "components_insert"
  on components for insert
  with check (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "components_update"
  on components for update
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "components_delete"
  on components for delete
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

-- ─── Step 5: Create component_ingredients junction table ───────────────────
-- Links ingredients to components with quantity + cooking loss data
-- quantity_raw: weight/volume before cooking (used for procurement)
-- cooking_loss_percent: % lost during cooking (used for accurate portioning)
create table component_ingredients (
  id                      uuid primary key default gen_random_uuid(),
  vendor_id               uuid not null references vendors(id) on delete cascade,
  component_id            uuid not null references components(id) on delete cascade,
  ingredient_id           uuid not null references ingredients(id) on delete restrict,
  quantity_raw            numeric(10,3) not null,          -- raw qty before cooking
  cooking_loss_percent    numeric(5,2) not null default 0, -- % weight lost cooking
  unit                    text not null,                   -- 'g', 'ml', 'pcs'
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table component_ingredients enable row level security;

create policy "component_ingredients_select"
  on component_ingredients for select
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "component_ingredients_insert"
  on component_ingredients for insert
  with check (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "component_ingredients_update"
  on component_ingredients for update
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );

create policy "component_ingredients_delete"
  on component_ingredients for delete
  using (
    vendor_id in (
      select vendors_id from vendors_users where account_id = auth.uid()
    )
  );
