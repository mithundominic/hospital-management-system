-- 0019_hospital_onboarding.sql
-- Phase: Multi-tenant self-service onboarding
-- Provides an atomic SECURITY DEFINER procedure to create a hospital tenant
-- and bind the authenticated user as the tenant's HospitalAdmin in memberships.
-- Also establishes the RLS UPDATE policy for hospital management.

-- 1. Allow hospital admins to update their own hospital details
create policy hospitals_update_admin on hospitals
    for update using (
        rbac_effective_hospital_permission(auth.uid(), id, 'hospital.manage')
    );

-- 2. Atomic procedure for self-service tenant onboarding
create or replace function create_hospital_with_admin(
    p_name text,
    p_registration_number text default null,
    p_address text default null,
    p_city text default null,
    p_state text default null,
    p_pincode text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_user_id uuid;
    v_hospital_id uuid;
    v_role_id uuid;
    v_hospital jsonb;
begin
    v_user_id := auth.uid();
    if v_user_id is null then
        raise exception 'UNAUTHENTICATED: Authentication required to create hospital';
    end if;

    if p_name is null or trim(p_name) = '' then
        raise exception 'INVALID_ARGUMENT: Hospital name is required';
    end if;

    -- Lookup HospitalAdmin role id
    select id into v_role_id from roles where name = 'HospitalAdmin';
    if v_role_id is null then
        raise exception 'ROLE_NOT_FOUND: HospitalAdmin role not found';
    end if;

    -- 1. Create the hospital tenant
    insert into hospitals (name, registration_number, address, city, state, pincode, is_active)
    values (trim(p_name), p_registration_number, p_address, p_city, p_state, p_pincode, true)
    returning id into v_hospital_id;

    -- 2. Link creator as HospitalAdmin with active status
    insert into memberships (user_id, hospital_id, role_id, status)
    values (v_user_id, v_hospital_id, v_role_id, 'active');

    -- 3. Return created hospital record
    select to_jsonb(h.*) into v_hospital
    from hospitals h
    where h.id = v_hospital_id;

    return v_hospital;
end;
$$;
