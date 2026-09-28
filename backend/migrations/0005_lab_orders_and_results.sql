-- 0005_lab_orders_and_results.sql
-- Phase 2: lab workflow -- an order placed during an encounter, and the result that follows.

create table lab_orders (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    encounter_id uuid not null references encounters(id) on delete cascade,
    ordered_by uuid not null references memberships(id),
    test_name text not null,
    status text not null default 'ordered',  -- ordered | sample_collected | in_progress | completed | cancelled
    ordered_at timestamptz not null default now(),
    sample_collected_at timestamptz
);

create index idx_lab_orders_hospital on lab_orders(hospital_id);
create index idx_lab_orders_encounter on lab_orders(encounter_id);
create index idx_lab_orders_status on lab_orders(status);

-- Results are insert-only, same reasoning as prescriptions: a correction is a
-- new verified result, not a silent edit to what a doctor already acted on.
create table lab_results (
    id uuid primary key default gen_random_uuid(),
    lab_order_id uuid not null references lab_orders(id) on delete cascade,
    result_value text,
    unit text,
    reference_range text,
    is_abnormal boolean not null default false,
    verified_by uuid references memberships(id),
    result_at timestamptz not null default now(),
    notes text
);

create index idx_lab_results_lab_order on lab_results(lab_order_id);

alter table lab_orders enable row level security;
alter table lab_results enable row level security;

create policy lab_orders_select_by_hospital on lab_orders
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'lab_orders.read'));

create policy lab_orders_insert_by_hospital on lab_orders
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'lab_orders.write'));

create policy lab_orders_update_by_hospital on lab_orders
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'lab_orders.write'));

create policy lab_results_select on lab_results
    for select using (
        exists (
            select 1 from lab_orders lo
            where lo.id = lab_results.lab_order_id
              and rbac_effective_hospital_permission(auth.uid(), lo.hospital_id, 'lab_results.read')
        )
    );

create policy lab_results_insert on lab_results
    for insert with check (
        exists (
            select 1 from lab_orders lo
            where lo.id = lab_results.lab_order_id
              and rbac_effective_hospital_permission(auth.uid(), lo.hospital_id, 'lab_results.write')
        )
    );
