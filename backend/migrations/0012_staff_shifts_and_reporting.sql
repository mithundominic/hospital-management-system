-- 0012_staff_shifts_and_reporting.sql
-- Phase 4: staff scheduling, plus a small set of admin dashboard views.
--
-- Deliberate calls:
--  - No DB-level overlap prevention on staff_shifts (unlike beds/admissions in
--    Phase 2). A correct version needs a tstzrange built from shift_date +
--    start_time/end_time, which runs into Postgres's immutability
--    requirements for generated columns once timezones are involved -- doable,
--    but not worth the risk of shipping subtly-wrong SQL for a first cut.
--    Treat double-booking as an app-layer validation for now.
--  - Dashboard views are gated by a dedicated 'reports.read' permission,
--    checked explicitly inside each view, rather than just inheriting
--    whatever the underlying table's own read permission allows. bed
--    occupancy and revenue are aggregate/strategic in a way that a single
--    bed's or invoice's row-level permission doesn't really speak to.

create table staff_shifts (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    membership_id uuid not null references memberships(id) on delete cascade,
    department_id uuid references departments(id),
    shift_date date not null,
    start_time time not null,
    end_time time not null,   -- if end_time <= start_time, the shift is read as crossing
                               -- midnight into the next day
    status text not null default 'scheduled',  -- scheduled | completed | no_show | cancelled
    notes text,
    created_at timestamptz not null default now()
);

create index idx_staff_shifts_hospital on staff_shifts(hospital_id);
create index idx_staff_shifts_membership on staff_shifts(membership_id);
create index idx_staff_shifts_date on staff_shifts(shift_date);

alter table staff_shifts enable row level security;

create policy staff_shifts_select_by_hospital on staff_shifts
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'shifts.read'));

create policy staff_shifts_insert_by_hospital on staff_shifts
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'shifts.write'));

create policy staff_shifts_update_by_hospital on staff_shifts
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'shifts.write'));

-- Ward-level occupancy. Explicit reports.read check in the outer WHERE, not
-- just security_invoker inheriting beds.read -- see header comment.
create view bed_occupancy_summary
    with (security_invoker = true) as
    select * from (
        select
            hospital_id,
            department_id,
            count(*) as total_beds,
            count(*) filter (where status = 'occupied') as occupied_beds,
            count(*) filter (where status = 'available') as available_beds,
            count(*) filter (where status = 'maintenance') as maintenance_beds,
            round(100.0 * count(*) filter (where status = 'occupied') / nullif(count(*), 0), 1) as occupancy_pct
        from beds
        group by hospital_id, department_id
    ) summary
    where rbac_effective_hospital_permission(auth.uid(), hospital_id, 'reports.read');

-- Collected revenue by day. Deliberately about money *collected* (from
-- payments), not billed -- outstanding balance is already covered by
-- invoice_balance from Phase 3, no need to duplicate it here.
create view daily_revenue_summary
    with (security_invoker = true) as
    select * from (
        select
            i.hospital_id,
            date(p.paid_at) as revenue_date,
            sum(p.amount) as total_collected,
            count(distinct i.id) as invoices_touched
        from payments p
        join invoices i on i.id = p.invoice_id
        group by i.hospital_id, date(p.paid_at)
    ) summary
    where rbac_effective_hospital_permission(auth.uid(), hospital_id, 'reports.read');

-- Reuses inventory_current_stock from Phase 2 rather than re-deriving stock
-- levels from stock_transactions a second time.
create view low_stock_alert
    with (security_invoker = true) as
    select * from (
        select hospital_id, inventory_item_id, name, unit, current_stock, reorder_level
        from inventory_current_stock
        where current_stock <= reorder_level
    ) low_stock
    where rbac_effective_hospital_permission(auth.uid(), hospital_id, 'reports.read');
