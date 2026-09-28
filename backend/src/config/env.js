/**
 * Centralized Environment Configuration
 * 
 * Rule 15 (Centralized Env): All environment variable access must go through this
 * validated configuration module. Direct process.env access is forbidden elsewhere.
 */

// Validate required environment variables at startup
function validateEnv() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file against .env.example'
    );
  }
}

// Run validation immediately when this module is loaded
validateEnv();

/**
 * Server Configuration
 */
const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // ABDM Integration (Phase 5 - Optional)
  abdm: {
    clientId: process.env.ABDM_CLIENT_ID || '',
    clientSecret: process.env.ABDM_CLIENT_SECRET || '',
    hipId: process.env.ABDM_HIP_ID || '',
    hiuId: process.env.ABDM_HIU_ID || '',
    callbackBaseUrl: process.env.ABDM_CALLBACK_BASE_URL || '',
    abhaUrl: process.env.ABDM_ABHA_URL || 'https://healthidsbx.abdm.gov.in/api',
    gatewayUrl: process.env.ABDM_GATEWAY_URL || 'https://dev.abdm.gov.in/gateway',
  },
};

// Freeze config to prevent runtime modifications
Object.freeze(config);
Object.freeze(config.supabase);
Object.freeze(config.abdm);

module.exports = config;
