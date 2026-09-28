// Responsibility: Configuration and environment variable types
// backend/src/types/config.types.ts

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface AbdmConfig {
  clientId: string;
  clientSecret: string;
  hipId: string;
  hiuId: string;
  callbackBaseUrl: string;
  abhaUrl: string;
  gatewayUrl: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: "development" | "production" | "test";
  supabase: SupabaseConfig;
  abdm: AbdmConfig;
}
