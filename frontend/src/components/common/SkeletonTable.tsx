// Responsibility: Render table skeleton placeholder loaders with configurable rows and columns

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Box } from "@/components/ui/Box";

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable = ({
  rows = 5,
  columns = 4,
}: SkeletonTableProps) => {
  return (
    <Table className="animate-pulse">
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index}>
              <Box className="h-4 bg-gray-200 rounded w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Box className="h-4 bg-gray-200 rounded w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SkeletonTable;
