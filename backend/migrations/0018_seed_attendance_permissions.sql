-- 0018_seed_attendance_permissions.sql
-- Permissions for attendance tracking and leave management.
--
-- Deliberate calls:
--  - attendance.write is granted to ALL hospital roles because every staff member
--    needs to check in/out for their shifts. This is not privileged access.
--  - attendance.read is granted only to HospitalAdmin and Nurse roles who need
--    to monitor staff attendance and generate reports.
--  - leave.write allows any staff member to apply for leave, but approval
--    requires leave.read permission (HospitalAdmin only).
--  - leave.read is HospitalAdmin-only because leave approval/rejection and
--    viewing all leave applications is a management function.

-- Insert new permissions
insert into permissions (key, description) values
    ('attendance.read',  'View all staff attendance records and generate reports'),
    ('attendance.write', 'Check in/out and manage own attendance records'),
    ('leave.read',       'View all leave applications and approve/reject them'),
    ('leave.write',      'Apply for leave and manage own leave applications');

-- Grant attendance.write to all hospital roles (everyone can check in/out)
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name in (
    'HospitalAdmin', 'Doctor', 'Nurse', 'Receptionist', 
    'Pharmacist', 'LabTech', 'BillingClerk'
) and p.key = 'attendance.write';

-- Grant attendance.read to HospitalAdmin and Nurse (can view all records)
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name in ('HospitalAdmin', 'Nurse')
and p.key = 'attendance.read';

-- Grant leave.write to all hospital roles (everyone can apply for leave)
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name in (
    'HospitalAdmin', 'Doctor', 'Nurse', 'Receptionist', 
    'Pharmacist', 'LabTech', 'BillingClerk'
) and p.key = 'leave.write';

-- Grant leave.read to HospitalAdmin only (approve/reject leave applications)
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'HospitalAdmin'
and p.key = 'leave.read';
