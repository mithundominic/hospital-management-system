// Responsibility: Render hospital comparison bar chart

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/ChartContainer";

interface Props {
  data: Array<{
    hospital_name: string;
    patient_count: number;
    staff_count: number;
    revenue: number;
  }>;
}

export const HospitalComparisonChart = ({ data }: Props) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hospital_name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="patient_count" fill="#3b82f6" name="Patients" />
          <Bar dataKey="staff_count" fill="#10b981" name="Staff" />
          <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
