-- 0021_atomic_hospital_and_admin_provisioning.sql
-- Responsibility: Atomic provisioning of admin user, hospital tenant, and HospitalAdmin membership
-- Avoids external auth rate-limits and service-role secret dependency hurdles.

create or replace function register_hospital_and_admin(
    p_email text,
    p_password text,
    p_name text,
    p_registration_number text default null,
    p_address text default null,
    p_city text default null,
    p_state text default null,
    p_pincode text default null
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    v_user_id uuid;
    v_role_id uuid;
    v_hospital_id uuid;
    v_hospital jsonb;
    v_clean_email text;
begin
    v_clean_email := lower(trim(p_email));

    if v_clean_email is null or v_clean_email = '' then
        raise exception 'INVALID_ARGUMENT: Email is required';
    end if;

    if p_password is null or length(p_password) < 6 then
        raise exception 'INVALID_ARGUMENT: Password must be at least 6 characters';
    end if;

    if p_name is null or trim(p_name) = '' then
        raise exception 'INVALID_ARGUMENT: Hospital name is required';
    end if;

    -- Check if user already exists
    select id into v_user_id from auth.users where email = v_clean_email;
    if v_user_id is not null then
        raise exception 'CONFLICT: An account with this email already exists';
    end if;

    -- Lookup HospitalAdmin role id
    select id into v_role_id from roles where name = 'HospitalAdmin';
    if v_role_id is null then
        raise exception 'ROLE_NOT_FOUND: HospitalAdmin role not found';
    end if;

    -- Generate user UUID
    v_user_id := gen_random_uuid();

    -- 1. Create auth user with confirmed email and bcrypt password
    insert into auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        reauthentication_token,
        created_at,
        updated_at
    ) values (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        v_clean_email,
        crypt(p_password, gen_salt('bf', 10)),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('email_verified', true),
        '',
        '',
        '',
        '',
        '',
        now(),
        now()
    );

    -- 2. Create auth identity
    insert into auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) values (
        gen_random_uuid(),
        v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', v_clean_email, 'email_verified', true, 'phone_verified', false),
        'email',
        v_user_id::text,
        now(),
        now(),
        now()
    );

    -- 3. Create the hospital tenant
    insert into hospitals (name, registration_number, address, city, state, pincode, is_active)
    values (trim(p_name), p_registration_number, p_address, p_city, p_state, p_pincode, true)
    returning id into v_hospital_id;

    -- 4. Link user as HospitalAdmin with active status
    insert into memberships (user_id, hospital_id, role_id, status)
    values (v_user_id, v_hospital_id, v_role_id, 'active');

    -- 5. Return created hospital and user info
    select to_jsonb(h.*) into v_hospital
    from hospitals h
    where h.id = v_hospital_id;

    return jsonb_build_object(
        'hospital', v_hospital,
        'user_id', v_user_id,
        'email', v_clean_email
    );
end;
$$;
