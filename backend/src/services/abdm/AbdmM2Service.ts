// backend/src/services/abdm/AbdmM2Service.ts
// Responsibility: M2 - Care context linking workflows

import config from "../../config/env";
import { AbdmAuth } from "./AbdmAuth";

const { gatewayUrl, hipId } = config.abdm;

interface LinkCareContextParams {
  abhaAddress: string;
  careContextReference: string;
}

interface AbdmApiResponse {
  [key: string]: unknown;
}

export class AbdmM2Service {
  private auth: AbdmAuth;

  constructor() {
    this.auth = new AbdmAuth();
  }

  /**
   * Link care context (visit/admission) to patient's ABHA
   * Real endpoint category: links/context/*
   * Exact path/payload needs verification against current docs
   */
  async linkCareContext(
    params: LinkCareContextParams,
  ): Promise<AbdmApiResponse> {
    const { abhaAddress, careContextReference } = params;
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token, hipId);

    const res = await fetch(`${gatewayUrl}/v0.5/links/link/init`, {
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

    return res.json() as Promise<AbdmApiResponse>;
  }
}
