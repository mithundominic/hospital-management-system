// Responsibility: Render date picker filter and appointment count card

import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";

export interface AppointmentsDateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  count: number;
}

export const AppointmentsDateFilter = ({
  selectedDate,
  onDateChange,
  count,
}: AppointmentsDateFilterProps) => (
  <Card className="p-4">
    <Flex align="center" gap={4}>
      <Calendar className="h-5 w-5 text-gray-400" />
      <Input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="max-w-xs"
      />
      <Text size="sm" variant="muted">
        {count} appointments scheduled
      </Text>
    </Flex>
  </Card>
);
