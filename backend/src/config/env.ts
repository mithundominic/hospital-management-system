// Responsibility: Centralized environment configuration with type safety
// backend/src/config/env.ts
// Rule 17 (Centralized Env): All environment variable access through this module

import { AppConfig } from "../types/config.types";

/**
 * Validate required environment variables at startup
 */
function validateEnv(): void {
  const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file against .env.example",
    );
  }
}

// Run validation immediately when this module is loaded
validateEnv();

/**
 * Application configuration object
 */
const config: Readonly<AppConfig> = Object.freeze({
  // Server
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: (process.env.NODE_ENV || "development") as AppConfig["nodeEnv"],

  // Server Configuration
  server: Object.freeze({
    port: parseInt(process.env.PORT || "3000", 10),
    bodyLimit: process.env.BODY_LIMIT || "1mb",
  }),

  // Frontend URLs for CORS
  frontend: Object.freeze({
    url: process.env.FRONTEND_URL || "http://localhost:5173",
    adminUrl: process.env.ADMIN_FRONTEND_URL || "",
  }),

  // Supabase
  supabase: Object.freeze({
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  // ABDM Integration (Phase 5 - Optional)
  abdm: Object.freeze({
    clientId: process.env.ABDM_CLIENT_ID || "",
    clientSecret: process.env.ABDM_CLIENT_SECRET || "",
    hipId: process.env.ABDM_HIP_ID || "",
    hiuId: process.env.ABDM_HIU_ID || "",
    callbackBaseUrl: process.env.ABDM_CALLBACK_BASE_URL || "",
    abhaUrl: process.env.ABDM_ABHA_URL || "https://healthidsbx.abdm.gov.in/api",
    gatewayUrl:
      process.env.ABDM_GATEWAY_URL || "https://dev.abdm.gov.in/gateway",
  }),
});

export default config;
