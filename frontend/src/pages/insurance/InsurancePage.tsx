// Responsibility: Main insurance claims dashboard page displaying status metrics and claims registry table

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { InsuranceStatCards } from "./InsuranceStatCards";
import { InsuranceClaimsTable } from "./InsuranceClaimsTable";
import type { InsuranceClaim } from "@/types";

export const InsurancePage = () => {
  const { currentHospital } = useHospital();

  const { data: claims = [], isLoading } = useQuery<InsuranceClaim[]>({
    queryKey: QUERY_KEYS.hospitals.insuranceClaims(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<InsuranceClaim[]>(
        API_ROUTES.hospitals.insuranceClaims(currentHospital.id),
      );
    },
    enabled: !!currentHospital,
  });

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Insurance Claims"
        description="Manage insurance policies and claim processing"
        action={<Button icon={<Plus className="h-5 w-5" />}>New Claim</Button>}
      />

      <InsuranceStatCards claims={claims} />
      <InsuranceClaimsTable claims={claims} isLoading={isLoading} />
    </Box>
  );
};

export default InsurancePage;
