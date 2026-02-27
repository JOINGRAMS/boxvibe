-- ============================================================
-- BoxVibe — Development Seed Data
-- Phase 2: Database Schema
-- ============================================================
-- Run via: supabase db reset (applies all migrations + this file)
-- ONLY for local development. Never run against production.
-- ============================================================

-- ─── GRAMS vendor ────────────────────────────────────────────
insert into vendors (id, name, slug, brand_colors, settings)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'GRAMS',
  'grams',
  '{"primary": "#1e293b", "secondary": "#f97316", "text": "#ffffff"}'::jsonb,
  '{
    "currency": "AED",
    "timezone": "Asia/Dubai",
    "delivery_zones": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
    "delivery_days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]
  }'::jsonb
);

-- ─── Plans ───────────────────────────────────────────────────
insert into plans (id, vendor_id, name, description, is_active, sort_order)
values
  (
    '11111111-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'High Protein',
    'Optimized for muscle building and recovery. High-quality protein sources at every meal keep you satiated and support lean mass gains.',
    true, 1
  ),
  (
    '11111111-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Low Carb',
    'Reduced carbohydrates to support fat loss, stable energy, and metabolic health. No refined sugars or starchy carbs.',
    true, 2
  ),
  (
    '11111111-0000-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Balanced',
    'A well-rounded macro split for overall health, sustained energy, and long-term wellbeing. Great for maintenance or mild fat loss.',
    true, 3
  ),
  (
    '11111111-0000-0000-0000-000000000004',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Vegetarian',
    'Plant-based nutrition with complete protein sources (eggs, dairy, legumes). No meat or seafood.',
    true, 4
  );

-- ─── Packages (for High Protein plan) ────────────────────────
insert into packages (id, plan_id, vendor_id, name, description, meal_types, duration_days, is_active)
values
  (
    '22222222-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Full Day',
    'Breakfast, Lunch, and Dinner — fully covered.',
    '["breakfast", "lunch", "dinner"]'::jsonb,
    7, true
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'B & Lunch',
    'Breakfast and Lunch — ideal if you prepare your own dinner.',
    '["breakfast", "lunch"]'::jsonb,
    7, true
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Lunch',
    'Lunch only — great for office workers who want a healthy midday meal.',
    '["lunch"]'::jsonb,
    7, true
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    '11111111-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dinner',
    'Dinner only — for those who manage their own days and want a clean evening meal.',
    '["dinner"]'::jsonb,
    7, true
  );

-- ─── Portion Tiers (for Full Day package) ─────────────────────
insert into portion_tiers (id, package_id, vendor_id, name, calorie_range_min, calorie_range_max, portions, price)
values
  (
    '33333333-0000-0000-0000-000000000001',
    '22222222-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Tier 1',
    600, 800,
    '{"breakfast": "small", "lunch": "small", "dinner": "small"}'::jsonb,
    390.00
  ),
  (
    '33333333-0000-0000-0000-000000000002',
    '22222222-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Tier 2',
    800, 1000,
    '{"breakfast": "small", "lunch": "medium", "dinner": "medium"}'::jsonb,
    490.00
  ),
  (
    '33333333-0000-0000-0000-000000000003',
    '22222222-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Tier 3',
    1000, 1200,
    '{"breakfast": "medium", "lunch": "large", "dinner": "large"}'::jsonb,
    590.00
  ),
  (
    '33333333-0000-0000-0000-000000000004',
    '22222222-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Tier 4',
    1200, 1400,
    '{"breakfast": "large", "lunch": "large", "dinner": "extra-large"}'::jsonb,
    690.00
  );

-- ─── Meals ───────────────────────────────────────────────────
insert into meals (id, vendor_id, name, description, meal_type, macros, is_active)
values
  -- Breakfasts
  (
    '44444444-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Egg White Omelette',
    'Fluffy egg white omelette with spinach, mushrooms, and light feta cheese.',
    'breakfast',
    '{"calories": 280, "protein": 32, "carbs": 8, "fat": 10}'::jsonb,
    true
  ),
  (
    '44444444-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Greek Yogurt Parfait',
    'Strained Greek yogurt layered with fresh berries and a sprinkle of granola.',
    'breakfast',
    '{"calories": 320, "protein": 22, "carbs": 38, "fat": 6}'::jsonb,
    true
  ),
  -- Lunches
  (
    '44444444-0000-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Grilled Chicken Salad',
    'Tender grilled chicken breast on a bed of mixed greens with lemon tahini dressing.',
    'lunch',
    '{"calories": 420, "protein": 45, "carbs": 18, "fat": 16}'::jsonb,
    true
  ),
  (
    '44444444-0000-0000-0000-000000000004',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Turkey Bowl',
    'Seasoned ground turkey with brown rice, roasted peppers, and half an avocado.',
    'lunch',
    '{"calories": 450, "protein": 40, "carbs": 32, "fat": 16}'::jsonb,
    true
  ),
  (
    '44444444-0000-0000-0000-000000000005',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Tuna Poke Bowl',
    'Sashimi-grade tuna over sushi rice with cucumber, edamame, and sesame dressing.',
    'lunch',
    '{"calories": 480, "protein": 38, "carbs": 42, "fat": 12}'::jsonb,
    true
  ),
  -- Dinners
  (
    '44444444-0000-0000-0000-000000000006',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Salmon with Quinoa',
    'Pan-seared salmon fillet with herbed quinoa and steamed broccoli.',
    'dinner',
    '{"calories": 520, "protein": 42, "carbs": 35, "fat": 18}'::jsonb,
    true
  ),
  (
    '44444444-0000-0000-0000-000000000007',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Beef Stir Fry',
    'Lean beef strips with colorful bell peppers and broccoli in a light soy-ginger sauce.',
    'dinner',
    '{"calories": 480, "protein": 38, "carbs": 28, "fat": 14}'::jsonb,
    true
  ),
  (
    '44444444-0000-0000-0000-000000000008',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Chicken Shawarma Plate',
    'Marinated grilled chicken with garlic sauce, fattoush salad, and whole wheat pita.',
    'dinner',
    '{"calories": 510, "protein": 44, "carbs": 30, "fat": 18}'::jsonb,
    true
  );

-- ─── Meal Schedule (sample week) ─────────────────────────────
-- Uses current_date so it stays fresh in local dev.
insert into meal_schedule (vendor_id, meal_id, date, meal_type)
values
  -- Day 1
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000001', current_date,     'breakfast'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000003', current_date,     'lunch'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000006', current_date,     'dinner'),
  -- Day 2
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000002', current_date + 1, 'breakfast'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000004', current_date + 1, 'lunch'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000007', current_date + 1, 'dinner'),
  -- Day 3
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000001', current_date + 2, 'breakfast'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000005', current_date + 2, 'lunch'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000008', current_date + 2, 'dinner'),
  -- Day 4
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000002', current_date + 3, 'breakfast'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000003', current_date + 3, 'lunch'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000006', current_date + 3, 'dinner'),
  -- Day 5
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000001', current_date + 4, 'breakfast'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000004', current_date + 4, 'lunch'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000007', current_date + 4, 'dinner'),
  -- Day 6
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000002', current_date + 5, 'breakfast'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000005', current_date + 5, 'lunch'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000008', current_date + 5, 'dinner'),
  -- Day 7
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000001', current_date + 6, 'breakfast'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000003', current_date + 6, 'lunch'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '44444444-0000-0000-0000-000000000006', current_date + 6, 'dinner');
