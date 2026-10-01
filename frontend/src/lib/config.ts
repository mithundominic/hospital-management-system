// Responsibility: Centralized, validated environment configuration for the frontend

interface Config {
  supabase: {
    url: string;
    publishableKey: string;
    anonKey: string;
    jwksUrl?: string;
  };
  api: {
    baseUrl: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

function validateConfig(): Config {
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
  const publishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.SUPABASE_ANON_KEY;
  const jwksUrl =
    import.meta.env.VITE_SUPABASE_JWKS_URL || import.meta.env.SUPABASE_JWKS_URL;
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!supabaseUrl || !publishableKey) {
    console.error(
      "Missing required Supabase environment variables. Check .env file:\n" +
        "- SUPABASE_URL / VITE_SUPABASE_URL\n" +
        "- SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return {
    supabase: {
      url: supabaseUrl || "",
      publishableKey: publishableKey || "",
      anonKey: publishableKey || "",
      jwksUrl: jwksUrl || "",
    },
    api: {
      baseUrl:
        (apiUrl || "http://localhost:3002").replace(/\/api\/v1\/?$/, "") +
        "/api/v1",
    },
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };
}

const config = validateConfig();
Object.freeze(config);
Object.freeze(config.supabase);
Object.freeze(config.api);

export default config;
