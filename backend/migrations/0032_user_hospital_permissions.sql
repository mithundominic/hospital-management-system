-- 0032_user_hospital_permissions.sql
-- Function to retrieve current authenticated user's effective role and permissions for a hospital

create or replace function get_user_hospital_permissions(
    p_user_id uuid,
    p_hospital_id uuid
)
returns jsonb
language sql
security definer
stable
as $$
    with recursive user_role as (
        select m.role_id, r.name as role_name
        from memberships m
        join roles r on r.id = m.role_id
        where m.user_id = p_user_id
          and m.hospital_id = p_hospital_id
          and m.status = 'active'
    ),
    expanded_roles as (
        select role_id from user_role
        union
        select ri.child_role_id
        from role_inheritance ri
        join expanded_roles er on ri.parent_role_id = er.role_id
    ),
    perms as (
        select distinct p.key
        from expanded_roles er
        join role_permissions rp on rp.role_id = er.role_id
        join permissions p on p.id = rp.permission_id
    )
    select jsonb_build_object(
        'role', (select role_name from user_role limit 1),
        'permissions', coalesce((select jsonb_agg(key order by key) from perms), '[]'::jsonb)
    );
$$;

grant execute on function get_user_hospital_permissions(uuid, uuid) to authenticated;
