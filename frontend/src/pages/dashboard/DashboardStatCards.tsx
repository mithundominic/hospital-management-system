// Responsibility: Render the 4 key KPI metric cards at the top of the dashboard

import { Users, Calendar, Bed, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import type { DashboardStats } from "./dashboard.data";

export interface DashboardStatCardsProps {
  stats: DashboardStats;
}

export const DashboardStatCards = ({ stats }: DashboardStatCardsProps) => {
  const cards = [
    {
      name: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      name: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "bg-green-500",
      change: "+5%",
    },
    {
      name: "Bed Occupancy",
      value: `${stats.occupiedBeds}/${stats.totalBeds}`,
      icon: Bed,
      color: "bg-purple-500",
      change: "75%",
    },
    {
      name: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "bg-amber-500",
      change: "+8%",
    },
  ];

  return (
    <Grid cols={4} gap={6}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.name} className="p-6">
            <Flex align="center" justify="between">
              <Box>
                <Text size="sm" weight="medium" variant="muted">
                  {card.name}
                </Text>
                <Text size="xl" weight="bold" className="mt-2 text-3xl">
                  {card.value}
                </Text>
                <Flex align="center" gap={1} className="mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <Text size="xs" className="text-green-600">
                    {card.change} from last week
                  </Text>
                </Flex>
              </Box>
              <Box className={`${card.color} p-3 rounded-lg text-white`}>
                <Icon className="h-6 w-6" />
              </Box>
            </Flex>
          </Card>
        );
      })}
    </Grid>
  );
};
