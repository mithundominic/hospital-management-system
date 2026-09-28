-- 0008_seed_roles_and_permissions.sql
-- Phase 1+2 permission seeding: the actual design decision Phase 1 and Phase 2
-- both deferred, not an invented placeholder list.
--
-- Deliberate calls worth reading before you extend this:
--
--  - No role_inheritance rows. Duzii's Owner > Manager > Staff hierarchy is
--    LINEAR -- each tier is a strict superset of the one below. Hospital roles
--    are specialty-based, not nested: a Doctor isn't "above" a Nurse, they just
--    do different things. Forcing inheritance here would mean either flattening
--    real distinctions or accidentally handing clinical write access to
--    non-clinical staff. Add inheritance rows later if a real seniority tier
--    shows up (e.g. Head Nurse over ward Nurses).
--  - HospitalAdmin reads everything but writes only the operational tables
--    (patients, doctors, departments, appointments, beds, inventory,
--    memberships, hospital settings) -- NOT encounters, prescriptions,
--    lab_orders, or lab_results. Clinical documentation stays attributable to
--    the clinician who actually made the call, even on a full-read admin
--    account.
--  - BillingClerk only gets read access to patients/encounters/appointments,
--    because there's nothing to bill yet. Phase 3 adds real billing
--    permissions (billing.*, insurance_claims.*) and this grant list grows
--    substantially then.
--  - SuperAdmin/Support are seeded, but there's no cross-hospital enforcement
--    wired up: rbac_effective_hospital_permission() only checks membership at
--    ONE hospital_id. A platform admin who needs visibility into every
--    hospital isn't solved by this migration -- that needs either a separate
--    platform_admins check inside the relevant RLS policies, or admin tooling
--    that goes through the Supabase service-role key (bypassing RLS entirely,
--    same as any backend job). Flagging it here rather than pretending this
--    migration covers it.

-- Roles
insert into roles (name, scope, description) values
    ('SuperAdmin',    'platform', 'Full platform access across all hospitals'),
    ('Support',       'platform', 'Platform support staff, narrower than SuperAdmin'),
    ('HospitalAdmin', 'hospital', 'Full administrative access within one hospital'),
    ('Doctor',        'hospital', 'Clinical staff: consults, prescribes, orders tests, admits'),
    ('Nurse',         'hospital', 'Clinical support: vitals, ward/bed management, admissions'),
    ('Receptionist',  'hospital', 'Front desk: patient registration, appointment booking'),
    ('Pharmacist',    'hospital', 'Dispenses against prescriptions, manages pharmacy stock'),
    ('LabTech',       'hospital', 'Processes lab orders, enters and verifies results'),
    ('BillingClerk',  'hospital', 'Billing and insurance -- grant list grows in Phase 3');

-- Permissions
insert into permissions (key, description) values
    ('patients.read',             'View patient records and registrations'),
    ('patients.write',            'Register patients, edit patient records'),
    ('doctors.read',              'View doctor profiles'),
    ('doctors.write',             'Create/edit doctor profiles'),
    ('departments.read',          'View departments'),
    ('departments.write',         'Create/edit departments'),
    ('appointments.read',         'View appointments'),
    ('appointments.write',        'Book, reschedule, cancel appointments'),
    ('encounters.read',           'View encounters/EMR entries'),
    ('encounters.write',          'Create/update encounters'),
    ('prescriptions.read',        'View prescriptions'),
    ('prescriptions.write',       'Issue prescriptions'),
    ('lab_orders.read',           'View lab orders'),
    ('lab_orders.write',          'Create lab orders, update their status'),
    ('lab_results.read',          'View lab results'),
    ('lab_results.write',         'Enter/verify lab results'),
    ('beds.read',                 'View bed status'),
    ('beds.write',                'Create beds, update bed status'),
    ('admissions.read',           'View admissions'),
    ('admissions.write',          'Admit, transfer, discharge patients'),
    ('inventory.read',            'View pharmacy inventory and stock levels'),
    ('inventory.write',           'Record stock transactions, edit inventory items'),
    ('memberships.manage',        'Invite/remove staff, assign roles'),
    ('hospital.manage',           'Edit hospital settings'),
    ('platform.manage_hospitals', 'Create/suspend/edit any hospital tenant'),
    ('platform.support_access',   'Read-adjacent access for platform support');

-- Role -> permission grants

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'SuperAdmin' and p.key in (
    'platform.manage_hospitals', 'platform.support_access'
);

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'Support' and p.key in (
    'platform.support_access'
);

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'HospitalAdmin' and p.key in (
    'patients.read', 'patients.write',
    'doctors.read', 'doctors.write',
    'departments.read', 'departments.write',
    'appointments.read', 'appointments.write',
    'encounters.read',
    'prescriptions.read',
    'lab_orders.read',
    'lab_results.read',
    'beds.read', 'beds.write',
    'admissions.read',
    'inventory.read', 'inventory.write',
    'memberships.manage',
    'hospital.manage'
);

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'Doctor' and p.key in (
    'patients.read',
    'doctors.read',
    'departments.read',
    'appointments.read', 'appointments.write',
    'encounters.read', 'encounters.write',
    'prescriptions.read', 'prescriptions.write',
    'lab_orders.read', 'lab_orders.write',
    'lab_results.read',
    'beds.read',
    'admissions.read', 'admissions.write'
);

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'Nurse' and p.key in (
    'patients.read',
    'doctors.read',
    'departments.read',
    'appointments.read',
    'encounters.read', 'encounters.write',
    'prescriptions.read',
    'lab_orders.read',
    'lab_results.read',
    'beds.read', 'beds.write',
    'admissions.read', 'admissions.write'
);

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'Receptionist' and p.key in (
    'patients.read', 'patients.write',
    'doctors.read',
    'departments.read',
    'appointments.read', 'appointments.write',
    'beds.read'
);

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'Pharmacist' and p.key in (
    'patients.read',
    'prescriptions.read',
    'inventory.read', 'inventory.write'
);

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'LabTech' and p.key in (
    'patients.read',
    'encounters.read',
    'lab_orders.read', 'lab_orders.write',
    'lab_results.read', 'lab_results.write'
);

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'BillingClerk' and p.key in (
    'patients.read',
    'encounters.read',
    'appointments.read'
);
