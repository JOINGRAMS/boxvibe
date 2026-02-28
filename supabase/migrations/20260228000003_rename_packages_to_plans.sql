-- ============================================================
-- BoxVibe — Rename schema to match product hierarchy
-- Phase 2 schema correction (replaces failed migration 002)
-- ============================================================
-- Final hierarchy:
--   plans             = dietary approach  (High Protein, Keto…)
--   packages          = meal combination  (Full Day B+L+D, Lunch…)
--   plan_variance     = calorie/price tier within a package
--   items             = actual dishes
--
-- Source mapping (original DB name → new name):
--   packages                    → plans
--   package_categories          → packages
--   package_variance            → plan_variance
--   package_items               → plan_items
--   package_package_categories  → plan_packages  (junction: plan↔package)
--   package_variance_item_categories → plan_variance_item_categories
--   favorite_packages           → favorite_plans
--   available_package_addons    → available_plan_addons
--   selected_package_categories → selected_packages
--   vendor_subscriptions_packages → unchanged (vendor's BoxVibe SaaS tier)
-- ============================================================

-- ─── Step 1: Rename tables ───────────────────────────────────
alter table packages                      rename to plans;
alter table package_categories            rename to packages;
alter table package_variance              rename to plan_variance;
alter table package_items                 rename to plan_items;
alter table package_package_categories    rename to plan_packages;
alter table package_variance_item_categories rename to plan_variance_item_categories;
alter table favorite_packages             rename to favorite_plans;
alter table available_package_addons      rename to available_plan_addons;
alter table selected_package_categories   rename to selected_packages;

-- ─── Step 2: Rename package_id → plan_id ────────────────────
-- These columns are FKs that pointed to the old `packages` table,
-- which is now `plans`. Rename them accordingly.
alter table available_plan_addons   rename column package_id to plan_id;
alter table favorite_plans          rename column package_id to plan_id;
alter table orders                  rename column package_id to plan_id;
alter table plan_items              rename column package_id to plan_id;
alter table plan_packages           rename column package_id to plan_id;
alter table plan_variance           rename column package_id to plan_id;
alter table selected_packages       rename column package_id to plan_id;
alter table subscriptions           rename column package_id to plan_id;
alter table subscriptions           rename column package_variant_id to plan_variant_id;
alter table vendor_subscriptions    rename column package_id to plan_id;

-- ─── Step 3: Rename category_id → package_id ─────────────────
-- These columns are FKs that pointed to `package_categories`,
-- which is now `packages`. Rename them to package_id.
alter table plan_packages           rename column category_id to package_id;
alter table selected_packages       rename column category_id to package_id;

-- ─── Step 4: Remaining column renames ────────────────────────
-- menu_day_item_categories: package_category_id → package_id
alter table menu_day_item_categories
  rename column package_category_id to package_id;

-- customers: categoryId (FK to packages) → package_id
alter table customers
  rename column "categoryId" to package_id;
