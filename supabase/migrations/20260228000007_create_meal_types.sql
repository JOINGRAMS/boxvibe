-- Meal types table: each row = one meal slot offered by a vendor (e.g. Lunch, Dinner).
-- Price is per-day so the wizard can sum any combination the customer picks.
-- This enables additive pricing: pick any combo, pay the sum of their daily rates.

CREATE TABLE meal_types (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id      uuid        REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  key            text        NOT NULL
                             CHECK (key IN ('breakfast','morning_snack','lunch','dinner','evening_snack')),
  label_en       text        NOT NULL,
  label_ar       text        NOT NULL DEFAULT '',
  price_per_day  numeric(10,2) NOT NULL DEFAULT 0
                             CHECK (price_per_day >= 0),
  display_order  int         NOT NULL DEFAULT 0,
  is_active      boolean     NOT NULL DEFAULT true,
  created_at     timestamptz DEFAULT now(),

  UNIQUE (vendor_id, key)   -- one entry per meal slot per vendor
);

-- Standard calorie contribution of each meal slot (used by AI recommender).
-- breakfast: 25%, morning_snack: 10%, lunch: 35%, dinner: 25%, evening_snack: 5%
COMMENT ON TABLE meal_types IS
  'Per-vendor meal slot catalog with daily pricing for additive subscription pricing.';

COMMENT ON COLUMN meal_types.key IS
  'Canonical meal slot key. Calorie fractions: breakfast=0.25, morning_snack=0.10, lunch=0.35, dinner=0.25, evening_snack=0.05';

-- RLS
ALTER TABLE meal_types ENABLE ROW LEVEL SECURITY;

-- Vendor staff can manage their own meal types
CREATE POLICY "Vendors manage own meal_types"
  ON meal_types FOR ALL
  USING (
    vendor_id IN (
      SELECT vendors_id FROM vendors_users WHERE account_id = auth.uid()
    )
  );
