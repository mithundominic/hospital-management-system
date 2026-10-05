// Responsibility: Preview branding colors and logo using UI primitives

import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Image } from "@/components/ui/Image";

interface Props {
  logo_url?: string;
  color_scheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const SWATCH_CONFIG = [
  { label: "Primary", key: "primary" },
  { label: "Secondary", key: "secondary" },
  { label: "Accent", key: "accent" },
] as const;

export const BrandingPreview = ({ logo_url, color_scheme }: Props) => {
  return (
    <Box className="p-4 border rounded-md space-y-4">
      <Text className="text-sm font-medium">Preview</Text>

      {logo_url && (
        <Box>
          <Text className="text-xs text-gray-600 mb-2">Logo</Text>
          <Image
            src={logo_url}
            alt="Logo preview"
            className="h-16 object-contain"
          />
        </Box>
      )}

      <Box>
        <Text className="text-xs text-gray-600 mb-2">Color Scheme</Text>
        <Flex gap={2}>
          {SWATCH_CONFIG.map(({ label, key }) => (
            <Flex key={key} direction="col" align="center" gap={1}>
              <Box
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: color_scheme[key] }}
              />
              <Text className="text-xs">{label}</Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
