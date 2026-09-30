// Responsibility: Display platform-wide statistics in card grid
 
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Grid";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { PLATFORM_STATS } from "./platform.config";
import type { PlatformAnalytics } from "@/types/platform";

interface PlatformStatCardsProps {
  analytics: PlatformAnalytics | undefined;
  isLoading: boolean;
}

export const PlatformStatCards = ({
  analytics,
  isLoading,
}: PlatformStatCardsProps) => {
  if (isLoading) {
    return (
      <Grid cols={5} gap={4}>
        {PLATFORM_STATS.map((stat) => (
          <Card key={stat.id} className="p-6 animate-pulse">
            <Box className="h-12 bg-gray-200 rounded" />
          </Card>
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={5} gap={4}>
      {PLATFORM_STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.id} className="p-6">
            <Flex direction="col" gap={2}>
              <Flex align="center" gap={2}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <Text size="sm" variant="muted">{stat.label}</Text>
              </Flex>
              <Heading level={4} className="text-3xl font-bold">{stat.getValue(analytics)}</Heading>
            </Flex>
          </Card>
        );
      })}
    </Grid>
  );
};
