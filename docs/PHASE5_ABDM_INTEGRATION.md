# Phase 5 — ABDM/ABHA Integration Plan

**Status: scaffolded, not connected to anything real.** This document, migration `0014`, and
`AbdmClient.js` establish the shape of the integration. None of it has been run against an
actual ABDM sandbox — that requires registering this project with the National Health
Authority and getting back real credentials, which is outside what building code in a
conversation can do. Endpoint paths below are drawn from ABDM's published gateway API
structure and are real; exact request/response payloads are not independently verified here
and need to be checked against the live sandbox API docs before any of this is called for
real.

## Why this matters (context for the decision to prioritize it)

As of 2026, ABDM participation has moved from optional to load-bearing for an Indian hospital
SaaS: NABH's 6th-edition accreditation standards (effective January 2025) score
ABDM/EMR integration, and HIP status is a prerequisite for empanelment under several state and
central insurance schemes (Ayushman Bharat, CGHS, ECHS). For hospitals that depend on scheme
patients — a meaningful share of the target market in `PRD.md` — this isn't a nice-to-have
integration, it's close to a distribution requirement.

## The three milestones

| Milestone | What it covers | What this scaffold does |
|---|---|---|
| **M1** | ABHA creation, verification, and obtaining a link token | `abdm_link_requests` table + `AbdmClient.initiateAbhaVerification()` / `confirmAbhaLink()` stubs |
| **M2** | Linking and exporting health data (care-context linking) | `AbdmClient.linkCareContext()` stub |
| **M3** | Sending a consent request and importing data from elsewhere in the network | `abdm_consent_artifacts` table + `AbdmClient.requestConsent()` / `fetchHealthInformation()` stubs |

## Two roles this system plays

- **HIP (Health Information Provider)** — this hospital *holds* records (encounters,
  prescriptions, lab results already in this schema) and serves them to the network when a
  patient consents.
- **HIU (Health Information User)** — this hospital *requests* a patient's records held
  elsewhere (another hospital's HIP) when a doctor here needs their history.

Both roles are real requirements for a hospital SaaS — a patient walking in with a referral
from another facility is exactly the HIU case.

## The architecture detail that changes how this gets built

ABDM's gateway is **not request/response**. A call like `/consent-requests/init` returns a
`202 Accepted` with a request ID; the actual result arrives later as a separate POST to a
callback URL *this system* has to host and register with ABDM (e.g. `.../on-init`,
`.../on-status`, `.../consents/hiu/on-notify`). This means Phase 5 needs two things Phases 1–4
didn't: a place to store pending requests so an incoming callback can be matched back to what
triggered it, and inbound routes to receive those callbacks. `abdm_consent_artifacts` /
`abdm_link_requests` are that pending-request store; `routes/abdmCallbacks.js` is the inbound
side.

## What's real vs. placeholder in this drop

**Real:**
- The milestone breakdown and HIP/HIU framing
- The async request → callback architecture, and building for it from the start
- Sandbox base URLs (`ABHA_URL`, `GATEWAY_URL`) and the endpoint paths referenced in
  `AbdmClient.js`'s comments — these come from ABDM's actual published API structure
- The schema for tracking consent artifacts and link requests, and the new `abdm.read` /
  `abdm.write` permissions

**Placeholder:**
- `AbdmClient.js`'s actual HTTP calls — structured correctly, but the exact request bodies,
  header names beyond the ones confirmed (`X-HIP-ID`, `X-HIU-ID`), and response shapes need
  verification against the current sandbox OpenAPI spec before this can run
- FHIR R4 bundle construction for M3 data sharing — not attempted here; this is its own
  substantial piece of work once M1/M2 are actually connected
- HFR (facility) and HPR (practitioner) registration flows — prerequisites to all of the
  above, not modeled in this schema at all yet

## Before any of this can go live

1. Register this project in the ABDM sandbox (product details, technical contact,
   organizational info) to get a real client ID/secret
2. Register the hospital in the Health Facility Registry (HFR) to get a facility ID
3. Register doctors in the Healthcare Professionals Registry (HPR)
4. Stand up a publicly reachable callback URL and register it as this HIP's `HIP_HOST`
5. Verify every endpoint and payload shape in `AbdmClient.js` against the live sandbox docs
   — treat nothing in this file as trustworthy until that's done
6. Work through sandbox certification for M1, then M2, then M3, in order — ABDM's own
   certification process is sequential, not parallel
