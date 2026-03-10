-- Migration: Create portion_sizes and meal_type_portion_prices tables
-- for the vendor dashboard Pricing & Portions setup page.
--
-- portion_sizes: vendor-level calorie sizes (Small 200, Medium 400, etc.)
-- meal_type_portion_prices: per-portion base price for each meal type

-- ─── Portion Sizes ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS portion_sizes (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id    uuid        REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  name_en      text        NOT NULL,
  name_ar      text        NOT NULL DEFAULT '',
  symbol       text        NOT NULL DEFAULT '',
  calories     int         NOT NULL CHECK (calories > 0),
  sort_order   int         NOT NULL DEFAULT 0,
  is_active    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE portion_sizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors manage own portion_sizes"
  ON portion_sizes FOR ALL
  USING (
    vendor_id IN (
      SELECT vendors_id FROM vendors_users WHERE account_id = auth.uid()
    )
  );

-- Public read for active portion sizes (storefront needs them)
CREATE POLICY "Public read active portion_sizes"
  ON portion_sizes FOR SELECT
  USING (is_active = true);

-- ─── Meal Type Portion Prices (junction) ────────────────────────────────────

CREATE TABLE IF NOT EXISTS meal_type_portion_prices (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_type_id    uuid        REFERENCES meal_types(id) ON DELETE CASCADE NOT NULL,
  portion_size_id uuid        REFERENCES portion_sizes(id) ON DELETE CASCADE NOT NULL,
  base_price      numeric(10,2) NOT NULL DEFAULT 0 CHECK (base_price >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  UNIQUE (meal_type_id, portion_size_id)
);

-- RLS
ALTER TABLE meal_type_portion_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors manage own meal_type_portion_prices"
  ON meal_type_portion_prices FOR ALL
  USING (
    meal_type_id IN (
      SELECT mt.id FROM meal_types mt
      WHERE mt.vendor_id IN (
        SELECT vendors_id FROM vendors_users WHERE account_id = auth.uid()
      )
    )
  );

-- Public read for storefront
CREATE POLICY "Public read meal_type_portion_prices"
  ON meal_type_portion_prices FOR SELECT
  USING (
    meal_type_id IN (
      SELECT mt.id FROM meal_types mt WHERE mt.is_active = true
    )
  );
