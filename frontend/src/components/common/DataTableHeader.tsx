// Responsibility: Universal configuration-driven table header renderer

import { TableHeader, TableRow, TableHead } from "@/components/ui/Table";
import type { TableColumn } from "@/types/table.types";

export interface DataTableHeaderProps<T> {
  columns: readonly TableColumn<T>[] | TableColumn<T>[];
  className?: string;
}

export function DataTableHeader<T>({
  columns,
  className,
}: DataTableHeaderProps<T>) {
  return (
    <TableHeader className={className}>
      <TableRow>
        {columns.map((col) => (
          <TableHead key={col.key} className={col.headerClassName}>
            {col.header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

export default DataTableHeader;
