// Responsibility: Reusable data view supporting sticky table and card grid with pagination and empty state
import { useState } from "react";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { EmptyState } from "./EmptyState";
import { SkeletonTable } from "./SkeletonTable";
import { TablePagination } from "./TablePagination";
import { ViewModeToggle } from "./ViewModeToggle";
import { DataTableContent } from "./DataTableContent";
import { usePagination } from "@/lib/hooks/usePagination";
import { cn } from "@/lib/utils";
import type { DataTableProps, ViewMode } from "@/types/table.types";

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyIcon = FileText,
  emptyTitle = "No records found",
  emptyDescription = "There are no records to display at this time.",
  emptyActionLabel,
  onEmptyAction,
  renderRow,
  renderCard,
  viewMode,
  onViewModeChange,
  showViewToggle = false,
  cardGridCols = 3,
  initialPageSize = 10,
  pageSizeOptions,
  containerClassName = "max-h-[520px] overflow-auto",
  className,
  paginate = true,
}: DataTableProps<T>) {
  const [internalMode, setInternalMode] = useState<ViewMode>("table");
  const currentMode = viewMode ?? internalMode;
  const handleModeChange = onViewModeChange ?? setInternalMode;
  const { page, pageSize, totalPages, totalItems, paginatedItems, setPage, setPageSize } =
    usePagination(data, initialPageSize);

  if (isLoading) {
    return (
      <Card className="p-4">
        <SkeletonTable rows={initialPageSize > 5 ? 6 : initialPageSize} columns={columns.length} />
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      </Card>
    );
  }

  const items = paginate ? paginatedItems : data;

  return (
    <Card className={cn("overflow-hidden", className)}>
      {showViewToggle && renderCard && (
        <Flex justify="end" className="p-2 border-b border-gray-100 bg-gray-50/50">
          <ViewModeToggle viewMode={currentMode} onChange={handleModeChange} />
        </Flex>
      )}
      <DataTableContent
        mode={currentMode}
        items={items}
        columns={columns}
        containerClassName={containerClassName}
        cardGridCols={cardGridCols}
        renderRow={renderRow}
        renderCard={renderCard}
      />
      {paginate && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </Card>
  );
}

export default DataTable;
