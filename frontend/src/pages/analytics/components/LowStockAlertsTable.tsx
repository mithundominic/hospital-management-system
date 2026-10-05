// Responsibility: Low stock alerts table display with warning badges

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { DataTableHeader } from "@/components/common/DataTableHeader";

const LOW_STOCK_COLUMNS = [
  { key: "name", header: "Item Name" },
  { key: "code", header: "Code" },
  { key: "current_quantity", header: "Current Quantity" },
  { key: "reorder_level", header: "Reorder Level" },
  { key: "status", header: "Status" },
] as const;

interface LowStockAlert {
  name: string;
  item_code?: string;
  current_quantity: number;
  reorder_level: number;
}

interface LowStockAlertsTableProps {
  alerts: LowStockAlert[];
}

export const LowStockAlertsTable = ({ alerts }: LowStockAlertsTableProps) => (
  <Card className="p-6">
    <Heading level={3} className="mb-4">
      Low Stock Alerts
    </Heading>
    <Table containerClassName="max-h-[280px] overflow-auto">
      <DataTableHeader columns={LOW_STOCK_COLUMNS} />
      <TableBody>
        {alerts.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.item_code || "N/A"}</TableCell>
            <TableCell>{item.current_quantity}</TableCell>
            <TableCell>{item.reorder_level}</TableCell>
            <TableCell>
              <Badge variant="danger">Low Stock</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);
