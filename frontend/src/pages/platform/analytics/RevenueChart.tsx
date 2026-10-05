// Responsibility: Render time-series revenue chart using recharts

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/ChartContainer";

interface Props {
  data: Array<{ date: string; revenue: number }>;
}

export const RevenueChart = ({ data }: Props) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) => `₹${value.toFixed(2)}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
