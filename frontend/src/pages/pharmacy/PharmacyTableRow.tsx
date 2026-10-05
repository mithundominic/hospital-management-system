// Responsibility: Render single pharmacy inventory item row with stock calculations

import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { inventoryStockStatusConfig } from "@/configs/status.config";
import type { InventoryItem } from "@/types";

export interface PharmacyTableRowProps {
  item: InventoryItem;
}

export const PharmacyTableRow = memo(({ item }: PharmacyTableRowProps) => {
  const name = item.name || item.item_name || "Medical Item";
  const stock = item.current_stock ?? item.quantity_in_stock ?? 0;
  const unit = item.unit || item.unit_of_measure || "units";
  const category = item.category || "medicine";
  const isLow = stock <= item.reorder_level;
  const stockConfig =
    inventoryStockStatusConfig[isLow ? "low_stock" : "in_stock"];
  const textClass = isLow ? "text-red-600" : "text-gray-900";

  return (
    <TableRow>
      <TableCell>
        <Text weight="medium">{name}</Text>
        {item.item_code && (
          <Text size="xs" variant="muted">
            {item.item_code}
          </Text>
        )}
      </TableCell>
      <TableCell>
        <Text size="sm">{category}</Text>
      </TableCell>
      <TableCell>
        <Text weight="semibold" className={textClass}>
          {stock} {unit}
        </Text>
      </TableCell>
      <TableCell>
        <Text size="sm" variant="muted">
          {item.reorder_level} {unit}
        </Text>
      </TableCell>
      <TableCell>
        <Text size="sm">{item.unit_price ? `₹${item.unit_price}` : "—"}</Text>
      </TableCell>
      <TableCell>
        <Badge variant={stockConfig.variant}>{stockConfig.label}</Badge>
      </TableCell>
    </TableRow>
  );
});

PharmacyTableRow.displayName = "PharmacyTableRow";

export default PharmacyTableRow;
