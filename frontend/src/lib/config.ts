// Responsibility: Centralized, validated environment configuration for the frontend

interface Config {
  supabase: {
    url: string;
    anonKey: string;
  };
  api: {
    baseUrl: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

function validateConfig(): Config {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Missing required environment variables. Please check your .env file:\n" +
        "- VITE_SUPABASE_URL\n" +
        "- VITE_SUPABASE_ANON_KEY",
    );
  }

  return {
    supabase: {
      url: supabaseUrl || "",
      anonKey: supabaseAnonKey || "",
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
