-- Add macro percentages and price adjustment to plans table
-- protein_pct + carb_pct + fat_pct should sum to 100

ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS protein_pct int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carb_pct int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fat_pct int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_adjustment int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sort_order int NOT NULL DEFAULT 0;

-- Add constraint: macros must sum to 100 (or all be 0 for unset)
ALTER TABLE plans
  ADD CONSTRAINT plans_macros_sum_check
  CHECK (
    (protein_pct = 0 AND carb_pct = 0 AND fat_pct = 0)
    OR (protein_pct + carb_pct + fat_pct = 100)
  );

-- Seed existing GRAMS plans with reasonable macro splits
UPDATE plans SET protein_pct = 40, carb_pct = 30, fat_pct = 30, price_adjustment = 20, sort_order = 0
WHERE name_en = 'High Protein';

UPDATE plans SET protein_pct = 33, carb_pct = 34, fat_pct = 33, price_adjustment = 0, sort_order = 1
WHERE name_en = 'Balanced';

UPDATE plans SET protein_pct = 30, carb_pct = 20, fat_pct = 50, price_adjustment = 20, sort_order = 2
WHERE name_en = 'Low Carb';

UPDATE plans SET protein_pct = 20, carb_pct = 50, fat_pct = 30, price_adjustment = -10, sort_order = 3
WHERE name_en = 'Vegetarian';
