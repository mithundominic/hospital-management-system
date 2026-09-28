-- 0011_seed_billing_permissions.sql
-- Phase 3 permissions: billing.* and insurance_claims.*, granted to the roles
-- that actually touch money. This is what turns BillingClerk from the
-- 3-permission placeholder seeded in 0008 into an actual working role.

insert into permissions (key, description) values
    ('billing.read',           'View invoices, line items, and payment history'),
    ('billing.write',          'Create/update invoices, record payments'),
    ('insurance_claims.read',  'View insurance policies and claims'),
    ('insurance_claims.write', 'Create/update insurance claims and policies');

-- HospitalAdmin: billing is operational, not clinical, so it follows the same
-- rule as departments/appointments/beds/inventory -- full read + write.
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'HospitalAdmin' and p.key in (
    'billing.read', 'billing.write',
    'insurance_claims.read', 'insurance_claims.write'
);

-- BillingClerk: this is the whole job now.
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'BillingClerk' and p.key in (
    'billing.read', 'billing.write',
    'insurance_claims.read', 'insurance_claims.write'
);

-- Receptionist: OPD-level billing.read, patients often pay a consultation fee
-- at the front desk. No insurance_claims access -- TPA coordination stays
-- with BillingClerk.
insert into role_permissions (role_id, permission_id)
select r.id, p.id from roles r, permissions p
where r.name = 'Receptionist' and p.key in (
    'billing.read', 'billing.write'
);
