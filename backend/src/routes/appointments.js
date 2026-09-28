// src/routes/appointments.js -- matches API_SPEC.md "### Appointments"

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData } = require('../utils/respond');

const router = express.Router();

// Supports ?date=YYYY-MM-DD, ?doctor_membership_id=, ?patient_id= as optional filters.
router.get(
  '/hospitals/:hospitalId/appointments',
  requireHospitalPermission('appointments.read'),
  async (req, res, next) => {
    try {
      let query = req.supabase
        .from('appointments')
        .select('*')
        .eq('hospital_id', req.params.hospitalId);

      if (req.query.doctor_membership_id) {
        query = query.eq('doctor_membership_id', req.query.doctor_membership_id);
      }
      if (req.query.patient_id) {
        query = query.eq('patient_id', req.query.patient_id);
      }
      if (req.query.date) {
        const start = `${req.query.date}T00:00:00`;
        const end = `${req.query.date}T23:59:59`;
        query = query.gte('scheduled_at', start).lte('scheduled_at', end);
      }

      const { data, error } = await query.order('scheduled_at', { ascending: true });
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/hospitals/:hospitalId/appointments',
  requireHospitalPermission('appointments.write'),
  async (req, res, next) => {
    try {
      const { patient_id, doctor_membership_id, department_id, scheduled_at, notes } = req.body;
      const { data, error } = await req.supabase
        .from('appointments')
        .insert({
          hospital_id: req.params.hospitalId,
          patient_id,
          doctor_membership_id,
          department_id,
          scheduled_at,
          notes,
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

// Reschedule/cancel: pass { scheduled_at } and/or { status } in the body.
router.patch(
  '/hospitals/:hospitalId/appointments/:apptId',
  requireHospitalPermission('appointments.write'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('appointments')
        .update(req.body)
        .eq('id', req.params.apptId)
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
