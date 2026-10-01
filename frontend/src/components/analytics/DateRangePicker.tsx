// Responsibility: Date range picker with preset buttons and custom date inputs

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { DATE_RANGE_PRESETS } from "@/pages/analytics/analytics.config";
import { DateRange } from "@/pages/analytics/analytics.types";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  selectedPreset?: string;
  onPresetChange?: (presetId: string) => void;
}

export const DateRangePicker = ({
  value,
  onChange,
  selectedPreset = "last30days",
  onPresetChange,
}: DateRangePickerProps) => {
  const handlePresetClick = (presetId: string) => {
    onPresetChange?.(presetId);
    if (presetId !== "custom") {
      const preset = DATE_RANGE_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        onChange(preset.getValue());
      }
    }
  };

  return (
    <Box>
      <Flex gap={2} wrap className="mb-4">
        {DATE_RANGE_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant={selectedPreset === preset.id ? "primary" : "outline"}
            size="sm"
            onClick={() => handlePresetClick(preset.id)}
          >
            {preset.label}
          </Button>
        ))}
      </Flex>
      {selectedPreset === "custom" && (
        <Flex gap={4}>
          <Input
            type="date"
            label="Start Date"
            value={value.startDate}
            onChange={(e) => onChange({ ...value, startDate: e.target.value })}
            icon={<Calendar className="h-4 w-4" />}
          />
          <Input
            type="date"
            label="End Date"
            value={value.endDate}
            onChange={(e) => onChange({ ...value, endDate: e.target.value })}
            icon={<Calendar className="h-4 w-4" />}
          />
        </Flex>
      )}
    </Box>
  );
};
