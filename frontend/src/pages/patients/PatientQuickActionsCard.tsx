// Responsibility: Render quick action navigation buttons for patient profile

import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";

export const PatientQuickActionsCard = () => (
  <Card className="p-6">
    <Heading level={3} className="text-lg font-semibold text-gray-900 mb-4">
      Quick Actions
    </Heading>
    <Box className="space-y-2">
      <Button className="w-full">Book Appointment</Button>
      <Button variant="secondary" className="w-full">
        Create Encounter
      </Button>
      <Button variant="secondary" className="w-full">
        View Billing
      </Button>
    </Box>
  </Card>
);

export default PatientQuickActionsCard;
