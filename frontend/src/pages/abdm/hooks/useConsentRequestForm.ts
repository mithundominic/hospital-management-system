// Responsibility: Manage consent request form state and submission mutation

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConsentRequest } from "@/services/abdm.service";
import { QUERY_KEYS } from "@/constants";
import { useHospital } from "@/contexts/HospitalContext";

export const useConsentRequestForm = (patientId: string) => {
  const { currentHospital } = useHospital();
  const [abhaAddress, setAbhaAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { abha_address: string; purpose: string }) => {
      if (!currentHospital) throw new Error("No hospital selected");
      return await createConsentRequest(currentHospital.id, patientId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.hospitals.abdm.consentArtifacts(
          currentHospital?.id,
          patientId,
        ),
      });
      setAbhaAddress("");
      setPurpose("");
    },
  });

  const handleSubmit = useCallback(() => {
    if (abhaAddress && purpose) {
      mutation.mutate({ abha_address: abhaAddress, purpose });
    }
  }, [abhaAddress, purpose, mutation]);

  return {
    abhaAddress,
    setAbhaAddress,
    purpose,
    setPurpose,
    handleSubmit,
    isSubmitting: mutation.isPending,
  } as const;
};
