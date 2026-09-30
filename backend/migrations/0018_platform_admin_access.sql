-- 0018_platform_admin_access.sql
-- Enables SuperAdmin/Support to query all hospitals without hospital_id scope

-- Function to check if user has a platform-level role (SuperAdmin/Support)
create or replace function is_platform_admin(p_user_id uuid)
returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1
        from memberships m
        join roles r on r.id = m.role_id
        where m.user_id = p_user_id
          and m.status = 'active'
          and r.scope = 'platform'
          and r.name in ('SuperAdmin', 'Support')
    );
$$;

-- Function to check if user has a specific platform permission
create or replace function has_platform_permission(
    p_user_id uuid,
    p_permission text
) returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1
        from memberships m
        join roles r on r.id = m.role_id
        join role_permissions rp on rp.role_id = r.id
        join permissions p on p.id = rp.permission_id
        where m.user_id = p_user_id
          and m.status = 'active'
          and r.scope = 'platform'
          and p.key = p_permission
    );
$$;

-- Add RLS policy for platform admins to view all hospitals
create policy hospitals_select_platform_admin on hospitals
    for select using (
        is_platform_admin(auth.uid())
    );

-- Add RLS policy for platform admins to view all memberships
create policy memberships_select_platform_admin on memberships
    for select using (
        is_platform_admin(auth.uid())
    );

-- Create platform_memberships table to track platform-level role assignments
-- This is separate from hospital-scoped memberships
create table platform_memberships (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    role_id uuid not null references roles(id),
    status text not null default 'active',
    created_at timestamptz not null default now(),
    unique (user_id, role_id),
    check (exists (select 1 from roles r where r.id = role_id and r.scope = 'platform'))
);

create index idx_platform_memberships_user on platform_memberships(user_id);

alter table platform_memberships enable row level security;

-- Only platform admins can view platform memberships
create policy platform_memberships_select on platform_memberships
    for select using (
        is_platform_admin(auth.uid())
    );

-- Update is_platform_admin to check platform_memberships table instead
create or replace function is_platform_admin(p_user_id uuid)
returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1
        from platform_memberships pm
        join roles r on r.id = pm.role_id
        where pm.user_id = p_user_id
          and pm.status = 'active'
          and r.scope = 'platform'
          and r.name in ('SuperAdmin', 'Support')
    );
$$;

-- Update has_platform_permission to check platform_memberships
create or replace function has_platform_permission(
    p_user_id uuid,
    p_permission text
) returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1
        from platform_memberships pm
        join roles r on r.id = pm.role_id
        join role_permissions rp on rp.role_id = r.id
        join permissions p on p.id = rp.permission_id
        where pm.user_id = p_user_id
          and pm.status = 'active'
          and r.scope = 'platform'
          and p.key = p_permission
    );
$$;

-- Seed a demo SuperAdmin user (update email as needed)
-- NOTE: You must create this user in Supabase Auth first!
-- insert into platform_memberships (user_id, role_id)
-- select 
--     (select id from auth.users where email = 'superadmin@platform.com' limit 1),
--     (select id from roles where name = 'SuperAdmin' limit 1)
-- where exists (select 1 from auth.users where email = 'superadmin@platform.com');
