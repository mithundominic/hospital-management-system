// Responsibility: Render the weekly revenue bar chart and daily appointment trends line chart

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { weeklyRevenueData, todayAppointmentData } from "./dashboard.data";

export const DashboardCharts = () => {
  return (
    <Grid cols={2} gap={6}>
      <Card className="p-6">
        <Heading level={3} className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Revenue
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <Heading level={3} className="text-lg font-semibold text-gray-900 mb-4">
          Today's Appointments
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={todayAppointmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Grid>
  );
};
