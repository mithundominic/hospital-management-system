// Responsibility: Reusable table pagination controls composed using UI primitives

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Select } from "@/components/ui/Select";

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: readonly number[] | number[];
}

const DEFAULT_SIZES: readonly number[] = [10, 20, 50];

export const TablePagination = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_SIZES,
}: TablePaginationProps) => {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const options = pageSizeOptions.map((s) => ({ value: s, label: `${s} / page` }));

  return (
    <Flex align="center" justify="between" className="px-4 py-3 border-t border-gray-200 bg-white">
      <Flex align="center" gap={3}>
        <Text size="sm" variant="muted">Showing {start}–{end} of {totalItems}</Text>
        {onPageSizeChange && (
          <Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            options={options}
            className="w-28 py-1 text-xs"
          />
        )}
      </Flex>
      <Flex align="center" gap={2}>
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          icon={<ChevronLeft className="h-4 w-4" />}
        />
        <Text size="sm" weight="medium">{page} / {Math.max(1, totalPages)}</Text>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          icon={<ChevronRight className="h-4 w-4" />}
        />
      </Flex>
    </Flex>
  );
};

export default TablePagination;
