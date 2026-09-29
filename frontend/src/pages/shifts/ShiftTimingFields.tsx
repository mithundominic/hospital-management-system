// Responsibility: Form inputs for shift timing presets and start/end timestamps

import { Grid } from "@/components/ui/Grid";
import { Flex } from "@/components/ui/Flex";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Box } from "@/components/ui/Box";
import { shiftPresets } from "./shift.types";
import type { ShiftFormData } from "./shift.types";

interface ShiftTimingFieldsProps {
  formData: ShiftFormData;
  updateField: <K extends keyof ShiftFormData>(
    field: K,
    value: ShiftFormData[K],
  ) => void;
  setPreset: (type: "morning" | "afternoon" | "night") => void;
}

export const ShiftTimingFields = ({
  formData,
  updateField,
  setPreset,
}: ShiftTimingFieldsProps) => (
  <>
    <Box>
      <Text size="xs" variant="muted" className="mb-2">
        Quick Shift Presets:
      </Text>
      <Flex gap={2}>
        {shiftPresets.map((p) => (
          <Button
            key={p.type}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(p.type)}
          >
            {p.label}
          </Button>
        ))}
      </Flex>
    </Box>

    <Grid cols={3} gap={3}>
      <Input
        label="Shift Date *"
        type="date"
        value={formData.shift_date}
        onChange={(e) => updateField("shift_date", e.target.value)}
        required
      />
      <Input
        label="Start Time *"
        type="time"
        value={formData.shift_start.slice(11, 16)}
        onChange={(e) =>
          updateField("shift_start", `${formData.shift_date}T${e.target.value}`)
        }
        required
      />
      <Input
        label="End Time *"
        type="time"
        value={formData.shift_end.slice(11, 16)}
        onChange={(e) =>
          updateField("shift_end", `${formData.shift_date}T${e.target.value}`)
        }
        required
      />
    </Grid>
  </>
);
