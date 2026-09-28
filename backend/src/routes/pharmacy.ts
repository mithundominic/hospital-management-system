// Responsibility: Pharmacy inventory and stock transactions routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS } from "../constants";
import { sendData } from "../utils/respond";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getInventory: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from("inventory_current_stock")
      .select("*")
      .eq("hospital_id", authReq.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createInventoryItem: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { name, category, unit, reorder_level } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("inventory_items")
      .insert({
        hospital_id: authReq.params.hospitalId,
        name,
        category,
        unit,
        reorder_level,
      })
      .select()
      .single();
    if (error) throw error;
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const createTransaction: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      transaction_type,
      quantity,
      prescription_item_id,
      performed_by,
      notes,
    } = authReq.body;
    const { data, error } = await authReq.supabase
      .from("stock_transactions")
      .insert({
        hospital_id: authReq.params.hospitalId,
        inventory_item_id: authReq.params.itemId,
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
};

router.get(
  "/hospitals/:hospitalId/inventory",
  requireHospitalPermission(PERMISSIONS.INVENTORY_READ),
  getInventory,
);
router.post(
  "/hospitals/:hospitalId/inventory",
  requireHospitalPermission(PERMISSIONS.INVENTORY_WRITE),
  createInventoryItem,
);
router.post(
  "/hospitals/:hospitalId/inventory/:itemId/transactions",
  requireHospitalPermission(PERMISSIONS.INVENTORY_WRITE),
  createTransaction,
);

export default router;
