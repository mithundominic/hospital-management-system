// Responsibility: Financial analytics tab with revenue charts

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Box } from "@/components/ui/Box";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  LineChart,
  Line,
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
import { FinancialKPIs } from "./FinancialKPIs";
import { PaymentMethodsChart } from "./PaymentMethodsChart";

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

  return (
    <Box className="space-y-6">
      <FinancialKPIs
        totalRevenue={data.total_revenue}
        totalCollected={data.total_collected}
        totalOutstanding={data.total_outstanding}
      />

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

      <PaymentMethodsChart data={data.payment_by_method} />
    </Box>
  );
};
