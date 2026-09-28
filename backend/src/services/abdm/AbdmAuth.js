// backend/src/services/abdm/AbdmAuth.js
// Responsibility: Handle ABDM gateway authentication and token management

const config = require("../../config/env");

const {
  gatewayUrl: GATEWAY_URL,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
} = config.abdm;

class AbdmAuth {
  constructor() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.warn(
        "AbdmAuth: ABDM_CLIENT_ID/SECRET not set -- calls will fail.",
      );
    }
  }

  /**
   * Get access token for ABDM gateway API calls
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    const res = await fetch(`${GATEWAY_URL}/v0.5/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      }),
    });

    if (!res.ok) {
      throw new Error(`ABDM auth failed: ${res.status}`);
    }

    const data = await res.json();
    return data.accessToken;
  }

  /**
   * Create headers for authenticated ABDM API requests
   * @param {string} token - Access token
   * @param {string} [actorId] - HIP_ID or HIU_ID depending on context
   * @returns {Object} Headers object
   */
  createHeaders(token, actorId) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (actorId) {
      headers["X-HIP-ID"] = actorId;
    }

    return headers;
  }
}

module.exports = { AbdmAuth };
