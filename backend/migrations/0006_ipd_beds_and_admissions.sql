-- 0006_ipd_beds_and_admissions.sql
-- Phase 2: in-patient department -- physical beds and admission records.

create table beds (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    department_id uuid references departments(id),
    bed_number text not null,
    ward text,
    status text not null default 'available',  -- available | occupied | maintenance
    created_at timestamptz not null default now(),
    unique (hospital_id, bed_number)
);

create index idx_beds_hospital on beds(hospital_id);
create index idx_beds_status on beds(status);

create table admissions (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    encounter_id uuid not null references encounters(id),
    patient_id uuid not null references patients(id),
    bed_id uuid references beds(id),
    admitting_doctor_membership_id uuid not null references memberships(id),
    status text not null default 'admitted',  -- admitted | discharged | transferred
    admitted_at timestamptz not null default now(),
    discharged_at timestamptz,
    discharge_summary text
);

create index idx_admissions_hospital on admissions(hospital_id);
create index idx_admissions_patient on admissions(patient_id);
create index idx_admissions_bed on admissions(bed_id);
create index idx_admissions_status on admissions(status);

-- A bed can only be the site of one *active* admission at a time. This is the
-- kind of rule that's worth enforcing in the database, not just application code.
create unique index idx_admissions_one_active_per_bed
    on admissions(bed_id)
    where status = 'admitted' and bed_id is not null;

alter table beds enable row level security;
alter table admissions enable row level security;

create policy beds_select_by_hospital on beds
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'beds.read'));

create policy beds_insert_by_hospital on beds
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'beds.write'));

create policy beds_update_by_hospital on beds
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'beds.write'));

create policy admissions_select_by_hospital on admissions
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'admissions.read'));

create policy admissions_insert_by_hospital on admissions
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'admissions.write'));

create policy admissions_update_by_hospital on admissions
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'admissions.write'));
