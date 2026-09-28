// Responsibility: Main staff shifts scheduling page with weekly roster timetable view

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { ShiftsScheduleTable } from "./ShiftsScheduleTable";
import { ShiftFormModal } from "./ShiftFormModal";
import type { Shift } from "@/types";

export const ShiftsPage = () => {
  const { currentHospital } = useHospital();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [showModal, setShowModal] = useState(false);

  const {
    data: shifts = [],
    isLoading,
    refetch,
  } = useQuery<Shift[]>({
    queryKey: QUERY_KEYS.hospitals.shifts(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await api.get<Shift[]>(API_ROUTES.hospitals.shifts(currentHospital.id));
    },
    enabled: !!currentHospital,
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Staff Shifts"
        description="Manage staff scheduling and duty roster"
        action={
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus className="h-5 w-5" />}
          >
            Create Shift
          </Button>
        }
      />

      <Flex
        align="center"
        justify="between"
        className="bg-white p-4 rounded-lg border border-gray-200"
      >
        <Heading level={3} className="text-base font-semibold">
          Weekly Schedule
        </Heading>
        <Flex align="center" gap={2} className="text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4" />
          <Text size="sm">Week of {format(weekStart, "MMM d, yyyy")}</Text>
        </Flex>
      </Flex>

      <ShiftsScheduleTable
        shifts={shifts}
        weekDays={weekDays}
        isLoading={isLoading}
      />

      {showModal && (
        <ShiftFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Box>
  );
};

export default ShiftsPage;
