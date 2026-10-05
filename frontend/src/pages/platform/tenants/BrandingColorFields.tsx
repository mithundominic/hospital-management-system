// Responsibility: Render color scheme pickers for branding configuration

import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface Props {
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  onChange: (key: "primary" | "secondary" | "accent", value: string) => void;
}

export const BrandingColorFields = ({ colorScheme, onChange }: Props) => {
  return (
    <Grid cols={3} gap={4}>
      <Box>
        <Label htmlFor="primary">Primary Color</Label>
        <Input
          id="primary"
          type="color"
          value={colorScheme.primary}
          onChange={(e) => onChange("primary", e.target.value)}
        />
      </Box>

      <Box>
        <Label htmlFor="secondary">Secondary Color</Label>
        <Input
          id="secondary"
          type="color"
          value={colorScheme.secondary}
          onChange={(e) => onChange("secondary", e.target.value)}
        />
      </Box>

      <Box>
        <Label htmlFor="accent">Accent Color</Label>
        <Input
          id="accent"
          type="color"
          value={colorScheme.accent}
          onChange={(e) => onChange("accent", e.target.value)}
        />
      </Box>
    </Grid>
  );
};
