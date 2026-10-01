// Responsibility: Clinical analytics tab with doctor performance metrics

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Box } from "@/components/ui/Box";
import { Table } from "@/components/ui/Table";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";
import { ClinicalAnalytics } from "../analytics.types";
import { CHART_COLORS } from "../analytics.config";

interface ClinicalTabProps {
  hospitalId: string;
  startDate: string;
  endDate: string;
}

export const ClinicalTab = ({ hospitalId, startDate, endDate }: ClinicalTabProps) => {
  const { data, isLoading } = useAnalytics<ClinicalAnalytics>(
    hospitalId,
    "clinical",
    startDate,
    endDate
  );

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!data) return null;

  return (
    <Box className="space-y-6">
      <Card className="p-6">
        <Heading level={3} className="mb-4">Doctor Performance</Heading>
        <Table>
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Department</th>
              <th>Patients Seen</th>
              <th>Encounters</th>
              <th>Revenue Generated</th>
            </tr>
          </thead>
          <tbody>
            {data.doctor_performance.map((doctor) => (
              <tr key={doctor.doctor_id}>
                <td>{doctor.doctor_name}</td>
                <td>{doctor.department || "N/A"}</td>
                <td>{doctor.patient_count}</td>
                <td>{doctor.encounter_count}</td>
                <td>₹{doctor.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="p-6">
        <Heading level={3} className="mb-4">Encounter Types</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.encounter_types}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={CHART_COLORS.secondary} name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};
