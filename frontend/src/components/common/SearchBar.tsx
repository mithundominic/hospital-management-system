// Responsibility: Reusable card-wrapped search input for filtering table and directory records

import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchBar = ({
  placeholder = "Search records...",
  value,
  onChange,
  className,
}: SearchBarProps) => (
  <Card className="p-4">
    <Input
      icon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  </Card>
);

export default SearchBar;
