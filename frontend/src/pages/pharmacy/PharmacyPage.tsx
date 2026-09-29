// Responsibility: Main pharmacy inventory management page displaying stock alerts and medicine catalog

import { Plus, Package } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { NoticeCard } from "@/components/common/NoticeCard";
import { PageHeader } from "@/components/common/PageHeader";
import { PharmacyStatCards } from "./PharmacyStatCards";
import { PharmacyTable } from "./PharmacyTable";
import { usePharmacyPage } from "./usePharmacyPage";

export const PharmacyPage = () => {
  const { inventory, isLoading, lowStock, totalValue } = usePharmacyPage();

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

      <PharmacyTable items={inventory} isLoading={isLoading} />
    </Box>
  );
};

export default PharmacyPage;
