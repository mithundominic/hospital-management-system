// Responsibility: Render staff distribution pie chart

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/ChartContainer";

interface Props {
  data: Array<{ role: string; count: number }>;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export const StaffDistributionChart = ({ data }: Props) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="role"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={(entry) => `${entry.role}: ${entry.count}`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
