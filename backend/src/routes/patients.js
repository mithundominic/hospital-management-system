// src/routes/patients.js -- matches API_SPEC.md "### Patients"
//
// Patients are hospital-agnostic (see docs/DATABASE_SCHEMA.md), so "list
// patients at this hospital" is really "list patients with a registration at
// this hospital" -- the query below goes through patient_registrations
// accordingly, and POST creates both rows together in one flow, per the
// comment in migration 0009_patch_patients_rls.sql.

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData, sendError } = require('../utils/respond');

const router = express.Router();

router.get(
  '/hospitals/:hospitalId/patients',
  requireHospitalPermission('patients.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('patient_registrations')
        .select('hospital_patient_number, registered_at, patients(*)')
        .eq('hospital_id', req.params.hospitalId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/hospitals/:hospitalId/patients/:patientId',
  requireHospitalPermission('patients.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('patients')
        .select('*, patient_registrations(*)')
        .eq('id', req.params.patientId)
        .single();
      if (error) return sendError(res, 404, 'NOT_FOUND', 'Patient not found or not visible to you');
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

// Two inserts, one request: the core patient identity, then the
// hospital-specific registration linking them here. If the second insert
// fails, the patient row is left orphaned (no registration) rather than
// rolled back -- Supabase's JS client doesn't span a transaction across two
// .insert() calls. Worth moving into a single Postgres function
// (supabase.rpc(...)) once this matters in practice.
router.post(
  '/hospitals/:hospitalId/patients',
  requireHospitalPermission('patients.write'),
  async (req, res, next) => {
    try {
      const { full_name, dob, gender, phone, email, blood_group, hospital_patient_number } = req.body;

      const { data: patient, error: patientError } = await req.supabase
        .from('patients')
        .insert({ full_name, dob, gender, phone, email, blood_group })
        .select()
        .single();
      if (patientError) throw patientError;

      const { data: registration, error: regError } = await req.supabase
        .from('patient_registrations')
        .insert({
          patient_id: patient.id,
          hospital_id: req.params.hospitalId,
          hospital_patient_number,
        })
        .select()
        .single();
      if (regError) throw regError;

      sendData(res, { ...patient, registration }, 201);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/hospitals/:hospitalId/patients/:patientId',
  requireHospitalPermission('patients.write'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('patients')
        .update(req.body)
        .eq('id', req.params.patientId)
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
