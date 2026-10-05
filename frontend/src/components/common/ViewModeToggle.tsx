// Responsibility: Segmented toggle button control for switching between table and card view modes
import { LayoutGrid, Table2 } from "lucide-react";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types/table.types";

export interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export const ViewModeToggle = ({
  viewMode,
  onChange,
  className,
}: ViewModeToggleProps) => (
  <Flex
    align="center"
    className={cn(
      "bg-gray-100 p-0.5 rounded-lg border border-gray-200 shrink-0",
      className,
    )}
  >
    <Button
      variant={viewMode === "table" ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "h-8 px-2.5 text-xs font-medium rounded-md transition-all shadow-none",
        viewMode === "table"
          ? "bg-white text-primary-700 shadow-xs border-gray-200"
          : "text-gray-500 hover:text-gray-900 border-transparent",
      )}
      onClick={() => onChange("table")}
      icon={<Table2 className="h-4 w-4" />}
      aria-label="Table view"
      title="Table view"
    />
    <Button
      variant={viewMode === "cards" ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "h-8 px-2.5 text-xs font-medium rounded-md transition-all shadow-none",
        viewMode === "cards"
          ? "bg-white text-primary-700 shadow-xs border-gray-200"
          : "text-gray-500 hover:text-gray-900 border-transparent",
      )}
      onClick={() => onChange("cards")}
      icon={<LayoutGrid className="h-4 w-4" />}
      aria-label="Cards view"
      title="Cards view"
    />
  </Flex>
);

export default ViewModeToggle;
