// Responsibility: Render individual pharmacy inventory item in card grid view
import { memo } from "react";
import { Pill } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { Badge } from "@/components/ui/Badge";
import { inventoryStockStatusConfig } from "@/configs/status.config";
import type { InventoryItem } from "@/types";

export interface PharmacyCardProps {
  item: InventoryItem;
}

export const PharmacyCard = memo(({ item }: PharmacyCardProps) => {
  const name = item.name || item.item_name || "Medical Item";
  const stock = item.current_stock ?? item.quantity_in_stock ?? 0;
  const unit = item.unit || item.unit_of_measure || "units";
  const category = item.category || "medicine";
  const isLow = stock <= item.reorder_level;
  const stockConfig = inventoryStockStatusConfig[isLow ? "low_stock" : "in_stock"];

  return (
    <DataCard
      title={name}
      subtitle={item.item_code || category}
      icon={<Pill className="h-6 w-6" />}
      badge={<Badge variant={stockConfig.variant}>{stockConfig.label}</Badge>}
      fields={[
        { label: "Category", value: category },
        { label: "Current Stock", value: `${stock} ${unit}` },
        { label: "Reorder Level", value: `${item.reorder_level} ${unit}` },
        { label: "Unit Price", value: item.unit_price ? `₹${item.unit_price}` : "—" },
      ]}
    />
  );
});

PharmacyCard.displayName = "PharmacyCard";

export default PharmacyCard;
