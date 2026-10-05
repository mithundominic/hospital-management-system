// Responsibility: Render either table with sticky header or responsive cards grid
import type { ReactNode } from "react";
import { Table, TableBody } from "@/components/ui/Table";
import { DataTableHeader } from "./DataTableHeader";
import { DataCardsGrid } from "./DataCardsGrid";
import type { TableColumn, ViewMode } from "@/types/table.types";

export interface DataTableContentProps<T> {
  mode: ViewMode;
  items: T[];
  columns: readonly TableColumn<T>[] | TableColumn<T>[];
  containerClassName?: string;
  cardGridCols?: 1 | 2 | 3 | 4;
  renderRow: (item: T, index: number) => ReactNode;
  renderCard?: (item: T, index: number) => ReactNode;
}

export function DataTableContent<T>({
  mode,
  items,
  columns,
  containerClassName,
  cardGridCols = 3,
  renderRow,
  renderCard,
}: DataTableContentProps<T>) {
  if (mode === "cards" && renderCard) {
    return (
      <DataCardsGrid
        data={items}
        renderCard={renderCard}
        cols={cardGridCols}
        containerClassName={containerClassName}
      />
    );
  }
  return (
    <Table containerClassName={containerClassName}>
      <DataTableHeader columns={columns} />
      <TableBody>{items.map((item, index) => renderRow(item, index))}</TableBody>
    </Table>
  );
}

export default DataTableContent;
