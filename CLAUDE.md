# CLAUDE.md

Guidance for Claude Code (or any AI coding assistant) working in this repository. Read this
before making changes — the conventions below aren't arbitrary; several exist specifically to
stop an agent from "helpfully" undoing a deliberate design choice.

## What this is

A multi-tenant hospital management SaaS. Postgres schema (Supabase) + RBAC design + a working
Express API implementing every endpoint in `docs/API_SPEC.md`, covering Phases 1–4. Phase 5
(ABDM/ABHA integration) is scaffolded but not connected to a real ABDM sandbox — read
`docs/PHASE5_ABDM_INTEGRATION.md` before treating `AbdmClient.js` as working code. **No
frontend exists yet.**

- Product context: `PRD.md`
- Full schema reference + ER diagrams: `docs/DATABASE_SCHEMA.md`
- API contract: `docs/API_SPEC.md`
- ABDM scaffold status: `docs/PHASE5_ABDM_INTEGRATION.md`
- Implementation status, migration index, role/permission counts: `README.md`

## Tech stack

- **Database & auth**: Supabase (Postgres + Auth + Row-Level Security)
- **Backend**: Node.js + Express, consuming RBAC via
  `backend/src/services/AuthorizationService.js`
- **Frontend**: not yet chosen or built

## Repo structure

```
backend/
  migrations/            numbered SQL migrations, applied in order
  src/
    server.js             entry point
    app.js                 mounts every router
    config/supabase.js      admin client + per-request user-scoped client
    middleware/
      auth.js                verifies the JWT, attaches req.userId / req.supabase
      requireHospitalPermission.js   wraps AuthorizationService.assert()
      errorHandler.js
    services/
      AuthorizationService.js
      AbdmClient.js           Phase 5 scaffold -- not sandbox-verified, see docs/PHASE5_ABDM_INTEGRATION.md
    routes/                 one file per docs/API_SPEC.md section
      abdm.js                 staff-facing ABDM routes (normal auth)
      abdmCallbacks.js         inbound ABDM gateway callbacks (NO auth -- see its header comment)
    utils/respond.js
docs/
  API_SPEC.md
  DATABASE_SCHEMA.md
  PHASE5_ABDM_INTEGRATION.md
PRD.md
README.md
```

## Patterns to never break

- **Migrations are numbered and sequential** (`0001_...sql` through `0015_...sql` as of this
  writing). Never renumber or edit an already-applied migration — add a new one.
- **Permission keys are `domain.action`** (`patients.read`, `billing.write`, ...). Match this
  exactly for any new permission — don't invent a different casing or separator.
- **Every hospital-scoped route calls `requireHospitalPermission('permission.key')`** as
  middleware, and every route handler queries through `req.supabase` (the user-scoped
  client), never the admin client. Three deliberate exceptions exist — `routes/insurance.js`'s
  two `/patients/...` routes, and all of `routes/abdmCallbacks.js` — each has a header comment
  explaining why. Read those before treating either as a template for a new route.
- **`patients` and `insurance_policies` are hospital-agnostic** — no `hospital_id` column.
  Their RLS reaches hospital scope indirectly, through `patient_registrations`. Don't add a
  `hospital_id` column to either as a shortcut.
- **Financial and clinical-documentation tables are insert-only ledgers**: `payments`,
  `stock_transactions`, `prescriptions`, `prescription_items`, `lab_results`. No UPDATE or
  DELETE route or RLS policy exists for any of these, on purpose.
- **`role_inheritance` is intentionally empty.** Grant permissions to HospitalAdmin directly
  instead of wiring up inheritance (full reasoning in `0008`'s header comment).
- **ABDM calls are async, not request/response.** A call in `AbdmClient.js` returns a
  pending-request acknowledgment; the real answer arrives later as a POST to
  `routes/abdmCallbacks.js`. Don't "fix" an `AbdmClient` method to synchronously return the
  actual result — that's not how the protocol works, see
  `docs/PHASE5_ABDM_INTEGRATION.md`.

## Running this

- Migrations: via the Supabase CLI (`supabase migration up`), adjusted to however this
  project's Supabase project actually gets configured — no `supabase/config.toml` exists yet.
- API: `cd backend`, copy `.env.example` to `.env`, fill in the three Supabase values
  (ABDM values only needed for Phase 5 work), `npm install`, `npm run dev`.

## Known gaps — flag these to the person, don't silently patch them

- `patient_registrations`, `doctor_profiles`, `departments` only have SELECT RLS policies.
- No overlap prevention on `staff_shifts`, DB-level or otherwise.
- `SuperAdmin`/`Support` roles have no actual cross-hospital enforcement mechanism.
- GST invoice numbering isn't implemented beyond a uniqueness constraint.
- API layer: no `/api/v1` prefix, no pagination, no tests, no CI.
- The two-insert flows (patient+registration, prescription+items, invoice+line items) aren't
  transactional.
- **`abdmCallbacks.js` doesn't verify ABDM's callback signature** — a real gap, not a style
  choice, if this is ever pointed at a live sandbox. Fix before that happens.
- **`AbdmClient.js`'s payload shapes aren't sandbox-verified.** Treat every request/response
  body in that file as a placeholder to check against current ABDM docs, not working code.

Full detail: `README.md`'s "Known gaps" section and `docs/PHASE5_ABDM_INTEGRATION.md`.

## What's genuinely not built yet

Frontend, tests, CI, deployment config, and a verified/working ABDM integration (the schema
and client shape exist; the actual sandbox connection doesn't). If asked to "build the UI" or
"make ABDM actually work," there's no existing pattern in this repo for either yet — say so
rather than assuming one.
