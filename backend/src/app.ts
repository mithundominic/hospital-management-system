// backend/src/app.ts
// Responsibility: Express application setup and route mounting

import express from "express";
import cors from "cors";
import { auth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

// Import routes
import hospitalsRouter from "./routes/hospitals";
import patientsRouter from "./routes/patients";
import billingRouter from "./routes/billing";
import encountersRouter from "./routes/encounters";
import abdmRouter from "./routes/abdm";
import abdmCallbacksRouter from "./routes/abdmCallbacks";
import appointmentsRouter from "./routes/appointments";
import insuranceRouter from "./routes/insurance";
import ipdRouter from "./routes/ipd";
import labRouter from "./routes/lab";
import membershipsRouter from "./routes/memberships";
import pharmacyRouter from "./routes/pharmacy";
import reportsRouter from "./routes/reports";
import shiftsRouter from "./routes/shifts";
import staffRouter from "./routes/staff";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// CRITICAL: ABDM callbacks mounted BEFORE auth middleware
// These endpoints receive calls from ABDM gateway (no user JWT)
app.use(abdmCallbacksRouter);

// Global authentication middleware
// All routes below require authenticated user
app.use(auth);

// Mount routers
app.use(hospitalsRouter);
app.use(patientsRouter);
app.use(appointmentsRouter);
app.use(encountersRouter);
app.use(labRouter);
app.use(ipdRouter);
app.use(pharmacyRouter);
app.use(billingRouter);
app.use(insuranceRouter);
app.use(shiftsRouter);
app.use(reportsRouter);
app.use(staffRouter);
app.use(membershipsRouter);
app.use(abdmRouter);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
