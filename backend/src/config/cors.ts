// Responsibility: CORS configuration for allowed origins and request options
import type { CorsOptions } from "cors";
import config from "./env";

const allowedOrigins: string[] = [
  config.frontend?.url,
  config.frontend?.adminUrl,
].filter(Boolean);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      config.nodeEnv === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Hospital-Id"],
};
