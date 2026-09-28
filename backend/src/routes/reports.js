// src/routes/reports.js -- matches API_SPEC.md "### Reports"
//
// These three views (migration 0012) already check reports.read themselves,
// inside the view definition. requireHospitalPermission here is technically
// redundant with that -- kept anyway for a fast, friendly 403 instead of a
// query that silently returns zero rows, and for consistency with every
// other route in this API. Belt and suspenders, same spirit as RLS being a
// second layer under the app-layer check everywhere else.

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData } = require('../utils/respond');

const router = express.Router();

router.get(
  '/hospitals/:hospitalId/reports/bed-occupancy',
  requireHospitalPermission('reports.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('bed_occupancy_summary')
        .select('*')
        .eq('hospital_id', req.params.hospitalId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

// Supports ?from=YYYY-MM-DD&to=YYYY-MM-DD, defaults to no range filter (all history).
router.get(
  '/hospitals/:hospitalId/reports/daily-revenue',
  requireHospitalPermission('reports.read'),
  async (req, res, next) => {
    try {
      let query = req.supabase
        .from('daily_revenue_summary')
        .select('*')
        .eq('hospital_id', req.params.hospitalId);
      if (req.query.from) query = query.gte('revenue_date', req.query.from);
      if (req.query.to) query = query.lte('revenue_date', req.query.to);
      const { data, error } = await query.order('revenue_date', { ascending: false });
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/hospitals/:hospitalId/reports/low-stock',
  requireHospitalPermission('reports.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('low_stock_alert')
        .select('*')
        .eq('hospital_id', req.params.hospitalId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
