// Responsibility: Primitive tab navigation component wrapping raw button and nav elements

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  items?: readonly TabItem<T>[] | TabItem<T>[];
  tabs?: readonly TabItem<T>[] | TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
  variant?: "underline" | "pills";
}

export const Tabs = <T extends string>({
  items,
  tabs,
  activeTab,
  onChange,
  className,
  variant = "underline",
}: TabsProps<T>) => {
  const tabList = items || tabs || [];

  return (
    <nav
      className={cn("flex space-x-2 border-b border-gray-200", className)}
      aria-label="Tabs"
    >
      {tabList.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 disabled:opacity-50",
              isActive
                ? "border-primary-600 text-primary-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              variant === "pills" &&
                isActive &&
                "bg-primary-50 rounded-md border-transparent",
              variant === "pills" &&
                !isActive &&
                "rounded-md border-transparent hover:bg-gray-100",
            )}
          >
            {tab.icon && <span className="h-4 w-4 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span className="ml-1 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default Tabs;
