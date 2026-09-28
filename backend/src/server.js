// src/server.js
// Rule 15 Compliance: Uses centralized env config
require("dotenv").config();

const app = require("./app");
const config = require("./config/env");

app.listen(config.port, () => {
  console.log(`Hospital SaaS backend listening on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
