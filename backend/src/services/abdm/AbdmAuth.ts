// Responsibility: Handle ABDM gateway authentication and token management
// backend/src/services/abdm/AbdmAuth.ts

import config from "../../config/env";

const { gatewayUrl, clientId, clientSecret } = config.abdm;

interface AbdmSessionResponse {
  accessToken: string;
  expiresIn?: number;
}

export class AbdmAuth {
  constructor() {
    if (!clientId || !clientSecret) {
      console.warn(
        "AbdmAuth: ABDM_CLIENT_ID/SECRET not set -- calls will fail.",
      );
    }
  }

  /**
   * Get access token for ABDM gateway API calls
   * @returns Access token
   */
  async getAccessToken(): Promise<string> {
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
    return data.accessToken;
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
