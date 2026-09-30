// Responsibility: Card component rendering a single clinical module highlight

import { CheckCircle2 } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import type { ClinicalModule } from "../home.types";

export interface HomeModuleCardProps {
  module: ClinicalModule;
}

export const HomeModuleCard = ({ module }: HomeModuleCardProps) => {
  const Icon = module.icon;

  return (
    <Card className="h-full border-gray-200 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between">
      <CardContent className="p-6 flex-1 flex flex-col">
        <Flex align="center" justify="between" className="mb-4">
          <Flex align="center" justify="center" className="h-12 w-12 rounded-lg bg-primary-100 text-primary-700">
            <Icon className="h-6 w-6" />
          </Flex>
          <Badge variant="info" size="sm">
            {module.badge}
          </Badge>
        </Flex>

        <Box className="mb-4 flex-1">
          <Heading level={3} className="text-xl font-bold text-gray-900 mb-1">
            {module.title}
          </Heading>
          <Text size="xs" weight="medium" className="text-primary-600 mb-2">
            {module.tagline}
          </Text>
          <Text size="sm" variant="muted" className="leading-relaxed">
            {module.description}
          </Text>
        </Box>

        <Box className="pt-4 border-t border-gray-100 space-y-2 mt-auto">
          {module.features.map((feature) => (
            <Flex key={feature} align="center" gap={2}>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <Text size="xs" className="text-gray-700 font-medium">
                {feature}
              </Text>
            </Flex>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
