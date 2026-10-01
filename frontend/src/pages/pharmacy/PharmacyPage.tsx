// Responsibility: Main pharmacy inventory management page with tabbed catalog filtering

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { NoticeCard } from "@/components/common/NoticeCard";
import { PageHeader } from "@/components/common/PageHeader";
import { PharmacyStatCards } from "./PharmacyStatCards";
import { PharmacyTable } from "./PharmacyTable";
import {
  buildPharmacyTabs,
  type PharmacyTabId,
} from "./pharmacy.config";
import { usePharmacyPage } from "./usePharmacyPage";

export const PharmacyPage = () => {
  const { inventory, isLoading, lowStock, totalValue } = usePharmacyPage();
  const [activeTab, setActiveTab] = useState<PharmacyTabId>("all");

  const tabs = buildPharmacyTabs(inventory.length, lowStock.length);
  const displayedItems = activeTab === "low_stock" ? lowStock : inventory;

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Pharmacy & Inventory"
        description="Manage medicine stock and dispensing"
        action={
          <Flex gap={2}>
            <Button variant="secondary" icon={<Package className="h-5 w-5" />}>
              Stock Transaction
            </Button>
            <Button icon={<Plus className="h-5 w-5" />}>Add Item</Button>
          </Flex>
        }
      />

      {lowStock.length > 0 && (
        <NoticeCard
          variant="warning"
          title="Low Stock Alert"
          description={`${lowStock.length} items are currently below their configured reorder level.`}
        />
      )}

      <PharmacyStatCards
        totalItems={inventory.length}
        lowStockCount={lowStock.length}
        totalValue={totalValue}
      />

      <Box className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <PharmacyTable items={displayedItems} isLoading={isLoading} />
      </Box>
    </Box>
  );
};

export default PharmacyPage;
