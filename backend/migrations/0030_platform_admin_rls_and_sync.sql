-- 0030_platform_admin_rls_and_sync.sql
-- Permanent architectural enforcement for platform admin access, RLS policies, trigger sync, and analytics RPCs

-- 1. RLS Policy: allow platform admins to update hospital status (suspend/activate)
drop policy if exists hospitals_update_platform_admin on hospitals;
create policy hospitals_update_platform_admin on hospitals
    for update using (
        has_platform_permission(auth.uid(), 'platform.manage_hospitals')
    );

-- 2. RLS Policy: allow platform support to select appointments for reporting/oversight
drop policy if exists appointments_select_platform_admin on appointments;
create policy appointments_select_platform_admin on appointments
    for select using (
        has_platform_permission(auth.uid(), 'platform.support_access')
    );

-- 3. RLS Policy: allow platform support to select payments for platform revenue oversight
drop policy if exists payments_select_platform_admin on payments;
create policy payments_select_platform_admin on payments
    for select using (
        has_platform_permission(auth.uid(), 'platform.support_access')
    );

-- 4. Trigger Function: automatically sync platform_memberships changes to auth.users.raw_app_meta_data
create or replace function sync_platform_membership_app_metadata()
returns trigger
language plpgsql
security definer
as $$
declare
    v_role_name text;
    v_user_id uuid;
begin
    if tg_op = 'DELETE' then
        v_user_id := old.user_id;
        update auth.users
        set raw_app_meta_data = (coalesce(raw_app_meta_data, '{}'::jsonb) - 'is_platform_admin') - 'platform_role'
        where id = v_user_id;
        return old;
    end if;

    v_user_id := new.user_id;

    if new.status = 'active' then
        select name into v_role_name from roles where id = new.role_id;
        update auth.users
        set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
            'is_platform_admin', true,
            'platform_role', coalesce(v_role_name, 'SuperAdmin')
        )
        where id = v_user_id;
    else
        update auth.users
        set raw_app_meta_data = (coalesce(raw_app_meta_data, '{}'::jsonb) - 'is_platform_admin') - 'platform_role'
        where id = v_user_id;
    end if;

    return new;
end;
$$;

drop trigger if exists trg_sync_platform_membership_app_metadata on platform_memberships;
create trigger trg_sync_platform_membership_app_metadata
after insert or update or delete on platform_memberships
for each row execute function sync_platform_membership_app_metadata();

-- 5. RPC Function: aggregate platform analytics efficiently
create or replace function get_platform_analytics()
returns jsonb
language plpgsql
security definer
stable
as $$
declare
    v_caller_id uuid := auth.uid();
    v_is_admin boolean;
    v_result jsonb;
begin
    select has_platform_permission(v_caller_id, 'platform.support_access') into v_is_admin;
    if not coalesce(v_is_admin, false) then
        raise exception 'Forbidden: requires platform.support_access permission';
    end if;

    select jsonb_build_object(
        'total_hospitals', (select count(*) from hospitals),
        'active_hospitals', (select count(*) from hospitals where is_active = true),
        'inactive_hospitals', (select count(*) from hospitals where is_active = false),
        'total_staff', (select count(*) from memberships where status = 'active'),
        'total_patients', (select count(distinct id) from patients),
        'total_appointments', (select count(*) from appointments),
        'total_revenue', coalesce((select sum(amount) from payments), 0)
    ) into v_result;

    return v_result;
end;
$$;

-- 6. RPC Function: aggregate stats for a specific hospital
create or replace function get_platform_hospital_stats(p_hospital_id uuid)
returns jsonb
language plpgsql
security definer
stable
as $$
declare
    v_caller_id uuid := auth.uid();
    v_is_admin boolean;
    v_result jsonb;
begin
    select has_platform_permission(v_caller_id, 'platform.support_access') into v_is_admin;
    if not coalesce(v_is_admin, false) then
        raise exception 'Forbidden: requires platform.support_access permission';
    end if;

    select jsonb_build_object(
        'total_staff', (select count(*) from memberships where hospital_id = p_hospital_id and status = 'active'),
        'total_patients', (select count(distinct patient_id) from patient_registrations where hospital_id = p_hospital_id),
        'total_appointments', (select count(*) from appointments where hospital_id = p_hospital_id)
    ) into v_result;

    return v_result;
end;
$$;
