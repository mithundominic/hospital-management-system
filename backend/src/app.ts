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

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Global authentication middleware
// Note: abdmCallbacks will be mounted before this when migrated
app.use(auth);

// Mount routers
app.use(hospitalsRouter);
app.use(patientsRouter);
app.use(billingRouter);
app.use(encountersRouter);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
