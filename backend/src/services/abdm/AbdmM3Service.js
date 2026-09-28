// backend/src/services/abdm/AbdmM3Service.js
// Responsibility: M3 - Consent request and health information fetch (HIU role)

const config = require("../../config/env");
const { AbdmAuth } = require("./AbdmAuth");

const { gatewayUrl: GATEWAY_URL, hiuId: HIU_ID } = config.abdm;

class AbdmM3Service {
  constructor() {
    this.auth = new AbdmAuth();
  }

  /**
   * Request consent to view patient's health records
   * Real endpoint: POST {GATEWAY}/v0.5/consent-requests/init
   * Async - resolves via callbacks
   */
  async requestConsent({ abhaAddress, purpose }) {
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token);
    headers["X-HIU-ID"] = HIU_ID;

    const res = await fetch(`${GATEWAY_URL}/v0.5/consent-requests/init`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        consent: {
          purpose: { text: purpose },
          patient: { id: abhaAddress },
          hiu: { id: HIU_ID },
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`ABDM requestConsent failed: ${res.status}`);
    }

    return res.json();
  }

  /**
   * Fetch health information after consent granted
   * Real endpoint: POST {GATEWAY}/v0.5/health-information/cm/request
   * Response is FHIR R4 bundle - parsing out of scope for this scaffold
   */
  async fetchHealthInformation({ artifactId }) {
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token);
    headers["X-HIU-ID"] = HIU_ID;

    const res = await fetch(`${GATEWAY_URL}/v0.5/health-information/cm/request`, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        hiRequest: { consent: { id: artifactId } } 
      }),
    });

    if (!res.ok) {
      throw new Error(`ABDM fetchHealthInformation failed: ${res.status}`);
    }

    return res.json();
  }
}

module.exports = { AbdmM3Service };
