// src/routes/ipd.js -- matches API_SPEC.md "### IPD — beds & admissions"

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData, sendError } = require('../utils/respond');

const router = express.Router();

router.get(
  '/hospitals/:hospitalId/beds',
  requireHospitalPermission('beds.read'),
  async (req, res, next) => {
    try {
      let query = req.supabase.from('beds').select('*').eq('hospital_id', req.params.hospitalId);
      if (req.query.status) query = query.eq('status', req.query.status);
      const { data, error } = await query;
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/hospitals/:hospitalId/beds',
  requireHospitalPermission('beds.write'),
  async (req, res, next) => {
    try {
      const { department_id, bed_number, ward } = req.body;
      const { data, error } = await req.supabase
        .from('beds')
        .insert({ hospital_id: req.params.hospitalId, department_id, bed_number, ward })
        .select()
        .single();
      if (error) throw error;
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/hospitals/:hospitalId/beds/:bedId',
  requireHospitalPermission('beds.write'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('beds')
        .update(req.body)
        .eq('id', req.params.bedId)
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

router.get(
  '/hospitals/:hospitalId/admissions',
  requireHospitalPermission('admissions.read'),
  async (req, res, next) => {
    try {
      let query = req.supabase.from('admissions').select('*').eq('hospital_id', req.params.hospitalId);
      if (req.query.status) query = query.eq('status', req.query.status);
      const { data, error } = await query;
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

// The one-active-admission-per-bed rule is enforced by a partial unique
// index in the database (migration 0006) -- if this insert violates it,
// Supabase returns a Postgres error which falls through to the generic
// error handler as a 500. Worth mapping that specific constraint violation
// to a friendlier 409 once this is real.
router.post(
  '/hospitals/:hospitalId/admissions',
  requireHospitalPermission('admissions.write'),
  async (req, res, next) => {
    try {
      const { encounter_id, patient_id, bed_id, admitting_doctor_membership_id } = req.body;
      const { data, error } = await req.supabase
        .from('admissions')
        .insert({
          hospital_id: req.params.hospitalId,
          encounter_id,
          patient_id,
          bed_id,
          admitting_doctor_membership_id,
        })
        .select()
        .single();
      if (error) return sendError(res, 409, 'CONFLICT', error.message);
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
);

// Discharge/transfer: { status: 'discharged', discharged_at, discharge_summary } or { status: 'transferred', bed_id }.
router.patch(
  '/hospitals/:hospitalId/admissions/:admId',
  requireHospitalPermission('admissions.write'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('admissions')
        .update(req.body)
        .eq('id', req.params.admId)
        .eq('hospital_id', req.params.hospitalId)
        .select()
        .single();
      if (error) return sendError(res, 409, 'CONFLICT', error.message);
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
