# Product Requirements Document — Hospital Management SaaS

## 1. Overview

**Working name:** Hospital Management SaaS (rename freely — nothing downstream depends on this).

**Problem.** Most small-to-mid-size hospitals and nursing homes in India still run significant
parts of their operations — patient records, appointment books, pharmacy stock, billing — on
paper or disconnected spreadsheets. Data doesn't move between departments, there's no single
source of truth for a patient's history across visits, and reconstructing an audit trail after
the fact is hard.

**Product.** A multi-tenant SaaS platform. One hospital signs up, gets its own isolated
workspace, and runs OPD, IPD, pharmacy, lab, billing, and insurance claims through it. Built
hospital-by-hospital, not chain-by-chain — each hospital is its own tenant.

**Assumption flagged:** this PRD targets independent hospitals and small nursing-home groups
(roughly 20–200 beds) as the primary v1 customer, not large multi-branch corporate hospital
chains, which typically want deeper customization or on-prem deployment than a SaaS v1 can
offer. Revisit this if the actual target differs.

## 2. Users & personas

Mirrors the roles already built into the RBAC layer directly:

| Persona | Who they are | What they need from the product |
|---|---|---|
| Hospital Admin | Owner/administrator of a hospital account | Full oversight: staff management, billing visibility, occupancy and revenue reporting |
| Doctor | Consulting/attending physician | Fast access to patient history, a clean way to document a visit, prescribe, order tests |
| Nurse | Ward/OPD nursing staff | Bed and ward status, vitals entry, admission/discharge workflow |
| Receptionist | Front-desk staff | Fast patient registration, appointment booking, OPD payment collection |
| Pharmacist | Runs the in-house pharmacy | See what's prescribed, dispense against it, keep stock accurate |
| Lab Technician | Processes diagnostic tests | Work through the order queue, enter and verify results |
| Billing Clerk | Handles invoicing and insurance | Accurate GST invoices, payment tracking, TPA/insurance claim management |
| Patient (future) | The person receiving care | Out of scope for v1 — see Section 6 |

## 3. Core user journeys

**OPD visit, start to finish.** Receptionist registers/looks up the patient → books an
appointment → Doctor consults and records the encounter (vitals, diagnosis, notes) → Doctor
prescribes and/or orders lab tests → Pharmacist dispenses against the prescription → Lab tech
processes any ordered tests and enters results → Billing generates the invoice → payment is
collected.

**IPD admission.** Doctor decides to admit during/after an encounter → Nurse assigns a bed →
ward care continues (vitals, encounters, prescriptions, lab orders) through the stay → Doctor
discharges → Billing Clerk generates the final invoice and files an insurance claim if
applicable → payment/settlement recorded.

**Insurance claim.** Billing Clerk records the patient's policy → opens a cashless or
reimbursement claim against an invoice at billing time → tracks it through submission →
pre-authorization → approval/rejection → settlement.

**Staff scheduling.** Hospital Admin builds the shift roster → all staff can see who's on
duty; only Admin edits it.

## 4. Functional requirements

### Already modeled (database + RBAC layer complete; API + UI not yet built)

- **Identity & access** — multi-tenant hospitals, 9 staff roles, 33 permissions, row-level security
- **Patients & doctors** — hospital-agnostic patient identity, per-hospital registration, doctor profiles
- **Scheduling** — appointment booking
- **Clinical** — encounters (OPD/IPD), prescriptions, lab orders & results, bed/ward management, admissions
- **Pharmacy** — inventory as an audit-friendly transaction ledger
- **Billing & insurance** — GST-aware invoices, payments ledger, insurance policies & claims (cashless + reimbursement)
- **Operations** — staff shift scheduling, admin dashboards (occupancy, revenue, low stock)

### Implemented since the section above was written

- **API layer** — every endpoint in `docs/API_SPEC.md` now has a working route

### Not yet built

- **Frontend** — no UI exists yet
- **A working ABDM/ABHA integration** — the schema and a client stub exist (Phase 5), but
  there's no real sandbox connection, no FHIR bundle construction, and no callback signature
  verification. See `docs/PHASE5_ABDM_INTEGRATION.md` for exactly what's real vs. placeholder.
- A few RLS/permission gaps — see `README.md`'s "Known gaps"

## 5. Non-functional requirements

- **Tenant isolation.** No hospital can see another hospital's data under any normal user
  role — enforced at both the application layer (`AuthorizationService`) and the database
  layer (RLS), independently.
- **Regulatory.** DPDP Act, 2023 compliance (consent capture, data-principal rights, breach
  notification readiness) — see the architecture plan's compliance section, researched
  September 2026. Verify current requirements before launch; this isn't legal advice.
- **Auditability.** Financial and clinical-documentation tables are insert-only ledgers by
  design — no silent edits to prescriptions, lab results, payments, or stock movements.
- **Availability/performance.** Not yet specified — define target SLAs once a hosting/scaling
  plan exists.

## 6. Out of scope for v1

- Patient-facing portal or mobile app
- OT/surgery scheduling, PACS/radiology imaging integration
- Ambulance dispatch, blood bank management
- Multi-branch hospital group management (one hospital = one tenant; a chain needs N tenants
  today, not a shared parent-child structure)
- ABDM/ABHA integration (Phase 5, not started)
- Billing rate-card / dynamic pricing engines — v1 assumes invoice line items are entered
  directly, not generated from a configurable price list

## 7. Success metrics (draft — revisit once there's real usage data)

- Hospitals onboarded and actively using the system weekly
- % of OPD visits completed through the full digital flow (registration → encounter →
  billing) vs. falling back to paper
- Insurance claim cycle time (submission → settlement)
- Staff-reported time saved vs. their previous process
