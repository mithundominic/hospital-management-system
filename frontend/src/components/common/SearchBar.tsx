// Responsibility: Reusable card-wrapped search input for filtering table and directory records

import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  noCard?: boolean;
}

export const SearchBar = ({
  placeholder = "Search records...",
  value,
  onChange,
  className,
  noCard = false,
}: SearchBarProps) => {
  const input = (
    <Input
      icon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("bg-white", className)}
    />
  );

  if (noCard) {
    return input;
  }

  return <Card className="p-4">{input}</Card>;
};

export default SearchBar;
