-- 0002_patients_and_doctors.sql
-- Phase 1: patient identity (hospital-agnostic) + doctor profiles.

-- Patients are NOT scoped to one hospital -- patient_registrations is the join.
-- Fields kept deliberately minimal for v1; this expands once EMR work (Phase 2) starts.
create table patients (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    dob date,
    gender text,
    phone text,
    email text,
    blood_group text,
    abha_id text, -- populated once ABDM integration lands (Phase 5)
    created_at timestamptz not null default now()
);

create table patient_registrations (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references patients(id) on delete cascade,
    hospital_id uuid not null references hospitals(id) on delete cascade,
    hospital_patient_number text not null,  -- the hospital's own MRN/UHID
    registered_at timestamptz not null default now(),
    unique (hospital_id, hospital_patient_number)
);

create index idx_patient_registrations_patient on patient_registrations(patient_id);
create index idx_patient_registrations_hospital on patient_registrations(hospital_id);

create table departments (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    name text not null,
    unique (hospital_id, name)
);

-- A doctor IS a membership with role = 'Doctor'; this table holds the doctor-specific fields.
create table doctor_profiles (
    id uuid primary key default gen_random_uuid(),
    membership_id uuid not null unique references memberships(id) on delete cascade,
    department_id uuid references departments(id),
    specialization text,
    registration_number text,   -- state medical council registration
    qualifications text,
    consultation_fee numeric(10,2),
    created_at timestamptz not null default now()
);

alter table patient_registrations enable row level security;
alter table doctor_profiles enable row level security;
alter table departments enable row level security;

create policy patient_registrations_by_hospital on patient_registrations
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'patients.read'));

create policy doctor_profiles_by_hospital on doctor_profiles
    for select using (
        exists (
            select 1 from memberships m
            where m.id = doctor_profiles.membership_id
              and rbac_effective_hospital_permission(auth.uid(), m.hospital_id, 'doctors.read')
        )
    );

create policy departments_by_hospital on departments
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'departments.read'));
