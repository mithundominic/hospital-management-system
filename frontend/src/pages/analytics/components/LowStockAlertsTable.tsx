// Responsibility: Low stock alerts table display with warning badges

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

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
    <Table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Code</th>
          <th>Current Quantity</th>
          <th>Reorder Level</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map((item, idx) => (
          <tr key={idx}>
            <td>{item.name}</td>
            <td>{item.item_code || "N/A"}</td>
            <td>{item.current_quantity}</td>
            <td>{item.reorder_level}</td>
            <td>
              <Badge variant="danger">Low Stock</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);
