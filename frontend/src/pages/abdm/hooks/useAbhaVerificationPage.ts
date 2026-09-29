// Responsibility: Manage ABHA verification page state, patient param, link requests queries, and active tab

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAbhaLinkRequests } from "@/services/abdm.service";
import { QUERY_KEYS } from "@/constants";
import { useHospital } from "@/contexts/HospitalContext";
import type { LinkRequest } from "../abdm.types";
import type { AbhaTabId } from "../abdm.config";

export const useAbhaVerificationPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { currentHospital } = useHospital();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AbhaTabId>("verify");

  const { data: linkRequests = [], isLoading } = useQuery<LinkRequest[]>({
    queryKey: QUERY_KEYS.hospitals.abdm.linkRequests(
      currentHospital?.id,
      patientId,
    ),
    enabled: !!currentHospital && !!patientId,
    queryFn: async () => {
      if (!currentHospital || !patientId) return [];
      return await getAbhaLinkRequests(currentHospital.id, patientId);
    },
  });

  return {
    patientId,
    linkRequests,
    isLoading,
    selectedRequest,
    setSelectedRequest,
    activeTab,
    setActiveTab,
  } as const;
};
