// Responsibility: Fast-moving inventory items table display

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { DataTableHeader } from "@/components/common/DataTableHeader";

const FAST_MOVING_COLUMNS = [
  { key: "name", header: "Item Name" },
  { key: "code", header: "Code" },
  { key: "quantity", header: "Quantity Dispensed" },
] as const;

interface FastMovingItem {
  name: string;
  item_code?: string;
  quantity_dispensed: number;
}

interface FastMovingTableProps {
  items: FastMovingItem[];
}

export const FastMovingTable = ({ items }: FastMovingTableProps) => (
  <Card className="p-6">
    <Heading level={3} className="mb-4">Fast Moving Items</Heading>
    <Table containerClassName="max-h-[280px] overflow-auto">
      <DataTableHeader columns={FAST_MOVING_COLUMNS} />
      <TableBody>
        {items.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.item_code || "N/A"}</TableCell>
            <TableCell>{item.quantity_dispensed}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);
