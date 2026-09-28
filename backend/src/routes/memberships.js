// src/routes/memberships.js -- matches API_SPEC.md "### Staff & memberships"

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData } = require('../utils/respond');

const router = express.Router();

router.get(
  '/hospitals/:hospitalId/memberships',
  requireHospitalPermission('memberships.manage'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('memberships')
        .select('*, roles(name)')
        .eq('hospital_id', req.params.hospitalId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

// Invite staff / assign a role. Expects { user_id, role_id } in the body --
// the invited user must already exist in Supabase Auth (sign-up flow is
// separate from this endpoint).
router.post(
  '/hospitals/:hospitalId/memberships',
  requireHospitalPermission('memberships.manage'),
  async (req, res, next) => {
    try {
      const { user_id, role_id } = req.body;
      const { data, error } = await req.supabase
        .from('memberships')
        .insert({
          user_id,
          role_id,
          hospital_id: req.params.hospitalId,
          status: 'invited',
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

// Change role or status (e.g. accept an invite -> 'active', or 'suspended').
router.patch(
  '/hospitals/:hospitalId/memberships/:membershipId',
  requireHospitalPermission('memberships.manage'),
  async (req, res, next) => {
    try {
      const { role_id, status } = req.body;
      const { data, error } = await req.supabase
        .from('memberships')
        .update({ ...(role_id && { role_id }), ...(status && { status }) })
        .eq('id', req.params.membershipId)
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
