// src/routes/abdm.js -- SCAFFOLD, see docs/PHASE5_ABDM_INTEGRATION.md
//
// The staff-facing side: these follow the same requireHospitalPermission +
// req.supabase shape as every other route file. They kick off an ABDM flow
// and record a pending row; the actual result lands later via
// routes/abdmCallbacks.js, not in this request's response.

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { AbdmClient } = require('../services/AbdmClient');
const { sendData } = require('../utils/respond');

const router = express.Router();
const abdmClient = new AbdmClient();

router.get(
  '/hospitals/:hospitalId/patients/:patientId/abdm/link-requests',
  requireHospitalPermission('abdm.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('abdm_link_requests')
        .select('*')
        .eq('hospital_id', req.params.hospitalId)
        .eq('patient_id', req.params.patientId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

// M1: starts ABHA verification. Body: { abha_address }.
router.post(
  '/hospitals/:hospitalId/patients/:patientId/abdm/verify',
  requireHospitalPermission('abdm.write'),
  async (req, res, next) => {
    try {
      const { abha_address } = req.body;

      const { data: linkRequest, error } = await req.supabase
        .from('abdm_link_requests')
        .insert({
          hospital_id: req.params.hospitalId,
          patient_id: req.params.patientId,
          link_type: 'abha_verification',
          status: 'initiated',
        })
        .select()
        .single();
      if (error) throw error;

      const abdmResponse = await abdmClient.initiateAbhaVerification({
        abhaAddress: abha_address,
        hospitalId: req.params.hospitalId,
        patientId: req.params.patientId,
      });

      // Store whatever transaction id ABDM returned so the callback can find
      // this row again -- field name is a placeholder, see AbdmClient.js.
      await req.supabase
        .from('abdm_link_requests')
        .update({ abdm_request_id: abdmResponse.transactionId })
        .eq('id', linkRequest.id);

      sendData(res, { ...linkRequest, abdm_request_id: abdmResponse.transactionId }, 202);
    } catch (err) {
      next(err);
    }
  }
);

// M1: submits the OTP the patient received. Body: { transaction_id, otp }.
router.post(
  '/hospitals/:hospitalId/patients/:patientId/abdm/confirm',
  requireHospitalPermission('abdm.write'),
  async (req, res, next) => {
    try {
      const { transaction_id, otp } = req.body;
      await abdmClient.confirmAbhaLink({ transactionId: transaction_id, otp });
      // Status update happens in the callback handler (on-confirm), not here
      // -- this endpoint's job is only to submit the OTP.
      sendData(res, { submitted: true }, 202);
    } catch (err) {
      next(err);
    }
  }
);

// M3: this hospital, acting as HIU, requests consent to view a patient's
// records held elsewhere. Body: { abha_address, purpose }.
router.post(
  '/hospitals/:hospitalId/patients/:patientId/abdm/consent-requests',
  requireHospitalPermission('abdm.write'),
  async (req, res, next) => {
    try {
      const { abha_address, purpose } = req.body;

      const { data: artifact, error } = await req.supabase
        .from('abdm_consent_artifacts')
        .insert({
          hospital_id: req.params.hospitalId,
          patient_id: req.params.patientId,
          purpose,
          status: 'requested',
        })
        .select()
        .single();
      if (error) throw error;

      const abdmResponse = await abdmClient.requestConsent({
        abhaAddress: abha_address,
        purpose,
        hospitalId: req.params.hospitalId,
      });

      await req.supabase
        .from('abdm_consent_artifacts')
        .update({ consent_request_id: abdmResponse?.consentRequest?.id })
        .eq('id', artifact.id);

      sendData(res, artifact, 202);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
