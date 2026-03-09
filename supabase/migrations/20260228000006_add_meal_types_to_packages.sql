-- Add meal_types array column to packages table.
-- Each package (e.g. "Lunch + Dinner") stores which meal types it includes
-- as an ordered array of keys, e.g. '{lunch,dinner}'.
-- This powers the Delicut-style meal selector in the subscribe wizard.

ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS meal_types text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN packages.meal_types IS
  'Ordered list of meal type keys included in this package. '
  'Standard keys: breakfast, morning_snack, lunch, dinner, evening_snack';
