// Responsibility: Bed utilization KPI summary cards

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";
import { BedUtilization } from "../analytics.types";

interface BedUtilizationKPIsProps {
  data: BedUtilization;
}

export const BedUtilizationKPIs = ({ data }: BedUtilizationKPIsProps) => (
  <Grid cols={3} gap={6}>
    <Card className="p-6">
      <Heading level={3} className="mb-2">Total Beds</Heading>
      <Box className="text-3xl font-bold">{data.total_beds}</Box>
    </Card>
    <Card className="p-6">
      <Heading level={3} className="mb-2">Occupied</Heading>
      <Box className="text-3xl font-bold text-orange-600">
        {data.occupied_beds}
      </Box>
    </Card>
    <Card className="p-6">
      <Heading level={3} className="mb-2">Occupancy Rate</Heading>
      <Box className="text-3xl font-bold text-blue-600">
        {data.occupancy_rate}%
      </Box>
    </Card>
  </Grid>
);
