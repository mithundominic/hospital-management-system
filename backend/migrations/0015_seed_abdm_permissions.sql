-- 0015_seed_abdm_permissions.sql
-- Phase 5 permissions: abdm.read/write. Receptionist gets both -- ABHA
-- verification commonly happens during front-desk registration in practice
-- -- while Doctor gets read-only, mirroring the "read broadly, write
-- narrowly" pattern used everywhere else in this seed.

insert into permissions (key, description) values
    ('abdm.read',  'View ABHA linking status and consent artifacts'),
    ('abdm.write', 'Initiate ABHA verification, care-context linking, and consent requests');

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name in ('HospitalAdmin', 'Receptionist') and p.key in ('abdm.read', 'abdm.write');

insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'Doctor' and p.key = 'abdm.read';
