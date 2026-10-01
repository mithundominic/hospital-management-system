// Responsibility: HIP data request callback processing

import { logCallback } from "./AbdmCallbackService";

interface HipDataRequestCallback extends Record<string, unknown> {
  transactionId: string;
  hiRequest: {
    consent: {
      id: string;
    };
  };
}

export const processHipDataRequest = async (
  body: HipDataRequestCallback,
): Promise<void> => {
  await logCallback("health-information/hip/request", body);
  const consentId = body.hiRequest?.consent?.id;
  const transactionId = body.transactionId;

  if (consentId && transactionId) {
    const { AbdmHipService } = await import("./AbdmHipService");
    const hipService = new AbdmHipService();
    await hipService.pushHealthInformation(consentId, transactionId);
  }
};
