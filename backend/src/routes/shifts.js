// src/routes/shifts.js -- matches API_SPEC.md "### Staff shifts"

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData } = require('../utils/respond');

const router = express.Router();

// Supports ?date=YYYY-MM-DD, ?membership_id= as optional filters.
router.get(
  '/hospitals/:hospitalId/shifts',
  requireHospitalPermission('shifts.read'),
  async (req, res, next) => {
    try {
      let query = req.supabase.from('staff_shifts').select('*').eq('hospital_id', req.params.hospitalId);
      if (req.query.date) query = query.eq('shift_date', req.query.date);
      if (req.query.membership_id) query = query.eq('membership_id', req.query.membership_id);
      const { data, error } = await query.order('shift_date', { ascending: true });
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

// HospitalAdmin-only, per the seed in migration 0013 -- shifts.write isn't
// granted to any other role.
router.post(
  '/hospitals/:hospitalId/shifts',
  requireHospitalPermission('shifts.write'),
  async (req, res, next) => {
    try {
      const { membership_id, department_id, shift_date, start_time, end_time, notes } = req.body;
      const { data, error } = await req.supabase
        .from('staff_shifts')
        .insert({
          hospital_id: req.params.hospitalId,
          membership_id,
          department_id,
          shift_date,
          start_time,
          end_time,
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

router.patch(
  '/hospitals/:hospitalId/shifts/:shiftId',
  requireHospitalPermission('shifts.write'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('staff_shifts')
        .update(req.body)
        .eq('id', req.params.shiftId)
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
