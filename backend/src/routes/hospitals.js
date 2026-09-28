// src/routes/hospitals.js -- matches API_SPEC.md "### Hospitals"

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData, sendError } = require('../utils/respond');

const router = express.Router();

// GET /hospitals -- hospitals the caller has an active membership at.
// Membership itself is the gate; no specific permission key needed.
router.get('/hospitals', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('hospitals')
      .select('*, memberships!inner(user_id, status)')
      .eq('memberships.user_id', req.userId)
      .eq('memberships.status', 'active');
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
});

router.get('/hospitals/:hospitalId', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('hospitals')
      .select('*')
      .eq('id', req.params.hospitalId)
      .single();
    if (error) return sendError(res, 404, 'NOT_FOUND', 'Hospital not found or not visible to you');
    sendData(res, data);
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/hospitals/:hospitalId',
  requireHospitalPermission('hospital.manage'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('hospitals')
        .update(req.body)
        .eq('id', req.params.hospitalId)
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
