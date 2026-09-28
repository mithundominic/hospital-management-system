-- 0010_billing_and_insurance.sql
-- Phase 3: money. Invoices/line items, an insert-only payments ledger (same
-- pattern as stock_transactions), and insurance/TPA claims.

create table invoices (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    patient_id uuid not null references patients(id) on delete cascade,
    encounter_id uuid references encounters(id),   -- OPD invoice
    admission_id uuid references admissions(id),   -- IPD invoice
    invoice_number text not null,
    status text not null default 'draft',  -- draft | issued | paid | partially_paid | cancelled
    subtotal numeric(12,2) not null default 0,
    cgst_total numeric(12,2) not null default 0,
    sgst_total numeric(12,2) not null default 0,
    discount_amount numeric(12,2) not null default 0,
    total_amount numeric(12,2) not null default 0,
    issued_at timestamptz,
    due_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (hospital_id, invoice_number)
);

create index idx_invoices_hospital on invoices(hospital_id);
create index idx_invoices_patient on invoices(patient_id);
create index idx_invoices_status on invoices(status);

-- Polymorphic reference_type/reference_id: what a charge line is FOR varies a
-- lot more than what an invoice is for, so this stays loosely typed rather
-- than five nullable FK columns.
create table invoice_line_items (
    id uuid primary key default gen_random_uuid(),
    invoice_id uuid not null references invoices(id) on delete cascade,
    description text not null,
    hsn_sac_code text,              -- HSN for goods (medicines), SAC for services (consultations)
    quantity numeric(10,2) not null default 1,
    unit_price numeric(12,2) not null,
    gst_rate numeric(5,2) not null default 0,      -- percentage; many core healthcare services are 0
    cgst_amount numeric(12,2) not null default 0,
    sgst_amount numeric(12,2) not null default 0,  -- CGST+SGST covers the in-person, intra-state
                                                    -- case, which is effectively all hospital
                                                    -- billing; IGST (inter-state) isn't handled here
    line_total numeric(12,2) not null,  -- quantity * unit_price, pre-tax
    reference_type text,   -- 'consultation' | 'lab_order' | 'prescription_item' | 'bed_charge' | 'procedure' | 'other'
    reference_id uuid
);

create index idx_invoice_line_items_invoice on invoice_line_items(invoice_id);

-- Insert-only, same reasoning as stock_transactions: a refund is a new
-- negative-amount row, not an edit to a past payment.
create table payments (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    invoice_id uuid not null references invoices(id) on delete cascade,
    amount numeric(12,2) not null,  -- positive = payment received, negative = refund issued
    payment_method text not null,   -- cash | card | upi | bank_transfer | insurance_settlement
    reference_number text,          -- UPI ref, transaction ID, cheque number, etc.
    received_by uuid not null references memberships(id),
    paid_at timestamptz not null default now(),
    notes text
);

create index idx_payments_hospital on payments(hospital_id);
create index idx_payments_invoice on payments(invoice_id);

-- Balance is derived from the ledger, not stored -- same reasoning as
-- inventory_current_stock in Phase 2.
create view invoice_balance
    with (security_invoker = true) as
    select
        i.id as invoice_id,
        i.hospital_id,
        i.total_amount,
        coalesce(sum(p.amount), 0) as amount_paid,
        i.total_amount - coalesce(sum(p.amount), 0) as balance_due
    from invoices i
    left join payments p on p.invoice_id = i.id
    group by i.id, i.hospital_id, i.total_amount;

-- Insurance policies are patient-owned, not hospital-owned -- same call as
-- `patients` itself. The same policy can cover visits to several hospitals.
create table insurance_policies (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid not null references patients(id) on delete cascade,
    provider_name text not null,     -- e.g. 'Star Health', or a government scheme name
    tpa_name text,                   -- Third Party Administrator handling cashless claims
    policy_number text not null,
    valid_from date,
    valid_to date,
    coverage_details jsonb,          -- sum insured, coverage type, exclusions -- varies too much for fixed columns
    created_at timestamptz not null default now()
);

create index idx_insurance_policies_patient on insurance_policies(patient_id);

create table insurance_claims (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    invoice_id uuid not null references invoices(id),
    insurance_policy_id uuid not null references insurance_policies(id),
    claim_number text,              -- the TPA/insurer's own reference, filled in once submitted
    claim_type text not null default 'cashless',  -- cashless | reimbursement
    status text not null default 'draft',  -- draft | submitted | pre_authorized | approved | partially_approved | rejected | settled
    claimed_amount numeric(12,2) not null,
    approved_amount numeric(12,2),
    rejection_reason text,
    handled_by uuid references memberships(id),
    submitted_at timestamptz,
    settled_at timestamptz,
    created_at timestamptz not null default now()
);

create index idx_insurance_claims_hospital on insurance_claims(hospital_id);
create index idx_insurance_claims_invoice on insurance_claims(invoice_id);
create index idx_insurance_claims_status on insurance_claims(status);

alter table invoices enable row level security;
alter table invoice_line_items enable row level security;
alter table payments enable row level security;
alter table insurance_policies enable row level security;
alter table insurance_claims enable row level security;

create policy invoices_select_by_hospital on invoices
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'billing.read'));

create policy invoices_insert_by_hospital on invoices
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'billing.write'));

create policy invoices_update_by_hospital on invoices
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'billing.write'));

create policy invoice_line_items_select on invoice_line_items
    for select using (
        exists (
            select 1 from invoices i
            where i.id = invoice_line_items.invoice_id
              and rbac_effective_hospital_permission(auth.uid(), i.hospital_id, 'billing.read')
        )
    );

create policy invoice_line_items_insert on invoice_line_items
    for insert with check (
        exists (
            select 1 from invoices i
            where i.id = invoice_line_items.invoice_id
              and rbac_effective_hospital_permission(auth.uid(), i.hospital_id, 'billing.write')
        )
    );

create policy payments_select_by_hospital on payments
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'billing.read'));

create policy payments_insert_by_hospital on payments
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'billing.write'));

-- Insurance policies have no hospital_id, so scope is reached the same way as
-- patients: indirectly, through which hospital(s) this patient is registered at.
create policy insurance_policies_select on insurance_policies
    for select using (
        exists (
            select 1 from patient_registrations pr
            where pr.patient_id = insurance_policies.patient_id
              and rbac_effective_hospital_permission(auth.uid(), pr.hospital_id, 'insurance_claims.read')
        )
    );

create policy insurance_policies_insert on insurance_policies
    for insert with check (
        exists (
            select 1 from patient_registrations pr
            where pr.patient_id = insurance_policies.patient_id
              and rbac_effective_hospital_permission(auth.uid(), pr.hospital_id, 'insurance_claims.write')
        )
    );

create policy insurance_claims_select_by_hospital on insurance_claims
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'insurance_claims.read'));

create policy insurance_claims_insert_by_hospital on insurance_claims
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'insurance_claims.write'));

create policy insurance_claims_update_by_hospital on insurance_claims
    for update using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'insurance_claims.write'));
