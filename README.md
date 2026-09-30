# Hospital Management SaaS — backend (Phase 1–4 complete, Phase 5 scaffolded)

Phase 1 (foundation), Phase 2 (clinical), Phase 3 (billing/insurance), and Phase 4
(scheduling/reporting) schema, permission seeds, and a working Express API implementing every
endpoint in `docs/API_SPEC.md`. Phase 5 (ABDM/ABHA integration) is scaffolded — real schema
and a clearly-labeled client stub, but not connected to an actual ABDM sandbox. See
`docs/PHASE5_ABDM_INTEGRATION.md` before treating it as more than that.

## Documentation

- `PRD.md` — product requirements: personas, user journeys, functional/non-functional
  requirements, what's out of scope for v1
- `CLAUDE.md` — conventions and guardrails for AI coding assistants working in this repo
- `docs/API_SPEC.md` — the REST contract, implemented — see its status note for known gaps
- `docs/DATABASE_SCHEMA.md` — consolidated schema reference with per-domain ER diagrams
- `docs/PHASE5_ABDM_INTEGRATION.md` — what's real vs. placeholder in the ABDM scaffold, and
  what has to happen before any of it can run for real

## Structure

```
backend/
  migrations/            numbered SQL migrations, applied in order
  src/
    server.js             entry point
    app.js                 mounts every router
    config/supabase.js      admin client + per-request user-scoped client
    middleware/             auth, requireHospitalPermission, errorHandler
    services/
      AuthorizationService.js
      AbdmClient.js          Phase 5 scaffold, not sandbox-verified
    routes/                 one file per docs/API_SPEC.md section, plus abdm.js / abdmCallbacks.js
    utils/respond.js
docs/
  API_SPEC.md
  DATABASE_SCHEMA.md
  PHASE5_ABDM_INTEGRATION.md
PRD.md
CLAUDE.md
README.md
```

Running the API: `cd backend`, copy `.env.example` to `.env`, fill in the three Supabase
values (ABDM values can stay blank unless testing Phase 5), `npm install`, `npm run dev`.

## Migrations in this drop

**Phase 1 — foundation**

1. `0001_hospitals_and_rbac_foundation.sql` — `hospitals`, `roles`, `permissions`,
   `role_permissions`, `role_inheritance`, `memberships`, and the
   `rbac_effective_hospital_permission()` resolver
2. `0002_patients_and_doctors.sql` — `patients` (deliberately hospital-agnostic),
   `patient_registrations`, `departments`, `doctor_profiles`
3. `0003_appointments.sql` — `appointments`, tying patient + doctor + hospital together

**Phase 2 — clinical**

4. `0004_encounters_and_prescriptions.sql` — `encounters`, `prescriptions` + `prescription_items`
5. `0005_lab_orders_and_results.sql` — `lab_orders`, `lab_results`
6. `0006_ipd_beds_and_admissions.sql` — `beds`, `admissions` (DB-level: no two active
   admissions can share a bed)
7. `0007_pharmacy_inventory.sql` — `inventory_items` + `stock_transactions` ledger,
   `inventory_current_stock` view

**Permission seed (Phase 1+2)**

8. `0008_seed_roles_and_permissions.sql` — 9 roles, 26 permissions, and the grants

**Phase 3 — billing & insurance**

9. `0009_patch_patients_rls.sql` — closes a Phase 1 gap: `patients` never had RLS enabled
10. `0010_billing_and_insurance.sql` — `invoices` + `invoice_line_items` (GST-aware),
    insert-only `payments` ledger + `invoice_balance` view, `insurance_policies`
    (patient-owned), `insurance_claims`
11. `0011_seed_billing_permissions.sql` — `billing.*`, `insurance_claims.*`

**Phase 4 — scheduling & reporting**

12. `0012_staff_shifts_and_reporting.sql` — `staff_shifts`, plus three admin dashboard
    views: `bed_occupancy_summary`, `daily_revenue_summary`, `low_stock_alert`
13. `0013_seed_shifts_and_reporting_permissions.sql` — `shifts.*`, `reports.read`

**Phase 5 — ABDM integration (scaffold)**

14. `0014_abdm_integration.sql` — `patients.abha_address`/`abha_verified`, `abdm_link_requests`
    (M1/M2), `abdm_consent_artifacts` (M3), `abdm_callback_log` (no RLS — service-role only)
15. `0015_seed_abdm_permissions.sql` — `abdm.read`, `abdm.write`

**Attendance & Leave Management**

16. `0017_attendance_and_leave_management.sql` — `attendance_records`, `leave_requests`, `leave_balances`
17. `0018_platform_admin_access.sql` — Platform-level roles (`platform_memberships`), `is_platform_admin()`,
    `has_platform_permission()`, RLS policies for SuperAdmin/Support to access all hospitals

## Role design notes

Full reasoning lives in each migration's header comment. Current counts:

| Role          | Scope    | Permissions |
| ------------- | -------- | ----------- |
| SuperAdmin    | platform | 2           |
| Support       | platform | 1           |
| HospitalAdmin | hospital | 28          |
| Doctor        | hospital | 17          |
| Nurse         | hospital | 14          |
| Receptionist  | hospital | 12          |
| BillingClerk  | hospital | 8           |
| LabTech       | hospital | 7           |
| Pharmacist    | hospital | 5           |

- **No `role_inheritance` rows.** Hospital roles are specialty-based, not a linear hierarchy
  like Duzii's Owner > Manager > Staff — see `0008`'s header comment for the full reasoning.
- **HospitalAdmin reads everything, writes only operational tables** (not encounters,
  prescriptions, lab_orders, lab_results) — billing, shift scheduling, and ABDM linking all
  count as operational, so admin gets full read+write there.
- **Roster visibility (`shifts.read`) is granted broadly**; scheduling itself and the admin
  dashboards stay HospitalAdmin-only.
- **`abdm.write` went to Receptionist, not just HospitalAdmin** — ABHA verification commonly
  happens during front-desk registration in practice. Doctor gets `abdm.read` only.
- **Hospital-agnostic entities** (`patients`, `insurance_policies`) reach hospital scope
  indirectly through `patient_registrations`.
- **Ledgers are insert-only**: `payments`, `stock_transactions` — a correction is a new row,
  never an edit to history.

## API layer

Every route in `backend/src/routes/` follows the same shape: `requireHospitalPermission()`
middleware runs the `AuthorizationService` check first, then the handler queries through
`req.supabase` — a client authenticated as the calling user, so RLS applies as the second,
independent layer underneath. Two deliberate exceptions: `routes/insurance.js`'s
`/patients/:patientId/insurance-policies` routes (RLS alone enforces — see that file's header
comment), and `routes/abdmCallbacks.js`, which has no auth at all because its caller is
ABDM's gateway, not a logged-in user (and has an unresolved security gap of its own — see
its header comment before pointing a real sandbox at it).

## Known gaps (flagged, not fixed)

- `patient_registrations`, `doctor_profiles`, and `departments` (from `0002`) only ever got
  SELECT RLS policies — the corresponding POST/PATCH routes exist in the API layer but will
  fail against RLS until that's fixed.
- No DB-level (or application-level) overlap prevention on `staff_shifts`.
- ~~SuperAdmin/Support have no cross-hospital enforcement~~ **FIXED in migration 0018**: Platform admins
  now use `platform_memberships` table and can access all hospitals via `/platform/hospitals` endpoints.
- GST invoice numbering is an application-layer decision the schema doesn't make.
- API layer: no `/api/v1` prefix, no pagination on list endpoints, no automated tests, no CI.
- The two-insert flows (patient + registration, prescription + items, invoice + line items)
  aren't wrapped in a database transaction.
- **Phase 5 is a scaffold, not a working integration** — no real ABDM sandbox credentials,
  no FHIR bundle construction, no callback signature verification (a real security gap if
  this were pointed at a live sandbox as-is). Full detail: `docs/PHASE5_ABDM_INTEGRATION.md`.
- A parity/verification layer and an admin role-management UI are both still open.
- **Frontend is complete** — see `FRONTEND_COMPLETE.md` for full UI implementation status.
