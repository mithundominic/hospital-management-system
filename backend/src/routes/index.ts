// Responsibility: Protected route registration (requires authentication)
import type { Express } from "express";

import hospitalsRouter from "./hospitals";
import platformRouter from "./platform";
import patientsRouter from "./patients";
import appointmentsRouter from "./appointments";
import encountersRouter from "./encounters";
import labRouter from "./lab";
import ipdRouter from "./ipd";
import pharmacyRouter from "./pharmacy";
import billingRouter from "./billing";
import insuranceRouter from "./insurance";
import shiftsRouter from "./shifts";
import attendanceRouter from "./attendance";
import biometricRouter from "./biometric";
import reportsRouter from "./reports";
import staffRouter from "./staff";
import membershipsRouter from "./memberships";
import abdmRouter from "./abdm";
import patientPortalRouter from "./patientPortal";

/**
 * Register all protected routes
 * These routes require user authentication (JWT)
 * Must be mounted after auth middleware
 */
export const registerRoutes = (app: Express): void => {
  app.use(hospitalsRouter);
  app.use(platformRouter);
  app.use(patientsRouter);
  app.use(appointmentsRouter);
  app.use(encountersRouter);
  app.use(labRouter);
  app.use(ipdRouter);
  app.use(pharmacyRouter);
  app.use(billingRouter);
  app.use(insuranceRouter);
  app.use(shiftsRouter);
  app.use(attendanceRouter);
  app.use(biometricRouter);
  app.use(reportsRouter);
  app.use(staffRouter);
  app.use(membershipsRouter);
  app.use(abdmRouter);
  app.use(patientPortalRouter);
};
