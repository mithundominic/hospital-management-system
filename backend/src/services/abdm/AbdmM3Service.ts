// Responsibility: M3 - Consent request and health information fetch (HIU role)
// backend/src/services/abdm/AbdmM3Service.ts

import config from "../../config/env";
import { AbdmAuth } from "./AbdmAuth";

const { gatewayUrl, hiuId } = config.abdm;

interface RequestConsentParams {
  abhaAddress: string;
  purpose: string;
}

interface FetchHealthInfoParams {
  artifactId: string;
}

interface AbdmApiResponse {
  [key: string]: unknown;
}

export class AbdmM3Service {
  private auth: AbdmAuth;

  constructor() {
    this.auth = new AbdmAuth();
  }

  /**
   * Request consent to view patient's health records
   * Real endpoint: POST {GATEWAY}/v0.5/consent-requests/init
   * Async - resolves via callbacks
   */
  async requestConsent(params: RequestConsentParams): Promise<AbdmApiResponse> {
    const { abhaAddress, purpose } = params;
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token);
    headers["X-HIU-ID"] = hiuId;

    const res = await fetch(`${gatewayUrl}/v0.5/consent-requests/init`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        consent: {
          purpose: { text: purpose },
          patient: { id: abhaAddress },
          hiu: { id: hiuId },
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`ABDM requestConsent failed: ${res.status}`);
    }

    return res.json() as Promise<AbdmApiResponse>;
  }

  /**
   * Fetch health information after consent granted
   * Real endpoint: POST {GATEWAY}/v0.5/health-information/cm/request
   * Response is FHIR R4 bundle - parsing out of scope for this scaffold
   */
  async fetchHealthInformation(
    params: FetchHealthInfoParams,
  ): Promise<AbdmApiResponse> {
    const { artifactId } = params;
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token);
    headers["X-HIU-ID"] = hiuId;

    const res = await fetch(
      `${gatewayUrl}/v0.5/health-information/cm/request`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          hiRequest: { consent: { id: artifactId } },
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`ABDM fetchHealthInformation failed: ${res.status}`);
    }

    return res.json() as Promise<AbdmApiResponse>;
  }
}
