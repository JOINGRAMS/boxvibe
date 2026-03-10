-- Remove the restrictive CHECK constraint on meal_types.key
-- Vendors should be able to create custom meal types (e.g. "side", "salad")

ALTER TABLE meal_types DROP CONSTRAINT IF EXISTS meal_types_key_check;
