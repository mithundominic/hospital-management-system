// Responsibility: Main insurance claims dashboard page displaying status metrics and claims registry table

import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { InsuranceStatCards } from "./InsuranceStatCards";
import { InsuranceClaimsTable } from "./InsuranceClaimsTable";
import { useInsurancePage } from "./useInsurancePage";

export const InsurancePage = () => {
  const { claims, isLoading } = useInsurancePage();

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
