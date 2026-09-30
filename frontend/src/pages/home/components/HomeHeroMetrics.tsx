// Responsibility: Highlight architectural and operational metrics on the homepage

import { Box } from "@/components/ui/Box";
import { Grid } from "@/components/ui/Grid";
import { Card, CardContent } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HERO_METRICS } from "../home.metrics";

export const HomeHeroMetrics = () => {
  return (
    <Box id="metrics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 relative z-10">
      <Grid cols={4} gap={4}>
        {HERO_METRICS.map((metric) => (
          <Card key={metric.label} className="border-gray-200/80 shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Heading level={2} className="text-3xl font-extrabold text-primary-600 mb-1">
                {metric.value}
              </Heading>
              <Text weight="semibold" size="sm" className="text-gray-900">
                {metric.label}
              </Text>
              <Text size="xs" variant="muted" className="mt-1">
                {metric.description}
              </Text>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};
