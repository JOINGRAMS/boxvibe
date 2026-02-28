-- ============================================================
-- BoxVibe — Add slug columns for URL routing
-- Phase 3: Web Store Storefront
-- ============================================================
-- Slugs power the clean URL structure:
--   /store/[vendor-slug]
--   /store/[vendor-slug]/plans/[plan-slug]
--   /store/[vendor-slug]/plans/[plan-slug]/[package-slug]
-- ============================================================

-- vendors.slug — globally unique (e.g. "grams", "fuel-kw")
alter table vendors
  add column slug text unique;

-- plans.slug — unique per vendor (e.g. "high-protein", "keto")
alter table plans
  add column slug text;

create unique index plans_vendor_slug_idx
  on plans (vendor_id, slug)
  where slug is not null;

-- packages.slug — unique per vendor (e.g. "full-day", "lunch-dinner")
alter table packages
  add column slug text;

create unique index packages_vendor_slug_idx
  on packages (vendor_id, slug)
  where slug is not null;
