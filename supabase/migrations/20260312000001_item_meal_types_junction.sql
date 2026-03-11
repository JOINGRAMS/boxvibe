-- ============================================================
-- BoxVibe — item_meal_types junction table
-- Allows assigning multiple meal types to a single item
-- (e.g. "Grilled Chicken Salad" → Lunch + Dinner)
-- ============================================================

create table item_meal_types (
  id            uuid primary key default gen_random_uuid(),
  item_id       uuid not null references items(id) on delete cascade,
  meal_type_id  uuid not null references meal_types(id) on delete cascade,
  vendor_id     uuid not null references vendors(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (item_id, meal_type_id)
);

alter table item_meal_types enable row level security;

create policy "item_meal_types_select" on item_meal_types for select
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "item_meal_types_insert" on item_meal_types for insert
  with check (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "item_meal_types_update" on item_meal_types for update
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));

create policy "item_meal_types_delete" on item_meal_types for delete
  using (vendor_id in (select vendors_id from vendors_users where account_id = auth.uid()));
