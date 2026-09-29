// Responsibility: Lab orders and results routes

import express from "express";
import { requireHospitalPermission } from "../middleware/requireHospitalPermission";
import { PERMISSIONS, API_ROUTES } from "../constants";
import {
  getLabOrders,
  createLabOrder,
  updateLabOrder,
  createLabResult,
} from "./lab.handlers";

const router = express.Router();

router.get(
  API_ROUTES.lab.orders,
  requireHospitalPermission(PERMISSIONS.LAB_ORDERS_READ),
  getLabOrders,
);
router.post(
  API_ROUTES.lab.orders,
  requireHospitalPermission(PERMISSIONS.LAB_ORDERS_WRITE),
  createLabOrder,
);
router.patch(
  API_ROUTES.lab.orderDetail,
  requireHospitalPermission(PERMISSIONS.LAB_ORDERS_WRITE),
  updateLabOrder,
);
router.post(
  API_ROUTES.lab.results,
  requireHospitalPermission(PERMISSIONS.LAB_RESULTS_WRITE),
  createLabResult,
);

export default router;
