// Responsibility: Main insurance claims dashboard page displaying status metrics and tabbed claims table

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { InsuranceStatCards } from "./InsuranceStatCards";
import { InsuranceClaimsTable } from "./InsuranceClaimsTable";
import {
  buildInsuranceTabs,
  type InsuranceTabId,
} from "./insurance.config";
import { useInsurancePage } from "./useInsurancePage";

export const InsurancePage = () => {
  const { claims, isLoading } = useInsurancePage();
  const [activeTab, setActiveTab] = useState<InsuranceTabId>("all");

  const underReviewClaims = useMemo(
    () =>
      claims.filter(
        (c) =>
          c.status === "under_review" ||
          c.status === "submitted" ||
          c.status === "draft",
      ),
    [claims],
  );
  const settledClaims = useMemo(
    () =>
      claims.filter(
        (c) => c.status === "settled" || c.status === "approved",
      ),
    [claims],
  );

  const tabs = buildInsuranceTabs(
    claims.length,
    underReviewClaims.length,
    settledClaims.length,
  );

  const displayedClaims = useMemo(() => {
    if (activeTab === "under_review") return underReviewClaims;
    if (activeTab === "settled") return settledClaims;
    return claims;
  }, [activeTab, claims, underReviewClaims, settledClaims]);

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Insurance Claims"
        description="Manage insurance policies and claim processing"
        action={<Button icon={<Plus className="h-5 w-5" />}>New Claim</Button>}
      />

      <InsuranceStatCards claims={claims} />

      <Box className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <InsuranceClaimsTable
          claims={displayedClaims}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default InsurancePage;
