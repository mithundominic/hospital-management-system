// Responsibility: Fast-moving inventory items table display

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Table } from "@/components/ui/Table";

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
    <Table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Code</th>
          <th>Quantity Dispensed</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx}>
            <td>{item.name}</td>
            <td>{item.item_code || 'N/A'}</td>
            <td>{item.quantity_dispensed}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);
