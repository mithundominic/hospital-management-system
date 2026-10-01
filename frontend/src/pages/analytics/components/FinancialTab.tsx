// Responsibility: Financial analytics tab with revenue charts

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";
import { FinancialAnalytics } from "../analytics.types";
import { CHART_COLORS } from "../analytics.config";

interface FinancialTabProps {
  hospitalId: string;
  startDate: string;
  endDate: string;
}

export const FinancialTab = ({
  hospitalId,
  startDate,
  endDate,
}: FinancialTabProps) => {
  const { data, isLoading } = useAnalytics<FinancialAnalytics>(
    hospitalId,
    "financial",
    startDate,
    endDate,
  );

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!data) return null;

  const paymentColors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
  ];

  return (
    <Box className="space-y-6">
      <Grid cols={3} gap={6}>
        <Card className="p-6">
          <Heading level={3} className="mb-2">
            Total Revenue
          </Heading>
          <Box className="text-3xl font-bold text-primary-600">
            ₹{data.total_revenue.toLocaleString()}
          </Box>
        </Card>
        <Card className="p-6">
          <Heading level={3} className="mb-2">
            Collected
          </Heading>
          <Box className="text-3xl font-bold text-green-600">
            ₹{data.total_collected.toLocaleString()}
          </Box>
        </Card>
        <Card className="p-6">
          <Heading level={3} className="mb-2">
            Outstanding
          </Heading>
          <Box className="text-3xl font-bold text-orange-600">
            ₹{data.total_outstanding.toLocaleString()}
          </Box>
        </Card>
      </Grid>

      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Revenue Trend
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.revenue_by_day}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={CHART_COLORS.primary}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Payment Methods
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.payment_by_method}
              dataKey="amount"
              nameKey="method"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.payment_by_method.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={paymentColors[index % paymentColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};
