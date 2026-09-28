// backend/src/services/AbdmClient.ts
// Responsibility: Unified facade for ABDM integration services
// Rule 20 Compliance: Under 100 lines via extraction to milestone-specific services

import { AbdmM1Service } from './abdm/AbdmM1Service';
import { AbdmM2Service } from './abdm/AbdmM2Service';
import { AbdmM3Service } from './abdm/AbdmM3Service';

interface InitiateVerificationParams {
  abhaAddress: string;
  hospitalId: string;
  patientId: string;
}

interface ConfirmLinkParams {
  transactionId: string;
  otp: string;
}

interface LinkCareContextParams {
  abhaAddress: string;
  hospitalId: string;
  encounterId: string;
  careContextReference: string;
}

interface RequestConsentParams {
  abhaAddress: string;
  purpose: string;
  hospitalId: string;
}

interface FetchHealthInfoParams {
  artifactId: string;
}

export class AbdmClient {
  private m1: AbdmM1Service;
  private m2: AbdmM2Service;
  private m3: AbdmM3Service;

  constructor() {
    this.m1 = new AbdmM1Service();
    this.m2 = new AbdmM2Service();
    this.m3 = new AbdmM3Service();
  }

  async initiateAbhaVerification(params: InitiateVerificationParams) {
    const { abhaAddress } = params;
    return this.m1.initiateAbhaVerification({ abhaAddress });
  }

  async confirmAbhaLink(params: ConfirmLinkParams) {
    return this.m1.confirmAbhaLink(params);
  }

  async linkCareContext(params: LinkCareContextParams) {
    const { abhaAddress, careContextReference } = params;
    return this.m2.linkCareContext({ abhaAddress, careContextReference });
  }

  async requestConsent(params: RequestConsentParams) {
    const { abhaAddress, purpose } = params;
    return this.m3.requestConsent({ abhaAddress, purpose });
  }

  async fetchHealthInformation(params: FetchHealthInfoParams) {
    return this.m3.fetchHealthInformation(params);
  }
}
