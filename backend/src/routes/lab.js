// src/routes/lab.js -- matches API_SPEC.md "### Lab"

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData } = require('../utils/respond');

const router = express.Router();

router.get(
  '/hospitals/:hospitalId/lab-orders',
  requireHospitalPermission('lab_orders.read'),
  async (req, res, next) => {
    try {
      let query = req.supabase
        .from('lab_orders')
        .select('*, lab_results(*)')
        .eq('hospital_id', req.params.hospitalId);
      if (req.query.status) query = query.eq('status', req.query.status);
      const { data, error } = await query.order('ordered_at', { ascending: false });
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/hospitals/:hospitalId/lab-orders',
  requireHospitalPermission('lab_orders.write'),
  async (req, res, next) => {
    try {
      const { encounter_id, ordered_by, test_name } = req.body;
      const { data, error } = await req.supabase
        .from('lab_orders')
        .insert({ hospital_id: req.params.hospitalId, encounter_id, ordered_by, test_name })
        .select()
        .single();
      if (error) throw error;
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
);

// Status transitions: { status: 'sample_collected' | 'in_progress' | 'completed' | 'cancelled' }.
router.patch(
  '/hospitals/:hospitalId/lab-orders/:orderId',
  requireHospitalPermission('lab_orders.write'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('lab_orders')
        .update(req.body)
        .eq('id', req.params.orderId)
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

// Insert-only, same reasoning as prescriptions -- a correction is a new
// verified result row, not an edit to one a doctor may have already acted on.
router.post(
  '/hospitals/:hospitalId/lab-orders/:orderId/results',
  requireHospitalPermission('lab_results.write'),
  async (req, res, next) => {
    try {
      const { result_value, unit, reference_range, is_abnormal, verified_by, notes } = req.body;
      const { data, error } = await req.supabase
        .from('lab_results')
        .insert({
          lab_order_id: req.params.orderId,
          result_value,
          unit,
          reference_range,
          is_abnormal,
          verified_by,
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

module.exports = router;
