-- ============================================================
-- BoxVibe — Rename packages → plans
-- Phase 2 schema correction
-- ============================================================
-- Renames all package* tables to plan* equivalents and updates
-- every package_id / package_variant_id column to match.
-- PostgreSQL automatically updates FK constraint targets when
-- tables are renamed; constraint names stay as-is (cosmetic only).
-- ============================================================

-- ─── Step 1: Rename tables ───────────────────────────────────
alter table packages                      rename to plans;
alter table package_variance              rename to plan_variance;
alter table package_categories            rename to plan_categories;
alter table package_items                 rename to plan_items;
alter table package_package_categories    rename to plan_plan_categories;
alter table package_variance_item_categories rename to plan_variance_item_categories;
alter table favorite_packages             rename to favorite_plans;
alter table available_package_addons      rename to available_plan_addons;
alter table vendor_subscriptions_packages rename to vendor_subscriptions_plans;
alter table selected_package_categories   rename to selected_plan_categories;

-- ─── Step 2: Rename package_id → plan_id ────────────────────
-- available_plan_addons
alter table available_plan_addons
  rename column package_id to plan_id;

-- favorite_plans
alter table favorite_plans
  rename column package_id to plan_id;

-- orders
alter table orders
  rename column package_id to plan_id;

-- plan_items
alter table plan_items
  rename column package_id to plan_id;

-- plan_plan_categories
alter table plan_plan_categories
  rename column package_id to plan_id;

-- plan_variance
alter table plan_variance
  rename column package_id to plan_id;

-- selected_plan_categories
alter table selected_plan_categories
  rename column package_id to plan_id;

-- subscriptions
alter table subscriptions
  rename column package_id to plan_id;

alter table subscriptions
  rename column package_variant_id to plan_variant_id;

-- vendor_subscriptions
alter table vendor_subscriptions
  rename column package_id to plan_id;

-- vendor_subscriptions_plans
alter table vendor_subscriptions_plans
  rename column package_id to plan_id;

-- ─── Step 3: Rename package_category_id → plan_category_id ──
-- menu_day_item_categories references plan_categories
alter table menu_day_item_categories
  rename column package_category_id to plan_category_id;
