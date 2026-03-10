-- ============================================================
-- Fix GRAMS data: plans & packages were entered in wrong tables
-- ============================================================
-- Problem: plans table had meal combos (Full Day, Lunch+Dinner)
--          packages table had dietary approaches (Balanced, Low Carb)
-- Fix:     Delete all and re-insert correctly.
-- ============================================================

DO $$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id FROM vendors WHERE slug = 'grams';

  IF v_id IS NULL THEN
    RAISE EXCEPTION 'GRAMS vendor not found (slug=grams)';
  END IF;

  -- Disable FK trigger enforcement so we can delete without chasing every child table
  SET session_replication_role = 'replica';

  -- Delete all GRAMS data from the affected tables
  DELETE FROM subscriptions        WHERE vendor_id = v_id;
  DELETE FROM plan_package_tiers   WHERE plan_id IN (SELECT id FROM plans WHERE vendor_id = v_id);
  DELETE FROM plan_packages        WHERE plan_id IN (SELECT id FROM plans WHERE vendor_id = v_id);
  DELETE FROM packages             WHERE vendor_id = v_id;
  DELETE FROM plans                WHERE vendor_id = v_id;
  DELETE FROM meal_types           WHERE vendor_id = v_id;

  -- Re-enable FK enforcement
  SET session_replication_role = 'origin';

  -- ─── Insert PLANS (dietary approaches) ────────────────────────
  INSERT INTO plans (id, vendor_id, name_en, name_ar, desc_en, desc_ar, slug, is_active, updated_at)
  VALUES
    ('aaaaaaaa-0001-0000-0000-000000000001', v_id,
     'High Protein', 'بروتين عالي',
     'Optimized for muscle building and recovery. High-quality protein sources at every meal.',
     'مصمم لبناء العضلات والتعافي. مصادر بروتين عالية الجودة في كل وجبة.',
     'high-protein', true, now()),

    ('aaaaaaaa-0001-0000-0000-000000000002', v_id,
     'Low Carb', 'قليل الكربوهيدرات',
     'Reduced carbohydrates for fat loss, stable energy, and metabolic health.',
     'كربوهيدرات منخفضة لخسارة الدهون وطاقة مستقرة وصحة أيضية.',
     'low-carb', true, now()),

    ('aaaaaaaa-0001-0000-0000-000000000003', v_id,
     'Balanced', 'متوازن',
     'A well-rounded macro split for overall health, sustained energy, and wellbeing.',
     'توزيع متوازن للعناصر الغذائية الكبرى للصحة العامة والطاقة المستدامة.',
     'balanced', true, now()),

    ('aaaaaaaa-0001-0000-0000-000000000004', v_id,
     'Vegetarian', 'نباتي',
     'Plant-based nutrition with complete protein sources. No meat or seafood.',
     'تغذية نباتية بمصادر بروتين كاملة. بدون لحوم أو مأكولات بحرية.',
     'vegetarian', true, now());

  -- ─── Insert PACKAGES (meal combinations) ──────────────────────
  INSERT INTO packages (id, vendor_id, category, category_en, category_ar, description_en, description_ar, slug, price_multiplier, meal_types, is_active, updated_at)
  VALUES
    ('bbbbbbbb-0001-0000-0000-000000000001', v_id,
     'Full Day', 'Full Day', 'يوم كامل',
     'Breakfast, Lunch, and Dinner — fully covered.',
     'فطور، غداء، وعشاء — تغطية كاملة.',
     'full-day', 1.0, '{breakfast,lunch,dinner}', true, now()),

    ('bbbbbbbb-0001-0000-0000-000000000002', v_id,
     'Lunch + Dinner', 'Lunch + Dinner', 'غداء + عشاء',
     'Two main meals per day for those who handle their own breakfast.',
     'وجبتان رئيسيتان يومياً لمن يحضرون فطورهم بأنفسهم.',
     'lunch-dinner', 0.75, '{lunch,dinner}', true, now()),

    ('bbbbbbbb-0001-0000-0000-000000000003', v_id,
     'Lunch Only', 'Lunch Only', 'غداء فقط',
     'A single healthy midday meal — great for office workers.',
     'وجبة غداء صحية واحدة — مثالية لموظفي المكاتب.',
     'lunch-only', 0.45, '{lunch}', true, now()),

    ('bbbbbbbb-0001-0000-0000-000000000004', v_id,
     'Dinner Only', 'Dinner Only', 'عشاء فقط',
     'Clean evening meal — for those who manage their own days.',
     'وجبة عشاء صحية — لمن يديرون وجباتهم خلال اليوم.',
     'dinner-only', 0.45, '{dinner}', true, now());

  -- ─── Insert PLAN_PACKAGES junction (all plans offer all packages) ──
  INSERT INTO plan_packages (plan_id, package_id, updated_at)
  SELECT p.id, k.id, now()
  FROM plans p, packages k
  WHERE p.vendor_id = v_id AND k.vendor_id = v_id;

  -- ─── Insert PLAN_PACKAGE_TIERS (calorie tiers per plan) ──────
  -- High Protein tiers
  INSERT INTO plan_package_tiers (id, plan_id, variance_name_en, variance_name_ar, total_price, updated_at)
  VALUES
    ('cccccccc-0001-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000001',
     '900 - 1100 kcal', '٩٠٠ - ١١٠٠ سعرة', 1400, now()),
    ('cccccccc-0001-0000-0000-000000000002', 'aaaaaaaa-0001-0000-0000-000000000001',
     '1100 - 1300 kcal', '١١٠٠ - ١٣٠٠ سعرة', 1600, now()),
    ('cccccccc-0001-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000001',
     '1300 - 1500 kcal', '١٣٠٠ - ١٥٠٠ سعرة', 1800, now()),
    ('cccccccc-0001-0000-0000-000000000004', 'aaaaaaaa-0001-0000-0000-000000000001',
     '1500 - 1800 kcal', '١٥٠٠ - ١٨٠٠ سعرة', 2000, now());

  -- Low Carb tiers
  INSERT INTO plan_package_tiers (id, plan_id, variance_name_en, variance_name_ar, total_price, updated_at)
  VALUES
    ('cccccccc-0002-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000002',
     '900 - 1100 kcal', '٩٠٠ - ١١٠٠ سعرة', 1400, now()),
    ('cccccccc-0002-0000-0000-000000000002', 'aaaaaaaa-0001-0000-0000-000000000002',
     '1100 - 1300 kcal', '١١٠٠ - ١٣٠٠ سعرة', 1600, now()),
    ('cccccccc-0002-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000002',
     '1300 - 1500 kcal', '١٣٠٠ - ١٥٠٠ سعرة', 1800, now()),
    ('cccccccc-0002-0000-0000-000000000004', 'aaaaaaaa-0001-0000-0000-000000000002',
     '1500 - 1800 kcal', '١٥٠٠ - ١٨٠٠ سعرة', 2000, now());

  -- Balanced tiers
  INSERT INTO plan_package_tiers (id, plan_id, variance_name_en, variance_name_ar, total_price, updated_at)
  VALUES
    ('cccccccc-0003-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000003',
     '900 - 1100 kcal', '٩٠٠ - ١١٠٠ سعرة', 1300, now()),
    ('cccccccc-0003-0000-0000-000000000002', 'aaaaaaaa-0001-0000-0000-000000000003',
     '1100 - 1300 kcal', '١١٠٠ - ١٣٠٠ سعرة', 1500, now()),
    ('cccccccc-0003-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000003',
     '1300 - 1500 kcal', '١٣٠٠ - ١٥٠٠ سعرة', 1700, now()),
    ('cccccccc-0003-0000-0000-000000000004', 'aaaaaaaa-0001-0000-0000-000000000003',
     '1500 - 1800 kcal', '١٥٠٠ - ١٨٠٠ سعرة', 1900, now());

  -- Vegetarian tiers
  INSERT INTO plan_package_tiers (id, plan_id, variance_name_en, variance_name_ar, total_price, updated_at)
  VALUES
    ('cccccccc-0004-0000-0000-000000000001', 'aaaaaaaa-0001-0000-0000-000000000004',
     '900 - 1100 kcal', '٩٠٠ - ١١٠٠ سعرة', 1300, now()),
    ('cccccccc-0004-0000-0000-000000000002', 'aaaaaaaa-0001-0000-0000-000000000004',
     '1100 - 1300 kcal', '١١٠٠ - ١٣٠٠ سعرة', 1500, now()),
    ('cccccccc-0004-0000-0000-000000000003', 'aaaaaaaa-0001-0000-0000-000000000004',
     '1300 - 1500 kcal', '١٣٠٠ - ١٥٠٠ سعرة', 1700, now()),
    ('cccccccc-0004-0000-0000-000000000004', 'aaaaaaaa-0001-0000-0000-000000000004',
     '1500 - 1800 kcal', '١٥٠٠ - ١٨٠٠ سعرة', 1900, now());

  -- ─── Insert MEAL_TYPES (per-day pricing) ──────────────────────
  INSERT INTO meal_types (vendor_id, key, label_en, label_ar, price_per_day, display_order, is_active)
  VALUES
    (v_id, 'breakfast',      'Breakfast',      'فطور',      20.00, 1, true),
    (v_id, 'morning_snack',  'Morning Snack',  'سناك صباحي', 10.00, 2, true),
    (v_id, 'lunch',          'Lunch',          'غداء',      30.00, 3, true),
    (v_id, 'dinner',         'Dinner',         'عشاء',      28.00, 4, true),
    (v_id, 'evening_snack',  'Evening Snack',  'سناك مسائي', 10.00, 5, true);

END $$;
