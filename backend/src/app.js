// src/app.js

const express = require('express');
const cors = require('cors');
const { auth } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

const hospitalsRouter = require('./routes/hospitals');
const membershipsRouter = require('./routes/memberships');
const patientsRouter = require('./routes/patients');
const staffRouter = require('./routes/staff');
const appointmentsRouter = require('./routes/appointments');
const encountersRouter = require('./routes/encounters');
const labRouter = require('./routes/lab');
const ipdRouter = require('./routes/ipd');
const pharmacyRouter = require('./routes/pharmacy');
const billingRouter = require('./routes/billing');
const insuranceRouter = require('./routes/insurance');
const shiftsRouter = require('./routes/shifts');
const reportsRouter = require('./routes/reports');
const abdmRouter = require('./routes/abdm');
const abdmCallbacksRouter = require('./routes/abdmCallbacks');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ABDM's gateway calls these, not a logged-in staff member -- no Supabase
// user JWT to check, so this is mounted before the auth middleware too, same
// as /health. See routes/abdmCallbacks.js's header comment for the security
// gap this leaves open (callback signature verification isn't implemented).
app.use(abdmCallbacksRouter);

// Every route below assumes a logged-in staff member -- there is no
// public/anonymous endpoint in this API surface, so auth is mounted globally
// rather than per-route. /health and the ABDM callbacks above are
// intentionally mounted before this, so they stay reachable without a token.
app.use(auth);

app.use(hospitalsRouter);
app.use(membershipsRouter);
app.use(patientsRouter);
app.use(staffRouter);
app.use(appointmentsRouter);
app.use(encountersRouter);
app.use(labRouter);
app.use(ipdRouter);
app.use(pharmacyRouter);
app.use(billingRouter);
app.use(insuranceRouter);
app.use(shiftsRouter);
app.use(reportsRouter);
app.use(abdmRouter);

app.use(errorHandler);

module.exports = app;
