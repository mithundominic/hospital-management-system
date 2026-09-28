-- 0003_appointments.sql
-- Phase 1: appointment booking, ties patient + doctor + hospital together.

create table appointments (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    patient_id uuid not null references patients(id) on delete cascade,
    doctor_membership_id uuid not null references memberships(id),
    department_id uuid references departments(id),
    scheduled_at timestamptz not null,
    status text not null default 'booked',  -- booked | checked_in | completed | cancelled | no_show
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_appointments_hospital on appointments(hospital_id);
create index idx_appointments_doctor on appointments(doctor_membership_id);
create index idx_appointments_patient on appointments(patient_id);
create index idx_appointments_scheduled_at on appointments(scheduled_at);

alter table appointments enable row level security;

create policy appointments_select_by_hospital on appointments
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'appointments.read'));

create policy appointments_insert_by_hospital on appointments
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'appointments.write'));

create policy appointments_update_by_hospital on appointments
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'appointments.write'));
