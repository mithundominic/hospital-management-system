// Responsibility: Card displaying an architectural, security, or compliance feature

import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import type { PlatformFeature } from "../home.types";

export interface HomeFeatureCardProps {
  feature: PlatformFeature;
}

export const HomeFeatureCard = ({ feature }: HomeFeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <Card className="border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
      <CardContent className="p-6">
        <Flex align="center" justify="between" className="mb-4">
          <Flex align="center" justify="center" className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600">
            <Icon className="h-5 w-5" />
          </Flex>
          <Badge variant="success" size="sm">
            {feature.badgeText}
          </Badge>
        </Flex>
        <Heading level={3} className="text-lg font-bold text-gray-900 mb-2">
          {feature.title}
        </Heading>
        <Text size="sm" variant="muted" className="leading-relaxed">
          {feature.description}
        </Text>
      </CardContent>
    </Card>
  );
};
