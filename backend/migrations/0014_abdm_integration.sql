-- 0014_abdm_integration.sql
-- Phase 5 scaffold: internal tracking for ABDM's async request/callback flow.
-- See docs/PHASE5_ABDM_INTEGRATION.md before touching this -- in particular,
-- nothing here has been run against a real ABDM sandbox.

-- Complements patients.abha_id (added in 0002) with the human-readable
-- address form ABDM also uses (e.g. 'jane.doe@abdm'), and a verification flag.
alter table patients add column if not exists abha_address text;
alter table patients add column if not exists abha_verified boolean not null default false;

-- M1/M2: tracks an ABHA verification or care-context linking request from
-- initiation through ABDM's async callback resolving it.
create table abdm_link_requests (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    patient_id uuid not null references patients(id) on delete cascade,
    link_type text not null,   -- 'abha_verification' (M1) | 'care_context' (M2)
    abdm_request_id text,      -- the transaction/request id ABDM returns on the initial 202
    status text not null default 'initiated',  -- initiated | otp_sent | confirmed | failed | expired
    initiated_at timestamptz not null default now(),
    resolved_at timestamptz
);

create index idx_abdm_link_requests_hospital on abdm_link_requests(hospital_id);
create index idx_abdm_link_requests_patient on abdm_link_requests(patient_id);
create index idx_abdm_link_requests_abdm_request_id on abdm_link_requests(abdm_request_id);

-- M3: tracks a consent request this hospital (as HIU) sent to a patient's
-- Consent Manager, from request through grant/denial and, once granted,
-- through the actual data fetch.
create table abdm_consent_artifacts (
    id uuid primary key default gen_random_uuid(),
    hospital_id uuid not null references hospitals(id) on delete cascade,
    patient_id uuid not null references patients(id) on delete cascade,
    purpose text not null,             -- why the record is being requested, shown to the patient
    hiu_id text,                       -- this hospital's own HIU id, once registered
    consent_request_id text,           -- ABDM's id for the request
    artifact_id text,                  -- ABDM's id for the granted consent artifact, once approved
    status text not null default 'requested',  -- requested | granted | denied | expired | revoked
    requested_at timestamptz not null default now(),
    resolved_at timestamptz
);

create index idx_abdm_consent_artifacts_hospital on abdm_consent_artifacts(hospital_id);
create index idx_abdm_consent_artifacts_patient on abdm_consent_artifacts(patient_id);

-- Raw audit log of every inbound callback ABDM's gateway sends -- valuable
-- for debugging a protocol this system doesn't fully control the shape of,
-- and for replaying a callback if the row it should have updated is unclear.
create table abdm_callback_log (
    id uuid primary key default gen_random_uuid(),
    callback_type text not null,   -- e.g. 'on-init', 'on-confirm', 'consents/hiu/on-notify'
    abdm_request_id text,
    payload jsonb not null,
    received_at timestamptz not null default now()
);

create index idx_abdm_callback_log_request_id on abdm_callback_log(abdm_request_id);

alter table abdm_link_requests enable row level security;
alter table abdm_consent_artifacts enable row level security;
-- abdm_callback_log deliberately has no RLS / route exposure -- it's written
-- only by the callback handler (service-role) and isn't meant to be queried
-- by hospital staff directly; a real admin tool would read it via the
-- service role, not through a client-scoped API route.

create policy abdm_link_requests_select on abdm_link_requests
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'abdm.read'));

create policy abdm_link_requests_insert on abdm_link_requests
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'abdm.write'));

create policy abdm_consent_artifacts_select on abdm_consent_artifacts
    for select using (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'abdm.read'));

create policy abdm_consent_artifacts_insert on abdm_consent_artifacts
    for insert with check (rbac_effective_hospital_permission(auth.uid(), hospital_id, 'abdm.write'));
