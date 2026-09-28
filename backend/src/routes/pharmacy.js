// src/routes/pharmacy.js -- matches API_SPEC.md "### Pharmacy"

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData } = require('../utils/respond');

const router = express.Router();

// Returns the inventory_current_stock view (Phase 2), not the raw
// inventory_items table -- current_stock is derived from the ledger, never
// a stored counter that could drift.
router.get(
  '/hospitals/:hospitalId/inventory',
  requireHospitalPermission('inventory.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('inventory_current_stock')
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
  '/hospitals/:hospitalId/inventory',
  requireHospitalPermission('inventory.write'),
  async (req, res, next) => {
    try {
      const { name, category, unit, reorder_level } = req.body;
      const { data, error } = await req.supabase
        .from('inventory_items')
        .insert({ hospital_id: req.params.hospitalId, name, category, unit, reorder_level })
        .select()
        .single();
      if (error) throw error;
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
);

// Insert-only ledger entry. quantity is signed: positive = stock in
// (purchase/return), negative = stock out (dispense/adjustment down).
router.post(
  '/hospitals/:hospitalId/inventory/:itemId/transactions',
  requireHospitalPermission('inventory.write'),
  async (req, res, next) => {
    try {
      const { transaction_type, quantity, prescription_item_id, performed_by, notes } = req.body;
      const { data, error } = await req.supabase
        .from('stock_transactions')
        .insert({
          hospital_id: req.params.hospitalId,
          inventory_item_id: req.params.itemId,
          transaction_type,
          quantity,
          prescription_item_id,
          performed_by,
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
