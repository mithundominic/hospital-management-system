// Responsibility: Overview tab showing key performance indicators

import {
  DollarSign,
  Users,
  Calendar,
  Bed,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Grid } from "@/components/ui/Grid";
import { KPICard } from "@/components/analytics/KPICard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAnalytics } from "../hooks/useAnalytics";
import { AnalyticsOverview } from "../analytics.types";

interface OverviewTabProps {
  hospitalId: string;
  startDate: string;
  endDate: string;
}

export const OverviewTab = ({
  hospitalId,
  startDate,
  endDate,
}: OverviewTabProps) => {
  const { data, isLoading } = useAnalytics<AnalyticsOverview>(
    hospitalId,
    "overview",
    startDate,
    endDate,
  );

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!data) return null;

  return (
    <Grid cols={3} gap={6}>
      <KPICard
        label="Total Revenue"
        value={`₹${data.total_revenue.toLocaleString()}`}
        icon={DollarSign}
      />
      <KPICard
        label="Total Patients"
        value={data.total_patients.toLocaleString()}
        icon={Users}
      />
      <KPICard
        label="Total Appointments"
        value={data.total_appointments.toLocaleString()}
        icon={Calendar}
      />
      <KPICard
        label="Bed Occupancy"
        value={`${data.bed_occupancy_rate}%`}
        icon={Bed}
      />
      <KPICard
        label="Active Prescriptions"
        value={data.active_prescriptions.toLocaleString()}
        icon={FileText}
      />
      <KPICard
        label="Pending Payments"
        value={`₹${data.pending_payments.toLocaleString()}`}
        icon={AlertCircle}
      />
    </Grid>
  );
};
