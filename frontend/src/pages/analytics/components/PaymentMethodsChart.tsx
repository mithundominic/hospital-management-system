// Responsibility: Pie chart visualization for payment methods distribution

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "../analytics.config";
import { PaymentByMethod } from "../analytics.types";

interface PaymentMethodsChartProps {
  data: PaymentByMethod[];
}

const PAYMENT_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
];

export const PaymentMethodsChart = ({ data }: PaymentMethodsChartProps) => {
  return (
    <Card className="p-6">
      <Heading level={3} className="mb-4">
        Payment Methods
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="method"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
