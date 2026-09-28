-- 0007_pharmacy_inventory.sql
-- Phase 2: pharmacy stock as an append-only ledger rather than a mutable counter,
-- so current stock is always reconstructable and auditable (who moved what, when).

create table inventory_items (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    name text not null,
    category text not null default 'medicine',  -- medicine | consumable | equipment
    unit text not null default 'unit',           -- tablet | vial | box | unit, ...
    reorder_level integer not null default 0,
    created_at timestamptz not null default now(),
    unique (hospital_id, name)
);

create index idx_inventory_items_hospital on inventory_items(hospital_id);

-- Ledger entries are insert-only -- to correct a mistake, insert an offsetting
-- adjustment rather than editing history.
create table stock_transactions (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    inventory_item_id uuid not null references inventory_items(id) on delete cascade,
    transaction_type text not null,   -- purchase | dispense | adjustment | return
    quantity integer not null,        -- positive for stock in, negative for stock out
    prescription_item_id uuid references prescription_items(id),  -- set when dispensed against a prescription
    performed_by uuid not null references memberships(id),
    transaction_at timestamptz not null default now(),
    notes text
);

create index idx_stock_transactions_hospital on stock_transactions(hospital_id);
create index idx_stock_transactions_item on stock_transactions(inventory_item_id);

-- security_invoker means this view enforces the querying user's RLS on the
-- underlying tables, not the view owner's -- required on Postgres 15+ for a
-- view over RLS-protected tables to actually stay tenant-scoped.
create view inventory_current_stock
    with (security_invoker = true) as
    select
        i.id as inventory_item_id,
        i.hospital_id,
        i.name,
        i.unit,
        i.reorder_level,
        coalesce(sum(t.quantity), 0) as current_stock
    from inventory_items i
    left join stock_transactions t on t.inventory_item_id = i.id
    group by i.id, i.hospital_id, i.name, i.unit, i.reorder_level;

alter table inventory_items enable row level security;
alter table stock_transactions enable row level security;

create policy inventory_items_select_by_hospital on inventory_items
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'inventory.read'));

create policy inventory_items_insert_by_hospital on inventory_items
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'inventory.write'));

create policy inventory_items_update_by_hospital on inventory_items
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'inventory.write'));

create policy stock_transactions_select_by_hospital on stock_transactions
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'inventory.read'));

create policy stock_transactions_insert_by_hospital on stock_transactions
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'inventory.write'));
