// Responsibility: Universal table column definition interface and accessor types

import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  className?: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
}
