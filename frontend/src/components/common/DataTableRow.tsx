// Responsibility: Universal configuration-driven table row cell renderer

import { TableRow, TableCell } from "@/components/ui/Table";
import type { TableColumn } from "@/types/table.types";

export interface DataTableRowProps<T> {
  item: T;
  columns: readonly TableColumn<T>[] | TableColumn<T>[];
  onClick?: (item: T) => void;
  className?: string;
}

export function DataTableRow<T>({
  item,
  columns,
  onClick,
  className,
}: DataTableRowProps<T>) {
  return (
    <TableRow
      onClick={onClick ? () => onClick(item) : undefined}
      className={className}
    >
      {columns.map((col) => (
        <TableCell key={col.key} className={col.className}>
          {col.render
            ? col.render(item)
            : String(col.accessor ? (item[col.accessor] ?? "") : "")}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default DataTableRow;
