-- 0029_platform_hospitals_overview.sql
-- Aggregate RPC function for Platform Admin to view all onboarded hospitals with patient and staff counts

create or replace function get_platform_hospitals_overview()
returns table (
    id uuid,
    name text,
    registration_number text,
    address text,
    city text,
    state text,
    pincode text,
    is_active boolean,
    created_at timestamptz,
    updated_at timestamptz,
    patient_count bigint,
    staff_count bigint
)
language sql
security definer
stable
as $$
    select
        h.id,
        h.name,
        h.registration_number,
        h.address,
        h.city,
        h.state,
        h.pincode,
        h.is_active,
        h.created_at,
        h.updated_at,
        coalesce(count(distinct pr.id), 0) as patient_count,
        coalesce(count(distinct m.id) filter (where m.status = 'active'), 0) as staff_count
    from hospitals h
    left join patient_registrations pr on pr.hospital_id = h.id
    left join memberships m on m.hospital_id = h.id
    group by h.id
    order by h.created_at desc;
$$;
