// Responsibility: Render low stock inventory alert table for reports dashboard

import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Flex } from '@/components/ui/Flex';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import type { LowStockItem } from '@/types';

export interface ReportsLowStockTableProps {
  lowStock: LowStockItem[];
}

export const ReportsLowStockTable = ({ lowStock }: ReportsLowStockTableProps) => {
  if (lowStock.length === 0) return null;

  return (
    <Card className="p-6">
      <Flex align="center" gap={2} className="mb-4">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <Heading level={3} className="text-lg font-semibold text-gray-900">
          Low Stock Alerts
        </Heading>
      </Flex>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Reorder Level</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lowStock.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-gray-900">{item.item_name}</TableCell>
              <TableCell className="font-semibold text-red-600">{item.quantity_in_stock}</TableCell>
              <TableCell>{item.reorder_level}</TableCell>
              <TableCell>{item.category || 'General'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
