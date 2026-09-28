// Responsibility: Render inventory items table with stock levels, units, and status badges

import { Pill } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonTable } from '@/components/common/SkeletonTable';
import type { InventoryItem } from '@/types';

export interface PharmacyTableProps {
  items: InventoryItem[];
  isLoading: boolean;
}

export const PharmacyTable = ({ items, isLoading }: PharmacyTableProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <SkeletonTable rows={6} columns={6} />
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={Pill}
          title="No inventory items"
          description="Medicine catalog and pharmacy stock will appear here."
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Reorder Level</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const stock = item.quantity_in_stock ?? 0;
            const isLow = stock <= item.reorder_level;
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Text weight="medium">{item.item_name}</Text>
                  {item.item_code && <Text size="xs" variant="muted">{item.item_code}</Text>}
                </TableCell>
                <TableCell>
                  <Text size="sm">{item.category}</Text>
                </TableCell>
                <TableCell>
                  <Text weight="semibold" className={isLow ? 'text-red-600' : 'text-gray-900'}>
                    {stock} {item.unit_of_measure}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text size="sm" variant="muted">{item.reorder_level} {item.unit_of_measure}</Text>
                </TableCell>
                <TableCell>
                  <Text size="sm">₹{item.unit_price}</Text>
                </TableCell>
                <TableCell>
                  <Badge variant={isLow ? 'danger' : 'success'}>
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};
