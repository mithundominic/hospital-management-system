// Responsibility: Universal table and data view types, interfaces, and view modes

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type ViewMode = "table" | "cards";

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  className?: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: readonly TableColumn<T>[] | TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  renderRow: (item: T, index: number) => ReactNode;
  renderCard?: (item: T, index: number) => ReactNode;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;
  cardGridCols?: 1 | 2 | 3 | 4;
  initialPageSize?: number;
  pageSizeOptions?: readonly number[] | number[];
  containerClassName?: string;
  className?: string;
  paginate?: boolean;
}
