// Responsibility: Handle ABDM gateway authentication and token management
// backend/src/services/abdm/AbdmAuth.ts

import config from "../../config/env";

const { gatewayUrl, clientId, clientSecret } = config.abdm;

interface AbdmSessionResponse {
  accessToken: string;
  expiresIn?: number;
}

export class AbdmAuth {
  private cachedToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private readonly EXPIRY_BUFFER_SEC = 60;

  constructor() {
    if (!clientId || !clientSecret) {
      console.warn(
        "AbdmAuth: ABDM_CLIENT_ID/SECRET not set -- calls will fail.",
      );
    }
  }

  /**
   * Get access token for ABDM gateway API calls
   * Uses in-memory cache with TTL-based expiration
   * @returns Access token
   */
  async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (
      this.cachedToken &&
      this.tokenExpiresAt &&
      Date.now() < this.tokenExpiresAt
    ) {
      return this.cachedToken;
    }

    // Fetch new token from gateway
    const res = await fetch(`${gatewayUrl}/v0.5/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        clientSecret,
      }),
    });

    if (!res.ok) {
      throw new Error(`ABDM auth failed: ${res.status}`);
    }

    const data = (await res.json()) as AbdmSessionResponse;

    // Cache token with expiry buffer
    this.cachedToken = data.accessToken;
    if (data.expiresIn) {
      this.tokenExpiresAt =
        Date.now() + data.expiresIn * 1000 - this.EXPIRY_BUFFER_SEC * 1000;
    } else {
      this.tokenExpiresAt = null;
    }

    return data.accessToken;
  }

  /**
   * Clear cached token (for testing or manual invalidation)
   */
  clearCache(): void {
    this.cachedToken = null;
    this.tokenExpiresAt = null;
  }

  /**
   * Create headers for authenticated ABDM API requests
   * @param token - Access token
   * @param actorId - HIP_ID or HIU_ID depending on context
   * @returns Headers object
   */
  createHeaders(token: string, actorId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (actorId) {
      headers["X-HIP-ID"] = actorId;
    }

    return headers;
  }
}
