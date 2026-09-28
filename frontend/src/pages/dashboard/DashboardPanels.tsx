// Responsibility: Render recent activity feed and active system alert notifications

import { Activity, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { recentActivities, dashboardAlerts } from "./dashboard.data";

const alertVariantMap = {
  warning: "warning",
  urgent: "danger",
  info: "info",
} as const;

export const DashboardPanels = () => {
  return (
    <Grid cols={2} gap={6}>
      <Card className="p-6">
        <Flex align="center" gap={2} className="mb-4">
          <Activity className="h-5 w-5 text-primary-600" />
          <Heading level={3} className="text-lg font-semibold text-gray-900">
            Recent Activity
          </Heading>
        </Flex>
        <Box className="space-y-3">
          {recentActivities.map((act) => (
            <Flex
              key={act.action + act.time}
              justify="between"
              align="center"
              className="p-3 bg-gray-50 rounded-lg"
            >
              <Box>
                <Text weight="medium" size="sm">
                  {act.action}
                </Text>
                <Text size="xs" variant="muted">
                  Patient: {act.patient}
                </Text>
              </Box>
              <Text size="xs" variant="caption">
                {act.time}
              </Text>
            </Flex>
          ))}
        </Box>
      </Card>

      <Card className="p-6">
        <Flex align="center" gap={2} className="mb-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <Heading level={3} className="text-lg font-semibold text-gray-900">
            Active Alerts
          </Heading>
        </Flex>
        <Box className="space-y-3">
          {dashboardAlerts.map((alert) => (
            <Flex
              key={alert.message}
              align="center"
              justify="between"
              className="p-3 border border-gray-200 rounded-lg"
            >
              <Text size="sm" className="flex-1 mr-3">
                {alert.message}
              </Text>
              <Badge variant={alertVariantMap[alert.type]}>{alert.type}</Badge>
            </Flex>
          ))}
        </Box>
      </Card>
    </Grid>
  );
};
