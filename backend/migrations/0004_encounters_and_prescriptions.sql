-- 0004_encounters_and_prescriptions.sql
-- Phase 2: the actual clinical visit (encounter) and what comes out of it.

create table encounters (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    patient_id uuid not null references patients(id) on delete cascade,
    appointment_id uuid references appointments(id),  -- nullable: walk-ins won't have one
    doctor_membership_id uuid not null references memberships(id),
    department_id uuid references departments(id),
    encounter_type text not null default 'opd',   -- opd | ipd | emergency
    status text not null default 'in_progress',   -- in_progress | completed | cancelled
    chief_complaint text,
    vitals jsonb,           -- { bp, pulse, temp, spo2, weight, height, ... } -- free-form for v1;
                             -- normalize into columns later if you need to query/chart on them
    diagnosis text,
    clinical_notes text,
    started_at timestamptz not null default now(),
    ended_at timestamptz,
    created_at timestamptz not null default now()
);

create index idx_encounters_hospital on encounters(hospital_id);
create index idx_encounters_patient on encounters(patient_id);
create index idx_encounters_doctor on encounters(doctor_membership_id);
create index idx_encounters_started_at on encounters(started_at);

-- Prescriptions and their line items are treated as immutable once created --
-- a correction is a new prescription, not an edit to an old one. That's a
-- deliberate call for a medico-legal record, so there's no update policy below.
create table prescriptions (
    id uuid primary key default gen_random_uuid(),
    encounter_id uuid not null references encounters(id) on delete cascade,
    hospital_id uuid not null references hospitals(id) on delete cascade,
    prescribed_by uuid not null references memberships(id),
    notes text,
    created_at timestamptz not null default now()
);

create table prescription_items (
    id uuid primary key default gen_random_uuid(),
    prescription_id uuid not null references prescriptions(id) on delete cascade,
    medicine_name text not null,
    dosage text,              -- e.g. '500mg'
    frequency text,           -- e.g. '1-0-1' (morning-afternoon-night)
    duration_days integer,
    instructions text         -- e.g. 'after food'
);

create index idx_prescription_items_prescription on prescription_items(prescription_id);

alter table encounters enable row level security;
alter table prescriptions enable row level security;
alter table prescription_items enable row level security;

create policy encounters_select_by_hospital on encounters
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'encounters.read'));

create policy encounters_insert_by_hospital on encounters
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'encounters.write'));

create policy encounters_update_by_hospital on encounters
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'encounters.write'));

create policy prescriptions_select_by_hospital on prescriptions
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'prescriptions.read'));

create policy prescriptions_insert_by_hospital on prescriptions
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'prescriptions.write'));

create policy prescription_items_select on prescription_items
    for select using (
        exists (
            select 1 from prescriptions p
            where p.id = prescription_items.prescription_id
              and rbac_effective_hospital_permission(auth.uid(), p.hospital_id, 'prescriptions.read')
        )
    );

create policy prescription_items_insert on prescription_items
    for insert with check (
        exists (
            select 1 from prescriptions p
            where p.id = prescription_items.prescription_id
              and rbac_effective_hospital_permission(auth.uid(), p.hospital_id, 'prescriptions.write')
        )
    );
