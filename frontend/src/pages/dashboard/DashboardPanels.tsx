// Responsibility: Render recent activity feed and active system alert notifications

import { Activity, AlertCircle } from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { SectionCard } from "@/components/common/SectionCard";
import { alertBadgeConfig } from "@/configs/status.config";
import { recentActivities, dashboardAlerts } from "./dashboard.data";

export const DashboardPanels = () => {
  return (
    <Grid cols={2} gap={6}>
      <SectionCard title="Recent Activity" icon={Activity}>
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
      </SectionCard>

      <SectionCard
        title="Active Alerts"
        icon={AlertCircle}
        iconColor="text-amber-500"
      >
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
              <Badge
                variant={alertBadgeConfig[alert.type]?.variant || "default"}
              >
                {alertBadgeConfig[alert.type]?.label || alert.type}
              </Badge>
            </Flex>
          ))}
        </Box>
      </SectionCard>
    </Grid>
  );
};
