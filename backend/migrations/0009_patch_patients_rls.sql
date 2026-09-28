-- 0009_patch_patients_rls.sql
-- Fixes a gap from 0002: the `patients` table itself never had RLS enabled
-- (only patient_registrations, doctor_profiles, and departments did). Patients
-- are deliberately hospital-agnostic -- no hospital_id column -- so hospital
-- scope has to be reached indirectly, through patient_registrations. Doing
-- this now because insurance_policies (this phase) needs the identical
-- pattern, and it'd be inconsistent to introduce it there while the original
-- hospital-agnostic table still has no RLS at all.

-- Companion to rbac_effective_hospital_permission(): same inheritance-aware
-- logic, but without hospital scoping -- needed for the one case where scope
-- genuinely can't be checked yet (see patients_insert_by_staff below).
create or replace function rbac_user_has_permission_anywhere(
    p_user_id uuid,
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

alter table patients enable row level security;

create policy patients_select_via_registration on patients
    for select using (
        exists (
            select 1 from patient_registrations pr
            where pr.patient_id = patients.id
              and rbac_effective_hospital_permission(auth.uid(), pr.hospital_id, 'patients.read')
        )
    );

-- A brand-new patient has no registration row yet, so hospital scope can't be
-- checked the way select/update can. This checks the inserting user has
-- patients.write *somewhere*, relying on patient creation and
-- patient_registrations creation happening together as one flow at the
-- application layer.
create policy patients_insert_by_staff on patients
    for insert with check (
        rbac_user_has_permission_anywhere(auth.uid(), 'patients.write')
    );

create policy patients_update_via_registration on patients
    for update using (
        exists (
            select 1 from patient_registrations pr
            where pr.patient_id = patients.id
              and rbac_effective_hospital_permission(auth.uid(), pr.hospital_id, 'patients.write')
        )
    );

-- Known gap, not fixed here: patient_registrations, doctor_profiles, and
-- departments (from 0002) only ever got SELECT policies, not INSERT/UPDATE --
-- so writes to them currently only work via the service-role key, not a
-- client using the user's own session. Worth a dedicated pass once the app
-- layer actually needs client-side writes to those tables; out of scope for
-- this billing-focused phase.
