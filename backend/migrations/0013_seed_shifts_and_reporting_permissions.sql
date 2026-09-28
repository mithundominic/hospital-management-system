-- 0013_seed_shifts_and_reporting_permissions.sql
-- Phase 4 permissions: shifts.* for roster visibility/scheduling, reports.read
-- for the admin dashboard views.

insert into permissions (key, description) values
    ('shifts.read',   'View the staff shift roster'),
    ('shifts.write',  'Create/edit staff shifts'),
    ('reports.read',  'View admin dashboard views (occupancy, revenue, low stock)');

-- Roster visibility is broad -- knowing who's on duty is coordination info
-- useful to almost every role, not a privileged view.
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name in (
    'HospitalAdmin', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'LabTech', 'BillingClerk'
) and p.key = 'shifts.read';

-- Scheduling itself and the admin dashboards stay with HospitalAdmin only.
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'HospitalAdmin' and p.key in (
    'shifts.write', 'reports.read'
);
