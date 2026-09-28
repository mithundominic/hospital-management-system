// backend/src/services/abdm/AbdmM1Service.js
// Responsibility: M1 - ABHA verification and linking workflows

const config = require("../../config/env");
const { AbdmAuth } = require("./AbdmAuth");

const { gatewayUrl: GATEWAY_URL, hipId: HIP_ID } = config.abdm;

class AbdmM1Service {
  constructor() {
    this.auth = new AbdmAuth();
  }

  /**
   * Initiate ABHA verification (OTP-based)
   * Real endpoint: POST {GATEWAY}/v0.5/users/auth/init
   * Returns transactionId; actual result arrives at callback
   */
  async initiateAbhaVerification({ abhaAddress }) {
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token, HIP_ID);

    const res = await fetch(`${GATEWAY_URL}/v0.5/users/auth/init`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: { id: abhaAddress, purpose: "LINK" },
      }),
    });

    if (!res.ok) {
      throw new Error(`ABDM initiateAbhaVerification failed: ${res.status}`);
    }

    return res.json();
  }

  /**
   * Confirm ABHA link with OTP
   * Real endpoint: POST {GATEWAY}/v0.5/users/auth/confirm
   * Async - resolves via callback
   */
  async confirmAbhaLink({ transactionId, otp }) {
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token, HIP_ID);

    const res = await fetch(`${GATEWAY_URL}/v0.5/users/auth/confirm`, {
      method: "POST",
      headers,
      body: JSON.stringify({ transactionId, otp }),
    });

    if (!res.ok) {
      throw new Error(`ABDM confirmAbhaLink failed: ${res.status}`);
    }

    return res.json();
  }
}

module.exports = { AbdmM1Service };
