// Responsibility: Patient portal dashboard overview with summary statistics

import { useNavigate } from "react-router-dom";
import { Box } from "@/components/ui/Box";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, FileText, FlaskConical } from "lucide-react";
import {
  useMyAppointments,
  useMyLabResults,
  useMyPrescriptions,
} from "./hooks/usePatientPortal";

export const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const { data: appointments } = useMyAppointments();
  const { data: labResults } = useMyLabResults();
  const { data: prescriptions } = useMyPrescriptions();

  const upcomingAppointments =
    appointments?.filter(
      (a) =>
        new Date(a.appointment_date) >= new Date() && a.status !== "cancelled",
    ).length ?? 0;

  const recentLabResults = labResults?.slice(0, 5).length ?? 0;
  const activePrescriptions = prescriptions?.length ?? 0;

  return (
    <Box className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Patient Portal</h1>

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <Box className="flex items-center gap-4">
            <Calendar className="w-10 h-10 text-blue-600" />
            <Box>
              <p className="text-3xl font-bold">{upcomingAppointments}</p>
              <p className="text-sm text-gray-600">Upcoming Appointments</p>
            </Box>
          </Box>
          <Button
            onClick={() => navigate("/patient-portal/appointments")}
            className="mt-4 w-full"
            variant="outline"
          >
            View Appointments
          </Button>
        </Card>

        <Card className="p-6">
          <Box className="flex items-center gap-4">
            <FlaskConical className="w-10 h-10 text-green-600" />
            <Box>
              <p className="text-3xl font-bold">{recentLabResults}</p>
              <p className="text-sm text-gray-600">Recent Lab Results</p>
            </Box>
          </Box>
          <Button
            onClick={() => navigate("/patient-portal/lab-results")}
            className="mt-4 w-full"
            variant="outline"
          >
            View Lab Results
          </Button>
        </Card>

        <Card className="p-6">
          <Box className="flex items-center gap-4">
            <FileText className="w-10 h-10 text-purple-600" />
            <Box>
              <p className="text-3xl font-bold">{activePrescriptions}</p>
              <p className="text-sm text-gray-600">Active Prescriptions</p>
            </Box>
          </Box>
          <Button
            onClick={() => navigate("/patient-portal/prescriptions")}
            className="mt-4 w-full"
            variant="outline"
          >
            View Prescriptions
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default PatientDashboardPage;
