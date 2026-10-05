// Responsibility: Universal configuration-driven table header renderer

import { TableHeader, TableRow, TableHead } from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import type { TableColumn } from "@/types/table.types";

export interface DataTableHeaderProps<T> {
  columns: readonly TableColumn<T>[] | TableColumn<T>[];
  className?: string;
  sticky?: boolean;
}

export function DataTableHeader<T>({
  columns,
  className,
  sticky = true,
}: DataTableHeaderProps<T>) {
  return (
    <TableHeader className={cn(sticky && "sticky top-0 z-10", className)}>
      <TableRow>
        {columns.map((col) => (
          <TableHead
            key={col.key}
            className={cn(
              sticky && "sticky top-0 z-10 bg-gray-50 border-b border-gray-200",
              col.headerClassName,
            )}
          >
            {col.header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

export default DataTableHeader;
