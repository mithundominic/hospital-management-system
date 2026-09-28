// Responsibility: Render operational analytics charts for bed occupancy and daily revenue trends

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import type { BedOccupancy, RevenueData } from "@/types";

export interface ReportsChartsProps {
  bedOccupancy: BedOccupancy | null;
  revenue: RevenueData[];
}

export const ReportsCharts = ({
  bedOccupancy,
  revenue,
}: ReportsChartsProps) => {
  const occupancyData = [
    {
      name: "Occupied",
      value: bedOccupancy?.occupied_beds || 0,
      color: "#ef4444",
    },
    {
      name: "Available",
      value: bedOccupancy?.available_beds || 0,
      color: "#10b981",
    },
  ];

  return (
    <Grid cols={2} gap={6}>
      <Card className="p-6">
        <Heading level={3} className="text-lg font-semibold text-gray-900 mb-4">
          Bed Occupancy Breakdown
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={occupancyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {occupancyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <Heading level={3} className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Trend (Past 7 Days)
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_amount" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Grid>
  );
};
