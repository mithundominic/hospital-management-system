// Responsibility: Financial KPI summary cards

import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Grid } from "@/components/ui/Grid";
import { Box } from "@/components/ui/Box";

interface FinancialKPIsProps {
  totalRevenue: number;
  totalCollected: number;
  totalOutstanding: number;
}

export const FinancialKPIs = ({
  totalRevenue,
  totalCollected,
  totalOutstanding,
}: FinancialKPIsProps) => (
  <Grid cols={3} gap={6}>
    <Card className="p-6">
      <Heading level={3} className="mb-2">Total Revenue</Heading>
      <Box className="text-3xl font-bold text-primary-600">
        ₹{totalRevenue.toLocaleString()}
      </Box>
    </Card>
    <Card className="p-6">
      <Heading level={3} className="mb-2">Collected</Heading>
      <Box className="text-3xl font-bold text-green-600">
        ₹{totalCollected.toLocaleString()}
      </Box>
    </Card>
    <Card className="p-6">
      <Heading level={3} className="mb-2">Outstanding</Heading>
      <Box className="text-3xl font-bold text-orange-600">
        ₹{totalOutstanding.toLocaleString()}
      </Box>
    </Card>
  </Grid>
);
