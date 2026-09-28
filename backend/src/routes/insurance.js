// src/routes/insurance.js -- matches API_SPEC.md "### Insurance"
//
// insurance_policies is the odd one out here: it's nested under /patients,
// not /hospitals (policies are patient-owned -- see docs/DATABASE_SCHEMA.md),
// and a patient can be registered at more than one hospital, so there's no
// single :hospitalId to run requireHospitalPermission against up front. RLS
// (migration 0010) is the actual gate for these two routes -- it checks
// insurance_claims.read/write against whichever hospital(s) the patient is
// registered at. That's different from every other file in this folder,
// where the app-layer check runs first and RLS is the second, independent
// layer -- here RLS is doing the only enforcement. Worth knowing before
// copying this file's pattern elsewhere.

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData, sendError } = require('../utils/respond');

const router = express.Router();

router.get('/patients/:patientId/insurance-policies', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('insurance_policies')
      .select('*')
      .eq('patient_id', req.params.patientId);
    if (error) throw error;
    // An empty array here is ambiguous -- genuinely no policies on file, or
    // the caller lacks insurance_claims.read at every hospital this patient
    // is registered at (RLS silently filters to nothing either way). Worth
    // resolving if that distinction ends up mattering to the UI.
    sendData(res, data);
  } catch (err) {
    next(err);
  }
});

router.post('/patients/:patientId/insurance-policies', async (req, res, next) => {
  try {
    const { provider_name, tpa_name, policy_number, valid_from, valid_to, coverage_details } = req.body;
    const { data, error } = await req.supabase
      .from('insurance_policies')
      .insert({
        patient_id: req.params.patientId,
        provider_name,
        tpa_name,
        policy_number,
        valid_from,
        valid_to,
        coverage_details,
      })
      .select()
      .single();
    if (error) return sendError(res, 403, 'FORBIDDEN', error.message);
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
});

// Hospital-nested from here down -- back to the usual requireHospitalPermission pattern.

router.get(
  '/hospitals/:hospitalId/insurance-claims',
  requireHospitalPermission('insurance_claims.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('insurance_claims')
        .select('*')
        .eq('hospital_id', req.params.hospitalId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/hospitals/:hospitalId/insurance-claims',
  requireHospitalPermission('insurance_claims.write'),
  async (req, res, next) => {
    try {
      const { invoice_id, insurance_policy_id, claim_type, claimed_amount, handled_by } = req.body;
      const { data, error } = await req.supabase
        .from('insurance_claims')
        .insert({
          hospital_id: req.params.hospitalId,
          invoice_id,
          insurance_policy_id,
          claim_type,
          claimed_amount,
          handled_by,
        })
        .select()
        .single();
      if (error) throw error;
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
);

// Status through its lifecycle: submitted -> pre_authorized/approved/rejected -> settled.
router.patch(
  '/hospitals/:hospitalId/insurance-claims/:claimId',
  requireHospitalPermission('insurance_claims.write'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('insurance_claims')
        .update(req.body)
        .eq('id', req.params.claimId)
        .eq('hospital_id', req.params.hospitalId)
        .select()
        .single();
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
