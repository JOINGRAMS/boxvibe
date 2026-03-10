-- Calorie tiers: each tier maps meal types to portion sizes
-- The displayed calorie range is computed dynamically based on selected meals

CREATE TABLE IF NOT EXISTS calorie_tiers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Each tier assigns a specific portion size to each meal type
CREATE TABLE IF NOT EXISTS calorie_tier_meals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  calorie_tier_id uuid REFERENCES calorie_tiers(id) ON DELETE CASCADE NOT NULL,
  meal_type_id uuid REFERENCES meal_types(id) ON DELETE CASCADE NOT NULL,
  portion_size_id uuid REFERENCES portion_sizes(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (calorie_tier_id, meal_type_id)
);

-- RLS policies
ALTER TABLE calorie_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE calorie_tier_meals ENABLE ROW LEVEL SECURITY;

-- Public read for storefront
CREATE POLICY "Public read calorie_tiers"
  ON calorie_tiers FOR SELECT
  USING (true);

CREATE POLICY "Public read calorie_tier_meals"
  ON calorie_tier_meals FOR SELECT
  USING (true);

-- Vendor write via vendors_users
CREATE POLICY "Vendor manage calorie_tiers"
  ON calorie_tiers FOR ALL
  USING (
    vendor_id IN (SELECT vendors_id FROM vendors_users WHERE account_id = auth.uid())
  );

CREATE POLICY "Vendor manage calorie_tier_meals"
  ON calorie_tier_meals FOR ALL
  USING (
    calorie_tier_id IN (
      SELECT ct.id FROM calorie_tiers ct
      JOIN vendors_users vu ON vu.vendors_id = ct.vendor_id
      WHERE vu.account_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_calorie_tiers_vendor ON calorie_tiers(vendor_id);
CREATE INDEX idx_calorie_tier_meals_tier ON calorie_tier_meals(calorie_tier_id);
