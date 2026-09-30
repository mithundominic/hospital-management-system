# API Specification — Hospital Management SaaS

**Status: implemented.** Every endpoint below is wired up in `backend/src/routes/`, one file
per section, matching this document's own grouping. Two things below were the plan but didn't
ship: there's no `/api/v1` prefix (routes are mounted at root), and list endpoints don't
paginate yet — they return every matching row. Fix either by updating `src/app.js`'s mount
path and each route's Supabase query respectively; this document hasn't been re-verified
against the code beyond those two known gaps.

## Conventions

**Base URL** — routes are mounted at root (no `/api/v1` prefix), despite the suggestion below.

**Auth** — Supabase Auth (JWT bearer token). Every authenticated request resolves to a
`user_id` via the token; hospital context comes from the URL, not a header or hidden state.

**Hospital scoping** — any endpoint under `/hospitals/:hospitalId/...` should call
`AuthorizationService.assert(userId, hospitalId, 'permission.key')` before touching data.
That's the app-layer check; RLS is the second, independent layer underneath it.

**Response envelope** — implemented exactly as below, in `src/utils/respond.js`:

```json
{ "data": { "...": "..." }, "error": null }
{ "data": null, "error": { "code": "FORBIDDEN", "message": "..." } }
```

**Pagination** — not implemented. List endpoints return every matching row; add
`?page=`/`?per_page=` support via Supabase's `.range()` if/when result sets get large enough
to matter.

**Insert-only resources** — endpoints for ledger-style tables (`payments`, stock
transactions, `prescriptions`, `lab_results`) deliberately have no PATCH/DELETE. A correction
is a new POST, not an edit.

## Endpoints

### Hospitals

| Method | Path             | Permission        | Notes                                                                                   |
| ------ | ---------------- | ----------------- | --------------------------------------------------------------------------------------- |
| GET    | `/hospitals`     | (membership)      | Hospitals the caller belongs to                                                         |
| POST   | `/onboarding`    | (public)          | Self-service tenant signup: provisions hospital and admin account                       |
| POST   | `/hospitals`     | (public/auth)     | Self-service onboarding (with admin credentials) or tenant creation (with Bearer token) |
| GET    | `/hospitals/:id` | (membership)      |                                                                                         |
| PATCH  | `/hospitals/:id` | `hospital.manage` |                                                                                         |

### Platform Admin — Cross-Hospital Management

| Method | Path                            | Permission                                               | Notes                                                                                   |
| ------ | ------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| GET    | `/platform/hospitals`           | `platform.manage_hospitals` or `platform.support_access` | Returns ALL hospitals with membership details (SuperAdmin/Support only)                 |
| GET    | `/platform/hospitals/:id/stats` | `platform.support_access`                                | Returns operational stats for a specific hospital (staff count, patients, appointments) |

### Staff & memberships

| Method | Path                                       | Permission           | Notes                     |
| ------ | ------------------------------------------ | -------------------- | ------------------------- |
| GET    | `/hospitals/:id/memberships`               | `memberships.manage` |                           |
| POST   | `/hospitals/:id/memberships`               | `memberships.manage` | Invite staff, assign role |
| PATCH  | `/hospitals/:id/memberships/:membershipId` | `memberships.manage` | Change role/status        |

### Patients

| Method | Path                                 | Permission       | Notes                                                 |
| ------ | ------------------------------------ | ---------------- | ----------------------------------------------------- |
| GET    | `/hospitals/:id/patients`            | `patients.read`  | Only patients registered at this hospital             |
| POST   | `/hospitals/:id/patients`            | `patients.write` | Creates `patients` + `patient_registrations` together |
| GET    | `/hospitals/:id/patients/:patientId` | `patients.read`  |                                                       |
| PATCH  | `/hospitals/:id/patients/:patientId` | `patients.write` |                                                       |

### Doctors & departments

| Method | Path                               | Permission          | Notes                                       |
| ------ | ---------------------------------- | ------------------- | ------------------------------------------- |
| GET    | `/hospitals/:id/doctors`           | `doctors.read`      |                                             |
| POST   | `/hospitals/:id/doctors`           | `doctors.write`     | Requires an existing Doctor-role membership |
| PATCH  | `/hospitals/:id/doctors/:doctorId` | `doctors.write`     |                                             |
| GET    | `/hospitals/:id/departments`       | `departments.read`  |                                             |
| POST   | `/hospitals/:id/departments`       | `departments.write` |                                             |

### Appointments

| Method | Path                                  | Permission           | Notes                         |
| ------ | ------------------------------------- | -------------------- | ----------------------------- |
| GET    | `/hospitals/:id/appointments`         | `appointments.read`  | Filter by date/doctor/patient |
| POST   | `/hospitals/:id/appointments`         | `appointments.write` |                               |
| PATCH  | `/hospitals/:id/appointments/:apptId` | `appointments.write` | Reschedule/cancel             |

### Encounters & prescriptions

| Method | Path                                             | Permission            | Notes       |
| ------ | ------------------------------------------------ | --------------------- | ----------- |
| GET    | `/hospitals/:id/encounters`                      | `encounters.read`     |             |
| POST   | `/hospitals/:id/encounters`                      | `encounters.write`    |             |
| PATCH  | `/hospitals/:id/encounters/:encId`               | `encounters.write`    |             |
| GET    | `/hospitals/:id/encounters/:encId/prescriptions` | `prescriptions.read`  |             |
| POST   | `/hospitals/:id/encounters/:encId/prescriptions` | `prescriptions.write` | Insert-only |

### Lab

| Method | Path                                         | Permission          | Notes              |
| ------ | -------------------------------------------- | ------------------- | ------------------ |
| GET    | `/hospitals/:id/lab-orders`                  | `lab_orders.read`   |                    |
| POST   | `/hospitals/:id/lab-orders`                  | `lab_orders.write`  |                    |
| PATCH  | `/hospitals/:id/lab-orders/:orderId`         | `lab_orders.write`  | Status transitions |
| POST   | `/hospitals/:id/lab-orders/:orderId/results` | `lab_results.write` | Insert-only        |

### IPD — beds & admissions

| Method | Path                               | Permission         | Notes              |
| ------ | ---------------------------------- | ------------------ | ------------------ |
| GET    | `/hospitals/:id/beds`              | `beds.read`        |                    |
| POST   | `/hospitals/:id/beds`              | `beds.write`       |                    |
| PATCH  | `/hospitals/:id/beds/:bedId`       | `beds.write`       |                    |
| GET    | `/hospitals/:id/admissions`        | `admissions.read`  |                    |
| POST   | `/hospitals/:id/admissions`        | `admissions.write` |                    |
| PATCH  | `/hospitals/:id/admissions/:admId` | `admissions.write` | Discharge/transfer |

### Pharmacy

| Method | Path                                            | Permission        | Notes                                      |
| ------ | ----------------------------------------------- | ----------------- | ------------------------------------------ |
| GET    | `/hospitals/:id/inventory`                      | `inventory.read`  | Returns the `inventory_current_stock` view |
| POST   | `/hospitals/:id/inventory`                      | `inventory.write` | New item                                   |
| POST   | `/hospitals/:id/inventory/:itemId/transactions` | `inventory.write` | Insert-only ledger entry                   |

### Billing

| Method | Path                                      | Permission      | Notes                  |
| ------ | ----------------------------------------- | --------------- | ---------------------- |
| GET    | `/hospitals/:id/invoices`                 | `billing.read`  |                        |
| POST   | `/hospitals/:id/invoices`                 | `billing.write` | With nested line items |
| PATCH  | `/hospitals/:id/invoices/:invId`          | `billing.write` | Status changes         |
| POST   | `/hospitals/:id/invoices/:invId/payments` | `billing.write` | Insert-only            |

### Insurance

| Method | Path                                       | Permission               | Notes                                            |
| ------ | ------------------------------------------ | ------------------------ | ------------------------------------------------ |
| GET    | `/patients/:patientId/insurance-policies`  | `insurance_claims.read`  | Not hospital-nested — policies are patient-owned |
| POST   | `/patients/:patientId/insurance-policies`  | `insurance_claims.write` |                                                  |
| GET    | `/hospitals/:id/insurance-claims`          | `insurance_claims.read`  |                                                  |
| POST   | `/hospitals/:id/insurance-claims`          | `insurance_claims.write` |                                                  |
| PATCH  | `/hospitals/:id/insurance-claims/:claimId` | `insurance_claims.write` | Submission → settlement                          |

### Staff shifts

| Method | Path                             | Permission     | Notes                                           |
| ------ | -------------------------------- | -------------- | ----------------------------------------------- |
| GET    | `/hospitals/:id/shifts`          | `shifts.read`  | Granted broadly — most roles can see the roster |
| POST   | `/hospitals/:id/shifts`          | `shifts.write` | HospitalAdmin only                              |
| PATCH  | `/hospitals/:id/shifts/:shiftId` | `shifts.write` |                                                 |

### Reports

| Method | Path                                   | Permission     | Notes                         |
| ------ | -------------------------------------- | -------------- | ----------------------------- |
| GET    | `/hospitals/:id/reports/bed-occupancy` | `reports.read` | Wraps `bed_occupancy_summary` |
| GET    | `/hospitals/:id/reports/daily-revenue` | `reports.read` | Wraps `daily_revenue_summary` |
| GET    | `/hospitals/:id/reports/low-stock`     | `reports.read` | Wraps `low_stock_alert`       |

### ABDM (Phase 5 — scaffold, see `docs/PHASE5_ABDM_INTEGRATION.md`)

| Method | Path                                                       | Permission         | Notes                                                                                                                                                                      |
| ------ | ---------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/hospitals/:id/patients/:patientId/abdm/link-requests`    | `abdm.read`        |                                                                                                                                                                            |
| POST   | `/hospitals/:id/patients/:patientId/abdm/verify`           | `abdm.write`       | Starts M1 ABHA verification; returns 202, result via callback                                                                                                              |
| POST   | `/hospitals/:id/patients/:patientId/abdm/confirm`          | `abdm.write`       | Submits the OTP                                                                                                                                                            |
| POST   | `/hospitals/:id/patients/:patientId/abdm/consent-requests` | `abdm.write`       | M3, this hospital acting as HIU                                                                                                                                            |
| POST   | `/abdm/callbacks/*`                                        | none (see warning) | Inbound only, called by ABDM's gateway, not by any client of this API. **No signature verification implemented** — do not point a real sandbox at this until that's fixed. |

## Not covered here

Platform-level endpoints (SuperAdmin creating/suspending hospital tenants) aren't specified
yet — they depend on solving the cross-hospital-enforcement gap noted in `README.md` first.
