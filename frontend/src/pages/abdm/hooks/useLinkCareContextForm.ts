// Responsibility: Manage care context linking form state and submission mutation

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkCareContext } from "@/services/abdm.service";
import { QUERY_KEYS } from "@/constants";
import { useHospital } from "@/contexts/HospitalContext";

export const useLinkCareContextForm = (patientId: string) => {
  const { currentHospital } = useHospital();
  const [abhaAddress, setAbhaAddress] = useState("");
  const [careContextRef, setCareContextRef] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      abha_address: string;
      care_context_reference: string;
    }) => {
      if (!currentHospital) throw new Error("No hospital selected");
      return await linkCareContext(currentHospital.id, patientId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.hospitals.abdm.linkedContexts(patientId),
      });
      setAbhaAddress("");
      setCareContextRef("");
    },
  });

  const handleSubmit = useCallback(() => {
    if (abhaAddress && careContextRef) {
      mutation.mutate({
        abha_address: abhaAddress,
        care_context_reference: careContextRef,
      });
    }
  }, [abhaAddress, careContextRef, mutation]);

  return {
    abhaAddress,
    setAbhaAddress,
    careContextRef,
    setCareContextRef,
    handleSubmit,
    isSubmitting: mutation.isPending,
  } as const;
};
