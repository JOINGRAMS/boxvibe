-- ============================================================
-- BoxVibe — AI Menu Builder schema
-- Adds: recipe_imports, item_versions, item_version_ingredients
-- Alters: items (add AI/recipe columns), ingredients (add macro columns)
-- ============================================================

-- ─── Step 1: Create recipe_imports table ──────────────────────────────────────
-- Tracks each AI-powered recipe upload job
create table recipe_imports (
  id                  uuid primary key default gen_random_uuid(),
  vendor_id           uuid not null references vendors(id) on delete cascade,
  status              text not null default 'pending',  -- pending | processing | completed | failed
  original_filename   text not null,
  file_url            text,                             -- Supabase storage URL
  file_type           text,                             -- 'pdf', 'txt', 'image', etc.
  ai_raw_response     jsonb,                            -- full AI response for debugging
  ai_extracted_data   jsonb,                            -- structured recipe data extracted by AI
  error_message       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table recipe_imports enable row level security;

create policy "recipe_imports_select" on recipe_imports for select
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "recipe_imports_insert" on recipe_imports for insert
  with check (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "recipe_imports_update" on recipe_imports for update
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "recipe_imports_delete" on recipe_imports for delete
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

-- ─── Step 2: Alter items — add AI/recipe columns ─────────────────────────────
alter table items
  add column if not exists meal_type_id       uuid references meal_types(id) on delete set null,
  add column if not exists cuisine_tag        text,
  add column if not exists prep_method        text,
  add column if not exists cooking_method     text,
  add column if not exists base_calories      numeric(8,2),
  add column if not exists base_protein_g     numeric(8,2),
  add column if not exists base_carbs_g       numeric(8,2),
  add column if not exists base_fat_g         numeric(8,2),
  add column if not exists recipe_import_id   uuid references recipe_imports(id) on delete set null,
  add column if not exists ai_reviewed        boolean not null default false;

-- ─── Step 3: Alter ingredients — add nutritional macro columns ────────────────
alter table ingredients
  add column if not exists calories_per_100g  numeric(8,2),
  add column if not exists protein_per_100g   numeric(8,2),
  add column if not exists carbs_per_100g     numeric(8,2),
  add column if not exists fat_per_100g       numeric(8,2);

-- ─── Step 4: Create item_versions table ───────────────────────────────────────
-- Each row = one scaled version of a dish for a specific plan × portion_size
-- e.g. "Grilled Chicken Salad" → High Protein × Medium → 400 kcal version
create table item_versions (
  id                  uuid primary key default gen_random_uuid(),
  vendor_id           uuid not null references vendors(id) on delete cascade,
  item_id             uuid not null references items(id) on delete cascade,
  plan_id             uuid not null references plans(id) on delete cascade,
  portion_size_id     uuid not null references portion_sizes(id) on delete cascade,
  total_calories      numeric(8,2) not null,
  total_protein_g     numeric(8,2) not null,
  total_carbs_g       numeric(8,2) not null,
  total_fat_g         numeric(8,2) not null,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (item_id, plan_id, portion_size_id)
);

alter table item_versions enable row level security;

create policy "item_versions_select" on item_versions for select
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "item_versions_insert" on item_versions for insert
  with check (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "item_versions_update" on item_versions for update
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "item_versions_delete" on item_versions for delete
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

-- ─── Step 5: Create item_version_ingredients table ────────────────────────────
-- Per-ingredient scaled grammage for each item version
create table item_version_ingredients (
  id                      uuid primary key default gen_random_uuid(),
  item_version_id         uuid not null references item_versions(id) on delete cascade,
  component_ingredient_id uuid not null references component_ingredients(id) on delete cascade,
  quantity_raw_scaled     numeric(10,3) not null,   -- scaled raw qty for this version
  quantity_cooked         numeric(10,3),             -- after cooking loss
  calories                numeric(8,2),
  protein_g               numeric(8,2),
  carbs_g                 numeric(8,2),
  fat_g                   numeric(8,2),
  created_at              timestamptz not null default now(),
  unique (item_version_id, component_ingredient_id)
);

alter table item_version_ingredients enable row level security;

-- RLS via item_versions → vendor_id
create policy "item_version_ingredients_select" on item_version_ingredients for select
  using (
    item_version_id in (
      select id from item_versions
      where vendor_id in (select vendors_id from vendors_users where account_id = auth.uid())
    )
  );

create policy "item_version_ingredients_insert" on item_version_ingredients for insert
  with check (
    item_version_id in (
      select id from item_versions
      where vendor_id in (select vendors_id from vendors_users where account_id = auth.uid())
    )
  );

create policy "item_version_ingredients_update" on item_version_ingredients for update
  using (
    item_version_id in (
      select id from item_versions
      where vendor_id in (select vendors_id from vendors_users where account_id = auth.uid())
    )
  );

create policy "item_version_ingredients_delete" on item_version_ingredients for delete
  using (
    item_version_id in (
      select id from item_versions
      where vendor_id in (select vendors_id from vendors_users where account_id = auth.uid())
    )
  );
