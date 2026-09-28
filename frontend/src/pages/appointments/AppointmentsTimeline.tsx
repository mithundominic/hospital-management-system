// Responsibility: Render chronological appointments list or skeleton/empty fallback

import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Box } from "@/components/ui/Box";
import { SkeletonTimelineItem } from "@/components/common/SkeletonList";
import { EmptyState } from "@/components/common/EmptyState";
import { AppointmentItemCard } from "./AppointmentItemCard";
import type { Appointment } from "@/types";

export interface AppointmentsTimelineProps {
  isLoading: boolean;
  appointments: Appointment[];
  onEdit: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
  onNew: () => void;
}

export const AppointmentsTimeline = ({
  isLoading,
  appointments,
  onEdit,
  onCancel,
  onNew,
}: AppointmentsTimelineProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Box className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonTimelineItem key={idx} />
          ))}
        </Box>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={Calendar}
          title="No appointments scheduled"
          description="There are no appointments scheduled for this date."
          actionLabel="Book Appointment"
          onAction={onNew}
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Box className="space-y-4">
        {appointments.map((apt) => (
          <AppointmentItemCard
            key={apt.id}
            apt={apt}
            onEdit={onEdit}
            onCancel={onCancel}
          />
        ))}
      </Box>
    </Card>
  );
};
