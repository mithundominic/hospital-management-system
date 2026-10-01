// Responsibility: Operational analytics tab with patient flow and appointment metrics

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";
import { OperationalAnalytics } from "../analytics.types";
import { CHART_COLORS, STATUS_COLORS } from "../analytics.config";

interface OperationalTabProps {
  hospitalId: string;
  startDate: string;
  endDate: string;
}

export const OperationalTab = ({
  hospitalId,
  startDate,
  endDate,
}: OperationalTabProps) => {
  const { data, isLoading } = useAnalytics<OperationalAnalytics>(
    hospitalId,
    "operational",
    startDate,
    endDate,
  );

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!data) return null;

  const appointmentData = data.appointments_by_status.map((item) => ({
    ...item,
    fill: STATUS_COLORS[item.status] || CHART_COLORS.primary,
  }));

  return (
    <Box className="space-y-6">
      <Grid cols={3} gap={6}>
        <Card className="p-6">
          <Heading level={3} className="mb-2">
            Total Beds
          </Heading>
          <Box className="text-3xl font-bold">
            {data.bed_utilization.total_beds}
          </Box>
        </Card>
        <Card className="p-6">
          <Heading level={3} className="mb-2">
            Occupied
          </Heading>
          <Box className="text-3xl font-bold text-orange-600">
            {data.bed_utilization.occupied_beds}
          </Box>
        </Card>
        <Card className="p-6">
          <Heading level={3} className="mb-2">
            Occupancy Rate
          </Heading>
          <Box className="text-3xl font-bold text-blue-600">
            {data.bed_utilization.occupancy_rate}%
          </Box>
        </Card>
      </Grid>

      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Patient Flow
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.patient_flow}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="new_patients"
              stroke={CHART_COLORS.success}
              name="New Patients"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <Heading level={3} className="mb-4">
          Appointments by Status
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={appointmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={CHART_COLORS.primary} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};
