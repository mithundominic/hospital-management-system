// Responsibility: JWKS client for ABDM JWT signature verification with caching

import JwksClient from "jwks-rsa";
import config from "../../config/env";

/**
 * Singleton JWKS client for ABDM gateway callback JWT verification
 * Fetches public keys from ABDM's OpenID discovery endpoint with caching
 */
const jwksClient = JwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: config.abdm.jwksUri,
});

/**
 * Get signing key for JWT verification
 * @param kid Key ID from JWT header
 * @returns Public key for signature verification
 */
export async function getAbdmSigningKey(kid: string): Promise<string> {
  const key = await jwksClient.getSigningKey(kid);
  return key.getPublicKey();
}
