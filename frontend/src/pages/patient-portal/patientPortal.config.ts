// Responsibility: Configuration objects for patient portal UI rendering

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
type LabStatus = "pending" | "completed" | "cancelled";

export const appointmentStatusConfig: Record<
  AppointmentStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "yellow" },
  confirmed: { label: "Confirmed", color: "blue" },
  completed: { label: "Completed", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
};

export const labResultStatusConfig: Record<
  LabStatus,
  { label: string; indicator: string }
> = {
  pending: { label: "Pending", indicator: "text-yellow-600" },
  completed: { label: "Completed", indicator: "text-green-600" },
  cancelled: { label: "Cancelled", indicator: "text-red-600" },
};

export const prescriptionFrequencyDisplay: Record<string, string> = {
  "1x": "Once daily",
  "2x": "Twice daily",
  "3x": "Three times daily",
  "4x": "Four times daily",
  prn: "As needed",
};
