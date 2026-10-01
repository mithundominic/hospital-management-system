-- 0026_add_hiu_public_key_to_consent_artifacts.sql
-- Add HIU public key storage for FHIR bundle encryption in HIP data push flow

-- When acting as HIP (Health Information Provider), we receive the HIU's
-- (Health Information User) public key in the /health-information/hip/request
-- callback. Store it so FhirEncryptionService can encrypt the FHIR bundle.
alter table abdm_consent_artifacts 
  add column if not exists hiu_public_key text;

comment on column abdm_consent_artifacts.hiu_public_key is 
  'HIU public key (base64-encoded X25519) for FHIR bundle encryption when acting as HIP';
