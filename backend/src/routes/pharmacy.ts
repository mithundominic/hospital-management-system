// Responsibility: Pharmacy inventory and stock transactions routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import { sendData } from "../utils/respond";
import {
  queryCurrentInventory,
  createNewInventoryItem,
  recordStockTransaction,
} from "../services/pharmacy/PharmacyService";
import { AuthenticatedRequest, RouteHandler } from "../types";

const router = express.Router();

const getInventory: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await queryCurrentInventory(
      authReq.supabase,
      authReq.params.hospitalId!,
    );
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createInventoryItem: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await createNewInventoryItem(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

const createTransaction: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const data = await recordStockTransaction(
      authReq.supabase,
      authReq.params.hospitalId!,
      authReq.params.itemId!,
      authReq.body,
    );
    sendData(res, data, 201);
  } catch (err) {
    next(err);
  }
};

router.get(
  API_ROUTES.pharmacy.inventory,
  requireHospitalPermission(PERMISSIONS.INVENTORY_READ),
  getInventory,
);
router.post(
  API_ROUTES.pharmacy.inventory,
  requireHospitalPermission(PERMISSIONS.INVENTORY_WRITE),
  createInventoryItem,
);
router.post(
  API_ROUTES.pharmacy.transactions,
  requireHospitalPermission(PERMISSIONS.INVENTORY_WRITE),
  createTransaction,
);

export default router;
