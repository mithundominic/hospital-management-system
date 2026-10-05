// Responsibility: Clinical analytics tab with doctor performance metrics

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Box } from "@/components/ui/Box";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { DataTableHeader } from "@/components/common/DataTableHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";
import { ClinicalAnalytics } from "../analytics.types";
import { CHART_COLORS } from "../analytics.config";

const DOCTOR_PERFORMANCE_COLUMNS = [
  { key: "name", header: "Doctor Name" },
  { key: "department", header: "Department" },
  { key: "patients", header: "Patients Seen" },
  { key: "encounters", header: "Encounters" },
  { key: "revenue", header: "Revenue Generated" },
] as const;

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
        <Table containerClassName="max-h-[300px] overflow-auto">
          <DataTableHeader columns={DOCTOR_PERFORMANCE_COLUMNS} />
          <TableBody>
            {data.doctor_performance.map((doctor) => (
              <TableRow key={doctor.doctor_id}>
                <TableCell>{doctor.doctor_name}</TableCell>
                <TableCell>{doctor.department || "N/A"}</TableCell>
                <TableCell>{doctor.patient_count}</TableCell>
                <TableCell>{doctor.encounter_count}</TableCell>
                <TableCell>₹{doctor.revenue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
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
