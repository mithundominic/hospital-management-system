// backend/src/services/abdm/AbdmM2Service.js
// Responsibility: M2 - Care context linking workflows

const config = require("../../config/env");
const { AbdmAuth } = require("./AbdmAuth");

const { gatewayUrl: GATEWAY_URL, hipId: HIP_ID } = config.abdm;

class AbdmM2Service {
  constructor() {
    this.auth = new AbdmAuth();
  }

  /**
   * Link care context (visit/admission) to patient's ABHA
   * Real endpoint category: links/context/*
   * Exact path/payload needs verification against current docs
   */
  async linkCareContext({ abhaAddress, careContextReference }) {
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token, HIP_ID);

    const res = await fetch(`${GATEWAY_URL}/v0.5/links/link/init`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        abhaAddress,
        patient: { referenceNumber: careContextReference },
      }),
    });

    if (!res.ok) {
      throw new Error(`ABDM linkCareContext failed: ${res.status}`);
    }

    return res.json();
  }
}

module.exports = { AbdmM2Service };
