// Responsibility: Manage ABHA verification form state, OTP transaction, and verification mutations

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  initiateAbhaVerification,
  confirmAbhaVerification,
} from "@/services/abdm.service";
import { useHospital } from "@/contexts/HospitalContext";
import type { AbhaVerificationResponse } from "../abdm.types";

export const useAbhaVerificationForm = (patientId: string) => {
  const { currentHospital } = useHospital();
  const [abhaAddress, setAbhaAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const initiateMutation = useMutation({
    mutationFn: async (data: { abha_address: string }) => {
      if (!currentHospital) throw new Error("No hospital selected");
      return await initiateAbhaVerification(
        currentHospital.id,
        patientId,
        data,
      );
    },
    onSuccess: (response: AbhaVerificationResponse) => {
      setTransactionId(response.abdm_request_id);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (data: { transaction_id: string; otp: string }) => {
      if (!currentHospital) throw new Error("No hospital selected");
      return await confirmAbhaVerification(currentHospital.id, patientId, data);
    },
  });

  const handleInitiate = useCallback(() => {
    if (abhaAddress) {
      initiateMutation.mutate({ abha_address: abhaAddress });
    }
  }, [abhaAddress, initiateMutation]);

  const handleConfirm = useCallback(() => {
    if (transactionId && otp) {
      confirmMutation.mutate({ transaction_id: transactionId, otp });
    }
  }, [transactionId, otp, confirmMutation]);

  return {
    abhaAddress,
    setAbhaAddress,
    otp,
    setOtp,
    transactionId,
    handleInitiate,
    handleConfirm,
    isInitiating: initiateMutation.isPending,
    isConfirming: confirmMutation.isPending,
  } as const;
};
