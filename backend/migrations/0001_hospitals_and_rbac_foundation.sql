-- 0001_hospitals_and_rbac_foundation.sql
-- Phase 1: tenant boundary + canonical RBAC.
-- Same shape as the Duzii RBAC migration (roles, permissions, role_permissions,
-- role_inheritance, memberships) with hospital_id standing in for store_id.

create extension if not exists "pgcrypto";

-- Tenant boundary
create table hospitals (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    registration_number text,
    address text,
    city text,
    state text,
    pincode text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Canonical RBAC
create table roles (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,               -- e.g. 'HospitalAdmin', 'Doctor', 'Nurse'
    scope text not null default 'hospital',  -- 'platform' | 'hospital'
    description text,
    created_at timestamptz not null default now()
);

create table permissions (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,                -- e.g. 'patients.read', 'billing.write'
    description text
);

create table role_permissions (
    role_id uuid not null references roles(id) on delete cascade,
    permission_id uuid not null references permissions(id) on delete cascade,
    primary key (role_id, permission_id)
);

-- parent inherits every permission child has, same semantics as Duzii
-- (Org Owner/Admin inheriting Store permissions)
create table role_inheritance (
    parent_role_id uuid not null references roles(id) on delete cascade,
    child_role_id uuid not null references roles(id) on delete cascade,
    primary key (parent_role_id, child_role_id),
    check (parent_role_id <> child_role_id)
);

-- user <-> hospital <-> role. A doctor who works at two hospitals gets two rows here.
create table memberships (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    hospital_id uuid not null references hospitals(id) on delete cascade,
    role_id uuid not null references roles(id),
    status text not null default 'active',   -- 'active' | 'invited' | 'suspended'
    created_at timestamptz not null default now(),
    unique (user_id, hospital_id, role_id)
);

create index idx_memberships_user on memberships(user_id);
create index idx_memberships_hospital on memberships(hospital_id);

-- Effective-permission resolver. Same signature shape as
-- rbac_effective_store_permission(user_id, store_id, permission).
create or replace function rbac_effective_hospital_permission(
    p_user_id uuid,
    p_hospital_id uuid,
    p_permission text
) returns boolean
language sql
security definer
stable
as $$
    with recursive expanded_roles as (
        select m.role_id
        from memberships m
        where m.user_id = p_user_id
          and m.hospital_id = p_hospital_id
          and m.status = 'active'
        union
        select ri.child_role_id
        from role_inheritance ri
        join expanded_roles er on ri.parent_role_id = er.role_id
    )
    select exists (
        select 1
        from expanded_roles er
        join role_permissions rp on rp.role_id = er.role_id
        join permissions p on p.id = rp.permission_id
        where p.key = p_permission
    );
$$;

alter table hospitals enable row level security;
alter table memberships enable row level security;

create policy hospitals_select_member on hospitals
    for select using (
        exists (
            select 1 from memberships m
            where m.hospital_id = hospitals.id
              and m.user_id = auth.uid()
              and m.status = 'active'
        )
    );

create policy memberships_select_own_hospital on memberships
    for select using (
        hospital_id in (
            select hospital_id from memberships
            where user_id = auth.uid() and status = 'active'
        )
    );
