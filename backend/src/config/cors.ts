// Responsibility: CORS configuration for allowed origins and request options
import type { CorsOptions } from "cors";
import config from "./env";

const devOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

const allowedOrigins: string[] = [
  config.frontend?.url,
  config.frontend?.adminUrl,
  ...(config.nodeEnv === "development" ? devOrigins : []),
].filter((url): url is string => Boolean(url));

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Hospital-Id"],
};

