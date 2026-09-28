// src/routes/abdmCallbacks.js -- SCAFFOLD, see docs/PHASE5_ABDM_INTEGRATION.md
//
// These receive ABDM's async callbacks (the "on-*" side of every AbdmClient
// call). Two things make this file different from every other route file in
// this folder:
//
// 1. No requireHospitalPermission, no req.supabase. The caller is ABDM's
//    gateway, not a logged-in staff member -- there's no user JWT to verify
//    with src/middleware/auth.js, which is why this router is mounted in
//    app.js BEFORE the global `app.use(auth)` line, the same way /health is.
//    Writes here go through the admin client, the one other deliberate
//    exception alongside AuthorizationService and auth.js's token check --
//    see src/config/supabase.js.
//
// 2. SECURITY GAP, not yet closed: ABDM signs its callbacks with a JWT that
//    should be verified against ABDM's public certs (the gateway exposes a
//    /v0.5/certs endpoint for this) before trusting the payload. That
//    verification is NOT implemented below. As written, anyone who can
//    reach these routes can post arbitrary data into abdm_link_requests /
//    abdm_consent_artifacts. Do not point a real ABDM sandbox at this
//    callback URL until that's fixed.

const express = require('express');
const { adminClient } = require('../config/supabase');

const router = express.Router();

async function logCallback(callback_type, body) {
  await adminClient.from('abdm_callback_log').insert({
    callback_type,
    abdm_request_id: body?.resp?.requestId || body?.requestId || null,
    payload: body,
  });
}

// M1: result of initiateAbhaVerification()
router.post('/abdm/callbacks/users/auth/on-init', async (req, res) => {
  await logCallback('users/auth/on-init', req.body);
  const transactionId = req.body?.transactionId;
  if (transactionId) {
    await adminClient
      .from('abdm_link_requests')
      .update({ abdm_request_id: transactionId, status: 'otp_sent' })
      .eq('abdm_request_id', transactionId);
  }
  res.status(202).json({ received: true });
});

// M1: result of confirmAbhaLink()
router.post('/abdm/callbacks/users/auth/on-confirm', async (req, res) => {
  await logCallback('users/auth/on-confirm', req.body);
  const transactionId = req.body?.transactionId;
  if (transactionId) {
    const succeeded = !req.body?.error;
    await adminClient
      .from('abdm_link_requests')
      .update({ status: succeeded ? 'confirmed' : 'failed', resolved_at: new Date().toISOString() })
      .eq('abdm_request_id', transactionId);
  }
  res.status(202).json({ received: true });
});

// M2: result of linkCareContext()
router.post('/abdm/callbacks/links/link/on-init', async (req, res) => {
  await logCallback('links/link/on-init', req.body);
  res.status(202).json({ received: true });
});

// M3: result of requestConsent()
router.post('/abdm/callbacks/consent-requests/on-init', async (req, res) => {
  await logCallback('consent-requests/on-init', req.body);
  const requestId = req.body?.consentRequest?.id;
  if (requestId) {
    await adminClient
      .from('abdm_consent_artifacts')
      .update({ consent_request_id: requestId })
      .eq('consent_request_id', requestId);
  }
  res.status(202).json({ received: true });
});

// M3: the patient actually granted/denied consent via their Consent Manager app
router.post('/abdm/callbacks/consents/hiu/notify', async (req, res) => {
  await logCallback('consents/hiu/notify', req.body);
  const artifactId = req.body?.notification?.consentArtefacts?.[0]?.id;
  const status = req.body?.notification?.status; // e.g. 'GRANTED' | 'DENIED'
  if (artifactId) {
    await adminClient
      .from('abdm_consent_artifacts')
      .update({
        artifact_id: artifactId,
        status: status === 'GRANTED' ? 'granted' : 'denied',
        resolved_at: new Date().toISOString(),
      })
      .eq('consent_request_id', req.body?.notification?.consentRequestId);
  }
  res.status(202).json({ received: true });
});

module.exports = router;
