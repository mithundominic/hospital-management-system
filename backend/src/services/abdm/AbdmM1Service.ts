// Responsibility: M1 - ABHA verification and linking workflows
// backend/src/services/abdm/AbdmM1Service.ts

import config from "../../config/env";
import { AbdmAuth } from "./AbdmAuth";

const { gatewayUrl, hipId } = config.abdm;

interface InitiateVerificationParams {
  abhaAddress: string;
}

interface ConfirmLinkParams {
  transactionId: string;
  otp: string;
}

interface AbdmApiResponse {
  transactionId?: string;
  [key: string]: unknown;
}

export class AbdmM1Service {
  private auth: AbdmAuth;

  constructor() {
    this.auth = new AbdmAuth();
  }

  /**
   * Initiate ABHA verification (OTP-based)
   * Real endpoint: POST {GATEWAY}/v0.5/users/auth/init
   * Returns transactionId; actual result arrives at callback
   */
  async initiateAbhaVerification(
    params: InitiateVerificationParams,
  ): Promise<AbdmApiResponse> {
    const { abhaAddress } = params;
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token, hipId);

    const res = await fetch(`${gatewayUrl}/v0.5/users/auth/init`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: { id: abhaAddress, purpose: "LINK" },
      }),
    });

    if (!res.ok) {
      throw new Error(`ABDM initiateAbhaVerification failed: ${res.status}`);
    }

    return res.json() as Promise<AbdmApiResponse>;
  }

  /**
   * Confirm ABHA link with OTP
   * Real endpoint: POST {GATEWAY}/v0.5/users/auth/confirm
   * Async - resolves via callback
   */
  async confirmAbhaLink(params: ConfirmLinkParams): Promise<AbdmApiResponse> {
    const { transactionId, otp } = params;
    const token = await this.auth.getAccessToken();
    const headers = this.auth.createHeaders(token, hipId);

    const res = await fetch(`${gatewayUrl}/v0.5/users/auth/confirm`, {
      method: "POST",
      headers,
      body: JSON.stringify({ transactionId, otp }),
    });

    if (!res.ok) {
      throw new Error(`ABDM confirmAbhaLink failed: ${res.status}`);
    }

    return res.json() as Promise<AbdmApiResponse>;
  }
}
