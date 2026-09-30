-- 0024_hospital_branding_and_settings.sql
-- Responsibility: Schema extension adding tenant white-label branding, contact, and statutory tax attributes to hospitals table

alter table hospitals
    add column if not exists logo_url text,
    add column if not exists tagline text,
    add column if not exists phone text,
    add column if not exists email text,
    add column if not exists website text,
    add column if not exists brand_color text default '#2563eb',
    add column if not exists gst_number text,
    add column if not exists nabh_number text,
    add column if not exists prescription_footer text,
    add column if not exists invoice_notes text;

-- Seed branding for demo hospital tenants if they exist
update hospitals
set tagline = 'Touching Lives, Transforming Healthcare',
    phone = '+91 44 2829 0200',
    email = 'chennai@apollohospitals.com',
    website = 'https://www.apollohospitals.com',
    brand_color = '#0284c7',
    gst_number = '33AAACA1234A1Z5',
    nabh_number = 'NABH-2024-H-0192',
    prescription_footer = 'Generic drug substitution authorized as per NMC guidelines.',
    invoice_notes = 'Medicines once dispensed cannot be returned. Disputes subject to Chennai jurisdiction.'
where id = '11111111-1111-1111-1111-111111111111';

update hospitals
set tagline = 'Saving and Enriching Lives',
    phone = '+91 124 4921021',
    email = 'fmri@fortishealthcare.com',
    website = 'https://www.fortishealthcare.com',
    brand_color = '#059669',
    gst_number = '06AAACF5678B1Z2',
    nabh_number = 'NABH-2023-H-0451',
    prescription_footer = 'Generic drug substitution authorized as per NMC guidelines.',
    invoice_notes = 'Medicines once dispensed cannot be returned. Disputes subject to Gurugram jurisdiction.'
where id = '22222222-2222-2222-2222-222222222222';

update hospitals
set tagline = 'Care with Compassion',
    phone = '+91 80 7122 2222',
    email = 'info@narayanahealth.org',
    website = 'https://www.narayanahealth.org',
    brand_color = '#d97706',
    gst_number = '29AAACN9012C1Z8',
    nabh_number = 'NABH-2024-H-0789',
    prescription_footer = 'Generic drug substitution authorized as per NMC guidelines.',
    invoice_notes = 'Medicines once dispensed cannot be returned. Disputes subject to Bengaluru jurisdiction.'
where id = '33333333-3333-3333-3333-333333333333';
