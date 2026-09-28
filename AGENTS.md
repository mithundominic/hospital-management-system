# Hospital Management SaaS — Agent Rules & System Architecture Gateway (Level 0)

> **These rules are absolute and non-negotiable.**  
> Authority Hierarchy: Live code & schema > root `AGENTS.md` > `docs/` specifications > `CLAUDE.md` > historical audits.

---

## 1. The Four Core Principles

### 1.1 Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

LLMs often pick an interpretation silently and run with it. This principle forces explicit reasoning:

- **State assumptions explicitly** — If uncertain, ask rather than guess
- **Present multiple interpretations** — Don't pick silently when ambiguity exists
- **Push back when warranted** — If a simpler approach exists, say so
- **Stop when confused** — Name what's unclear and ask for clarification
- Never hide confusion or guess silently

### 1.2 Simplicity First

Minimum code that solves the problem. Nothing speculative.

Combat the tendency toward overengineering:

- No features beyond what was asked
- No abstractions for single-use code
- No "flexibility" or "configurability" that wasn't requested
- No error handling for impossible scenarios
- If 200 lines could be 50, rewrite it
- No speculative configurability

**The test:** Would a senior engineer say this is overcomplicated? If yes, simplify.

### 1.3 Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting
- Don't refactor things that aren't broken
- Match existing style, even if you'd do it differently
- If you notice unrelated dead code, mention it — don't delete it
- Zero "while I'm here" refactoring or formatting churn

**When your changes create orphans:**

- Remove imports/variables/functions that YOUR changes made unused
- Don't remove pre-existing dead code unless asked

**The test:** Every changed line should trace directly to the user's request.

### 1.4 Goal-Driven Execution

Transform imperative tasks into verifiable goals. Define success criteria. Loop until verified.

| Instead of...    | Transform to...                                       |
| ---------------- | ----------------------------------------------------- |
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug"    | "Write a test that reproduces it, then make it pass"  |
| "Refactor X"     | "Ensure tests pass before and after"                  |

For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Define objective verification gates (tests pass, typecheck passes, specific feature works) before coding.

Strong success criteria let the LLM loop independently. Weak criteria ("make it work") require constant clarification.

---

## 2. Non-Negotiable Architectural Invariants

### Database & Migrations

- **Rule 1 (Sequential Migrations)**: Migrations are numbered and sequential (`0001_...sql` through `0015_...sql` as of this writing). **Never renumber or edit an already-applied migration** — add a new one.
- **Rule 2 (Insert-Only Ledgers)**: Financial and clinical-documentation tables are insert-only ledgers: `payments`, `stock_transactions`, `prescriptions`, `prescription_items`, `lab_results`. **No UPDATE or DELETE route or RLS policy exists for any of these, on purpose.** A correction is a new row, not an edit to history.
- **Rule 3 (Hospital-Agnostic Patients)**: `patients` and `insurance_policies` are hospital-agnostic — **no `hospital_id` column**. Their RLS reaches hospital scope indirectly through `patient_registrations`. Don't add a `hospital_id` column as a shortcut.

### RBAC & Permissions

- **Rule 4 (Permission Naming)**: Permission keys are `domain.action` (`patients.read`, `billing.write`, ...). **Match this exactly** for any new permission — don't invent a different casing or separator.
- **Rule 5 (No Role Inheritance)**: `role_inheritance` is **intentionally empty**. Grant permissions to roles directly instead of wiring up inheritance (full reasoning in `backend/migrations/0008_seed_roles_and_permissions.sql`'s header comment).
- **Rule 6 (Authorization Layers)**: Every hospital-scoped route calls `requireHospitalPermission('permission.key')` as middleware (app-layer check), and every route handler queries through `req.supabase` (user-scoped client, RLS applies). **Three deliberate exceptions exist** — see Rule 9.

### Backend Architecture

- **Rule 7 (Service Layer Isolation)**: Business logic lives in `backend/src/services/`. Controllers in `backend/src/routes/` only parse HTTP and call services. Services orchestrate; repositories query.
- **Rule 8 (Single Responsibility Routes)**: One file per API section in `backend/src/routes/`, matching `docs/API_SPEC.md` grouping. Every file has exactly one reason to change.
- **Rule 9 (Auth Exceptions)**: Three routes bypass normal auth patterns deliberately:
  1. `routes/insurance.js`'s two `/patients/...` routes (RLS alone enforces — see file's header comment)
  2. All of `routes/abdmCallbacks.js` (inbound ABDM gateway callbacks, no user auth — see file's header comment)

  **Read those files' header comments before treating them as templates for new routes.**

### Frontend Architecture

- **Rule 10 (Zero Direct Supabase)**: Frontend has **0 `supabase.from()` / `rpc()` calls**. All data via `api` client (REST) or future GraphQL layer.
- **Rule 11 (Type Safety)**: TypeScript strict mode active (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`). Zero unvalidated `any`. Use interfaces for all data shapes.
- **Rule 12 (Component Structure)**: Components live in `frontend/src/components/`, pages in `frontend/src/pages/`, contexts in `frontend/src/contexts/`. Shared utilities in `frontend/src/lib/`.
- **Rule 13 (Raw HTML Constraint)**: Raw HTML elements (`<div>`, `<p>`, `<span>`, `<button>`, `<input>`, etc.) are permitted only inside `frontend/src/components/ui/`. Every other file must compose using `components/ui/` primitives or higher-level compositions.
- **Rule 14 (No Repeated JSX)**: If the same JSX structure appears more than once anywhere in the codebase, extract it immediately into a reusable component.

### Supabase Security

- **Rule 15 (Per-Request Client)**: Backend creates fresh authenticated client per request (`createAuthenticatedClient(req.session)`). **Zero repository caching**. `getAdminClient()` forbidden in HTTP controllers (use only in migrations/scripts).
- **Rule 16 (RLS First)**: Row-Level Security policies are the **second, independent layer** of authorization underneath app-layer permission checks. Both must pass.

### Environment & Configuration

- **Rule 17 (Centralized Env)**: Direct `process.env` access forbidden. All environment variables validated via `.env` / `.env.example` pattern. Backend uses `backend/.env`, frontend uses `frontend/.env`.
- **Rule 18 (Configuration-Driven)**: Wherever a list, mapping, or set of variants drives rendering, use a configuration object — never inline conditionals or repeated JSX.

### Code Quality & Organization

- **Rule 19 (One File, One Responsibility - SRP)**: Every file has exactly one reason to change. State its single responsibility in a one-line comment at the top of each file.
- **Rule 20 (100-Line Hard Limit)**: No `.ts` or `.tsx` file may exceed 100 lines — including imports, blank lines, and comments. When approaching the limit: extract inner components, hooks, utils, or data files.
- **Rule 21 (DRY - Do Not Repeat Yourself)**: Duplication tolerance: **zero**. The second time you write the same thing is the moment to refactor.
- **Rule 22 (TypeScript ES6+ - Functional Only)**: No class-based components except `components/common/ErrorBoundary.tsx`. Use const arrow functions or named function declarations. Never use `any`.
- **Rule 23 (Component Anatomy)**: Every component follows this structure: (1) "use client" directive if needed, (2) external imports, (3) internal imports, (4) types/interfaces, (5) component with hooks first, derived values, early returns, then JSX.
- **Rule 24 (Hooks Anatomy)**: One hook = one concern. Always return a stable object or tuple with `as const`. Never fetch data inside a component — always delegate to a hook.

---

## 3. AI Agent Workflow Loop

Follow the prescribed 5-stage loop: **Explore** ➔ **Plan** ➔ **Implement** ➔ **Test** ➔ **Audit & Handoff**.

### Stage 1: Explore

1. Read relevant schema files (`backend/migrations/`, `docs/DATABASE_SCHEMA.md`)
2. Check existing API routes (`backend/src/routes/`, `docs/API_SPEC.md`)
3. Review RBAC layer (`backend/src/services/AuthorizationService.js`, permission seeds)
4. Identify which files need changes — **state assumptions explicitly**
5. Surface any ambiguity or tradeoffs before proceeding

### Stage 2: Plan

1. Define the objective verification gate (tests pass, typecheck passes, specific feature works)
2. List exact files to create/modify
3. Confirm surgical scope — no "while I'm here" changes
4. State a brief plan with verification steps
5. Get confirmation before proceeding if the change affects:
   - Database schema (new migration needed)
   - RBAC structure (new permission/role)
   - Multi-file refactoring

### Stage 3: Implement

1. Make minimum code changes that solve the problem
2. Follow Rule 1.3 (Surgical Changes) — touch only what you must
3. Match existing patterns in the codebase
4. Add TypeScript types/interfaces as needed
5. Extract to separate files if approaching 100-line limit
6. Extract repeated code immediately (DRY principle)

### Stage 4: Test

1. Run TypeScript typecheck: `npm run typecheck` (or equivalent)
2. Run backend tests if they exist: `npm test` (backend)
3. Run frontend build: `npm run build` (frontend)
4. Manually verify the specific feature gate defined in Stage 2

### Stage 5: Audit & Handoff

1. Verify all changes respect the architectural invariants (Rules 1–24)
2. Confirm no insert-only ledgers were modified (Rule 2)
3. Confirm no migrations were edited (Rule 1)
4. Confirm no file exceeds 100 lines (Rule 20)
5. Confirm no code duplication exists (Rule 21)
6. Document any new patterns introduced
7. Report completion with verification results

---

## 4. Code Organization Patterns

### 4.1 File Responsibility Matrix

| File pattern        | Sole responsibility                                                           |
| ------------------- | ----------------------------------------------------------------------------- |
| `*.tsx` component   | Render UI and expose interaction events — no data fetching, no business logic |
| `use<Name>.ts`      | Encapsulate one piece of stateful or async logic                              |
| `<name>.service.ts` | All HTTP or DB calls for one domain resource                                  |
| `<name>.types.ts`   | Type definitions for one domain concept                                       |
| `<name>.utils.ts`   | Pure functions for one concern                                                |
| `<name>.config.ts`  | Configuration object for one subsystem                                        |
| `<name>.schema.ts`  | Zod validation schema for one domain                                          |
| `<name>.data.ts`    | Static data arrays/objects — no logic                                         |
| `styles.ts`         | `cn()` class string constants for one component                               |
| `index.ts` barrel   | Re-exports only — zero logic                                                  |

### 4.2 100-Line Limit Extraction Strategy

When a file approaches 100 lines, apply these extractions in order:

1. Extract inner components to their own file in the same folder
2. Extract conditional or async logic to a `use<Name>.ts` hook
3. Extract data-transform logic to `<name>.utils.ts`
4. Extract repeated sub-structures to a shared component
5. Split large type files into domain-scoped type files
6. Move static data arrays to `<name>.data.ts`

**Do not compress code to fit the limit.** The limit forces decomposition, not minification.

### 4.3 DRY Resolution Matrix

| Duplication                                        | Resolution                            |
| -------------------------------------------------- | ------------------------------------- |
| JSX structure used more than once                  | Extract to a component                |
| Calculation / transformation used more than once   | Extract to a util function            |
| `useEffect` / `useState` pattern in two components | Extract to a custom hook              |
| String constants used in multiple files            | Extract to `constants/`               |
| API call made in more than one place               | Move to a service file in `lib/api/`  |
| Tailwind class strings used across files           | Extract to a `styles.ts` using `cn()` |

### 4.4 Configuration-Driven Rendering

```tsx
// ❌ FORBIDDEN — inline conditional rendering
{
  role === "admin" && <AdminNav />;
}
{
  role === "user" && <UserNav />;
}
{
  role === "guest" && <GuestNav />;
}

// ✅ CORRECT — config-driven
const navByRole: Record<Role, React.ComponentType> = {
  admin: AdminNav,
  user: UserNav,
  guest: GuestNav,
} as const;

const Nav = navByRole[role];
return <Nav />;
```

Apply this pattern to: nav links, route guards, status badges, form fields, tab items, table columns, feature flags, error messages.

### 4.5 Component Anatomy Structure

```tsx
// 1. "use client" directive (if needed — top of file)
"use client";

// 2. External imports (react, libraries)
import { useState } from 'react';

// 3. Internal imports — ui/ primitives, hooks, utils, types
import { Button } from '@/components/ui/button';
import { useMyHook } from './useMyHook';
import type { MyComponentProps } from './types';

// 4. Types / interfaces (if not in a separate types.ts)
interface MyComponentProps { ... }

// 5. Component — named export preferred
export const MyComponent = ({ prop }: MyComponentProps) => {
  // hooks first
  const [state, setState] = useState();

  // derived values / handlers
  const handleClick = () => { ... };

  // early returns for loading/error/empty
  if (loading) return <Spinner />;

  return ( /* JSX using only ui/ primitives or composed components */ );
};
```

### 4.6 Hooks Anatomy Structure

```ts
// use<Name>.ts — single responsibility stated in first line comment
// Responsibility: manage <one specific concern>

import { useState, useCallback } from "react";

export const useMyHook = (input: InputType) => {
  const [state, setState] = useState<StateType>(initial);

  const handleSomething = useCallback(() => {
    // logic
  }, [deps]);

  return { state, handleSomething } as const;
};
```

---

## 5. System Documentation Index (`docs/`)

| Documentation Layer     | Location                                     | Key Documents                                                                                                                        |
| :---------------------- | :------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Product & Scope**     | Root                                         | [PRD](PRD.md), [README](README.md), [CLAUDE](CLAUDE.md)                                                                              |
| **Architecture**        | [`docs/`](docs/)                             | [API Spec](docs/API_SPEC.md), [Database Schema](docs/DATABASE_SCHEMA.md), [ABDM Integration Status](docs/PHASE5_ABDM_INTEGRATION.md) |
| **Database**            | [`backend/migrations/`](backend/migrations/) | Numbered SQL migrations (0001–0015), applied sequentially                                                                            |
| **Frontend Completion** | Root                                         | [Frontend Complete](FRONTEND_COMPLETE.md)                                                                                            |

---

## 6. Key System Components Inventory

### Backend Structure (`backend/src/`)

```
backend/src/
  server.js                 Entry point (starts Express server)
  app.js                    Mounts all routers
  config/
    supabase.js             Admin client + per-request user-scoped client factory
  middleware/
    auth.js                 Verifies JWT, attaches req.userId / req.supabase
    requireHospitalPermission.js   Wraps AuthorizationService.assert()
    errorHandler.js         Global error handler
  services/
    AuthorizationService.js RBAC resolution (rbac_effective_hospital_permission)
    AbdmClient.js           Phase 5 scaffold — not sandbox-verified
  routes/                   One file per API section (see docs/API_SPEC.md)
    hospitals.js
    patients.js
    appointments.js
    encounters.js
    lab.js
    ipd.js
    pharmacy.js
    billing.js
    insurance.js
    shifts.js
    reports.js
    staff.js
    abdm.js               Staff-facing ABDM routes (normal auth)
    abdmCallbacks.js       Inbound ABDM callbacks (NO auth — see header)
  utils/
    respond.js              Response envelope helper
```

### Frontend Structure (`frontend/src/`)

```
frontend/src/
  main.tsx                  Entry point (React + React Router)
  App.tsx                   Root component with routing
  components/
    ui/                     ✅ RAW HTML LIVES HERE AND ONLY HERE
      button.tsx            wraps <button>
      Input.tsx             wraps <input>
      Select.tsx            wraps <select>
      <Primitive>.tsx       one raw element per file
    common/                 Reusable cross-feature components (NO raw HTML)
      ErrorBoundary.tsx     THE ONLY CLASS COMPONENT IN THE CODEBASE
      ConfirmDialog.tsx     Reusable confirmation dialogs
  pages/                    Page components (one per route)
    auth/                   Login, signup
    dashboard/              Admin dashboard
    patients/               Patient management
      components/           Page-local components (never shared)
      hooks/                Page-local hooks
      PatientsPage.tsx      Imports from components/ — no JSX logic
    appointments/           Appointment booking
    staff/                  Staff management
    billing/                Billing & invoices
    pharmacy/               Pharmacy inventory
    lab/                    Lab orders & results
    ipd/                    IPD beds & admissions
  contexts/                 React contexts
    AuthContext.tsx         Auth state management
    HospitalContext.tsx     Current hospital selection
  lib/
    api.ts                  API client (REST calls to backend)
    supabase.ts             Supabase client (auth only, NO direct queries)
    hooks/                  Global custom hooks
    utils/                  Global pure utility functions
    validation/             Zod schemas — one file per domain
```

### Database Structure (41 tables across 10 domains)

See `docs/DATABASE_SCHEMA.md` for full schema. Key domains:

- **Foundation**: `hospitals`, `roles`, `permissions`, `role_permissions`, `memberships`
- **Clinical**: `patients`, `patient_registrations`, `doctors`, `appointments`, `encounters`, `prescriptions`
- **Lab**: `lab_orders`, `lab_results`
- **IPD**: `beds`, `admissions`
- **Pharmacy**: `inventory_items`, `stock_transactions`, `inventory_current_stock` (view)
- **Billing**: `invoices`, `invoice_line_items`, `payments`, `invoice_balance` (view)
- **Insurance**: `insurance_policies`, `insurance_claims`
- **Operations**: `staff_shifts`, `bed_occupancy_summary` (view), `daily_revenue_summary` (view), `low_stock_alert` (view)
- **ABDM** (Phase 5 scaffold): `abdm_link_requests`, `abdm_consent_artifacts`, `abdm_callback_log`

### RBAC Structure (9 roles, 33 permissions)

See `backend/migrations/0008_seed_roles_and_permissions.sql` for full matrix.

| Role          | Scope    | Permission Count | Key Capabilities                                                       |
| ------------- | -------- | ---------------- | ---------------------------------------------------------------------- |
| SuperAdmin    | Platform | 2                | Cross-hospital oversight (not yet enforced)                            |
| Support       | Platform | 1                | Read-only support access (not yet enforced)                            |
| HospitalAdmin | Hospital | 28               | Full operational control (reads everything, writes operational tables) |
| Doctor        | Hospital | 17               | Clinical documentation, prescriptions, lab orders                      |
| Nurse         | Hospital | 14               | Ward care, vitals, admissions                                          |
| Receptionist  | Hospital | 12               | Patient registration, appointments, OPD billing, ABHA verification     |
| BillingClerk  | Hospital | 8                | Invoicing, payments, insurance claims                                  |
| LabTech       | Hospital | 7                | Lab orders & results                                                   |
| Pharmacist    | Hospital | 5                | Inventory, dispensing                                                  |

---

## 7. Known Gaps (Flag These — Don't Silently Patch)

**Database/RLS:**

- `patient_registrations`, `doctor_profiles`, `departments` only have SELECT RLS policies (POST/PATCH routes will fail against RLS)
- No DB-level overlap prevention on `staff_shifts`
- `SuperAdmin`/`Support` have no actual cross-hospital enforcement mechanism

**API Layer:**

- No `/api/v1` prefix (routes mounted at root)
- No pagination on list endpoints (return all matching rows)
- Two-insert flows (patient+registration, prescription+items, invoice+line items) aren't transactional
- No automated tests
- No CI/CD pipeline

**ABDM Integration (Phase 5):**

- **AbdmClient.js is a scaffold, not working code** — no real ABDM sandbox credentials, no FHIR bundle construction
- **abdmCallbacks.js doesn't verify ABDM's callback signature** — a real security gap if pointed at live sandbox
- See `docs/PHASE5_ABDM_INTEGRATION.md` for full detail on what's real vs. placeholder

**Frontend:**

- Frontend is complete and functional (see `FRONTEND_COMPLETE.md`)
- Integration testing between frontend and backend not yet automated

**Operations:**

- GST invoice numbering is an application-layer decision not yet implemented
- No deployment configuration or hosting setup
- No monitoring/alerting infrastructure

**Full detail:** `README.md`'s "Known gaps" section and `docs/PHASE5_ABDM_INTEGRATION.md`.

---

## 8. Tech Stack & Dependencies

### Backend

- **Runtime**: Node.js >= 18
- **Framework**: Express.js
- **Database**: PostgreSQL 15+ (via Supabase)
- **Auth**: Supabase Auth (JWT)
- **ORM**: Supabase JS client (no separate ORM)
- **ABDM**: Placeholder client (Phase 5 scaffold)

### Frontend

- **Runtime**: Node.js >= 18
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Routing**: React Router v6
- **State**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Auth**: Supabase Auth (client-side)

### Infrastructure

- **Database & Auth**: Supabase (hosted Postgres + Auth + RLS)
- **Hosting**: Not yet configured
- **CDN/Storage**: Supabase Storage (not yet used)

---

## 9. Common Development Tasks

### Adding a New API Endpoint

1. Check if permission exists in `backend/migrations/0008_seed_roles_and_permissions.sql` (or later seeds)
2. If not, create new migration to add permission and grant to relevant roles
3. Add route to appropriate file in `backend/src/routes/` (or create new file if new domain)
4. Add `requireHospitalPermission('domain.action')` middleware
5. Implement handler using `req.supabase` (user-scoped client)
6. Document in `docs/API_SPEC.md`
7. Update frontend `lib/api.ts` if needed

### Adding a New Database Table

1. Create new numbered migration in `backend/migrations/` (next sequential number)
2. Define table schema with appropriate columns
3. Add RLS policies (`ENABLE ROW LEVEL SECURITY`)
4. Create necessary indexes
5. If new permission needed, add to same migration or follow-up seed migration
6. Document in `docs/DATABASE_SCHEMA.md`

### Adding a New Frontend Page

1. Create page component in `frontend/src/pages/<domain>/`
2. Create page-local `components/` and `hooks/` folders if needed
3. Add route to `App.tsx`
4. Use existing API client methods from `lib/api.ts` (add new methods if needed)
5. Use `useQuery` / `useMutation` from React Query for data fetching
6. Respect `AuthContext` and `HospitalContext` for auth/hospital state
7. Use TypeScript interfaces for all data shapes
8. Never exceed 100 lines per file — extract early and often
9. Use only `components/ui/` primitives — no raw HTML

### Adding a New Component

1. Decide placement: `pages/<domain>/components/` (page-local) or `components/common/` (shared)
2. If it wraps raw HTML, it must go in `components/ui/`
3. Create component file following Component Anatomy pattern
4. Extract types to separate file if component approaches 100 lines
5. Extract repeated Tailwind strings to co-located `styles.ts`
6. If used more than once, move from page-local to shared

### Modifying RBAC

1. **Never edit existing migrations** — create new seed migration
2. Add permission to `permissions` table insert
3. Grant to relevant roles via `role_permissions` inserts
4. Update `backend/src/middleware/requireHospitalPermission.js` if new pattern needed
5. Document change in `README.md` role/permission count

---

## 10. Patterns to Never Break

1. **Migrations are sequential and immutable** — numbered 0001–0015 as of this writing
2. **Permission keys are `domain.action`** — no other format allowed
3. **Every hospital-scoped route has `requireHospitalPermission()` middleware** — except the three deliberate exceptions documented in their files
4. **Ledger tables are insert-only** — payments, stock, prescriptions, lab results
5. **Patients are hospital-agnostic** — no `hospital_id` on `patients` table
6. **No role inheritance** — grant permissions directly to roles
7. **ABDM is async** — calls return acknowledgment, real answer arrives via callback
8. **Frontend never calls `supabase.from()`** — all data via `api` client
9. **Backend uses per-request user-scoped client** — no admin client in controllers
10. **TypeScript strict mode always** — no `any` without explicit reason
11. **Raw HTML only in `components/ui/`** — everywhere else composes
12. **No file exceeds 100 lines** — extract before completing
13. **Zero duplication** — extract on second occurrence
14. **One file, one responsibility** — stated in top comment
15. **Configuration over conditionals** — use config objects for variants

---

## 11. Running This Codebase

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm run dev     # Starts on PORT=3000 (or from .env)
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

### Migrations

Apply via Supabase CLI or Supabase Dashboard SQL Editor:

```bash
# Run migrations in order: 0001, 0002, ... 0015
# See backend/migrations/ for numbered files
```

### Demo Credentials

- Email: `admin@hospital.com`
- Password: `Admin@123456` (set during Supabase user creation)

---

## 12. Safety Map (What Changes Are Safe vs. Risky)

### ✅ Safe (Low Risk)

- Adding new API endpoints with proper auth middleware
- Adding new frontend pages/components
- Adding new migrations (never editing existing ones)
- Adding permissions via new seed migrations
- Modifying `.env.example` (never `.env` itself — that's local)
- Extracting repeated code into utils/hooks/components
- Creating new `<name>.data.ts` or `<name>.config.ts` files

### ⚠️ Medium Risk (Review Carefully)

- Modifying existing route handlers (could break clients)
- Modifying RLS policies (could expose data)
- Modifying AuthorizationService logic (could bypass RBAC)
- Adding new role inheritance (contradicts Rule 5)
- Refactoring files over 100 lines (ensure no logic changes)

### 🚨 High Risk (Requires Explicit Approval)

- Editing past migrations (breaks reproducibility)
- Adding UPDATE/DELETE to ledger tables (breaks audit trail)
- Adding `hospital_id` to `patients` table (breaks hospital-agnostic design)
- Bypassing `requireHospitalPermission()` middleware (security gap)
- Using admin client in route controllers (bypasses RLS)
- Making `supabase.from()` calls in frontend (bypasses API layer)
- Adding raw HTML outside `components/ui/` (breaks encapsulation)
- Creating files over 100 lines (breaks maintainability)
- Duplicating code instead of extracting (breaks DRY)

---

## 13. Antipattern Checklist — Refuse These Every Time

Before submitting any code, verify none of these exist:

- [ ] Raw HTML outside `components/ui/` or page layout shells
- [ ] The same JSX structure in more than one file
- [ ] `process.env.*` accessed outside validated env config
- [ ] A `.ts` or `.tsx` file over 100 lines
- [ ] A class-based component (except `ErrorBoundary.tsx`)
- [ ] `any` type anywhere
- [ ] Business logic inside an `app/api/` or `routes/` file
- [ ] A component that fetches its own data (no hook extracted)
- [ ] Two files containing the same utility function
- [ ] Inline conditional rendering where a config map would work
- [ ] A feature importing from another feature's internal files (not its barrel export)
- [ ] A prop named `handleX` in an interface (use `onX`; `handle` is internal)
- [ ] `// @ts-ignore` anywhere
- [ ] Hard-coded strings that belong in `configs/` or `constants/`
- [ ] Repeated Tailwind class strings (should be in `styles.ts`)
- [ ] Editing an existing migration file
- [ ] UPDATE or DELETE on ledger tables
- [ ] Direct Supabase calls in frontend
- [ ] Admin client usage in route handlers

---

## 14. Agent Execution Checklist

### Before proposing changes:

- [ ] Have you read the relevant section of `docs/API_SPEC.md` or `docs/DATABASE_SCHEMA.md`?
- [ ] Have you confirmed the change doesn't edit a past migration?
- [ ] Have you confirmed the change doesn't modify a ledger table's update/delete behavior?
- [ ] Have you confirmed proper `requireHospitalPermission()` middleware usage?
- [ ] Have you stated your assumptions explicitly?
- [ ] Have you identified all files that will be created/modified?
- [ ] Have you confirmed no file will exceed 100 lines?
- [ ] Have you identified any code duplication that needs extraction?

### After implementing:

- [ ] Did you run TypeScript typecheck?
- [ ] Did you verify the specific feature works?
- [ ] Did you document any new patterns introduced?
- [ ] Did you update `docs/API_SPEC.md` or `docs/DATABASE_SCHEMA.md` if schema/API changed?
- [ ] Are all files under 100 lines?
- [ ] Is there zero code duplication?
- [ ] Does each file have a single clear responsibility?
- [ ] Are all configuration objects extracted (no inline conditionals)?
- [ ] Is raw HTML only in `components/ui/`?

---

## 15. Quick Reference: What Goes Where

| What you want to add               | Where it goes                                             |
| ---------------------------------- | --------------------------------------------------------- |
| A new page                         | `frontend/src/pages/<domain>/PageName.tsx`                |
| A page-only component              | `frontend/src/pages/<domain>/components/<Name>.tsx`       |
| A page-only hook                   | `frontend/src/pages/<domain>/hooks/use<Name>.ts`          |
| A shared UI primitive (raw HTML)   | `frontend/src/components/ui/<Name>.tsx`                   |
| A shared composition (no raw HTML) | `frontend/src/components/common/<Name>.tsx`               |
| A hook used across multiple pages  | `frontend/src/lib/hooks/use<Name>.ts`                     |
| A context for global state         | `frontend/src/contexts/<Domain>Context.tsx`               |
| A backend service                  | `backend/src/services/<Name>Service.js`                   |
| An API route                       | `backend/src/routes/<resource>.js`                        |
| A Zod schema                       | `frontend/src/lib/validation/<domain>.schema.ts`          |
| A static data array                | Co-located `<name>.data.ts` or `constants/`               |
| A Tailwind class string            | Co-located `styles.ts` using `cn()`                       |
| A configuration object             | Co-located `<name>.config.ts` or top-level `configs/`     |
| A global constant                  | `frontend/src/constants/<domain>.ts`                      |
| A database migration               | `backend/migrations/00XX_description.sql` (next number)   |
| A utility function                 | `frontend/src/lib/utils/<name>.ts` (shared) or co-located |

---

## Final Notes

**What's Genuinely Not Built Yet:**

- Frontend is complete and functional (see `FRONTEND_COMPLETE.md`)
- Automated tests (backend and frontend)
- CI/CD pipeline
- Deployment configuration
- Verified/working ABDM integration (schema exists, sandbox connection doesn't)
- Production-grade monitoring/alerting

If asked to "build the UI" — **it already exists**. If asked to "make ABDM work" — there's no existing pattern in this repo; say so rather than assuming one.

**When In Doubt:**

1. Read this `AGENTS.md` file completely before starting
2. Read `CLAUDE.md` for coding assistant conventions
3. Read `PRD.md` for product context
4. Read `README.md` for implementation status
5. Read `docs/` for detailed specifications
6. Ask for clarification rather than guessing
7. Surface ambiguity and tradeoffs explicitly
8. State your plan before implementing

**Remember:** These rules exist to maintain code quality, security, and maintainability in a healthcare compliance context. Every rule has a reason. When you think a rule should be broken, **ask first** — the answer might reveal why it exists.

---

_Last updated: 2026-09-27 — Read this file before writing any code._
