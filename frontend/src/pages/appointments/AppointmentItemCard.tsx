// Responsibility: Render single appointment item card in timeline view

import { format } from 'date-fns';
import { Clock, User, Edit, XCircle } from 'lucide-react';
import { Box } from '@/components/ui/Box';
import { Flex } from '@/components/ui/Flex';
import { Text } from '@/components/ui/Text';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Appointment } from '@/types';

export interface AppointmentItemCardProps {
  apt: Appointment & { patient?: { full_name: string; phone?: string } };
  onEdit: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
}

const statusVariants: Record<string, BadgeVariant> = {
  scheduled: 'info',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'default',
};

export const AppointmentItemCard = ({ apt, onEdit, onCancel }: AppointmentItemCardProps) => {
  return (
    <Flex align="start" gap={4} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <Box className="text-center min-w-[80px]">
        <Clock className="h-4 w-4 mx-auto text-gray-400 mb-1" />
        <Text size="sm" weight="medium">
          {format(new Date(apt.scheduled_at), 'HH:mm')}
        </Text>
      </Box>

      <Box className="flex-1">
        <Flex align="center" gap={3}>
          <Text weight="semibold" size="base">
            {apt.patient?.full_name || 'Patient'}
          </Text>
          <Badge variant={statusVariants[apt.status] || 'default'}>
            {apt.status}
          </Badge>
        </Flex>

        {apt.reason && (
          <Text size="sm" variant="muted" className="mt-1">
            Reason: {apt.reason}
          </Text>
        )}

        <Flex align="center" gap={2} className="mt-2 text-gray-500">
          <User className="h-4 w-4" />
          <Text size="xs" variant="muted">
            Duration: {apt.duration_minutes} mins
          </Text>
        </Flex>
      </Box>

      {apt.status !== 'cancelled' && (
        <Flex gap={2}>
          <Button variant="ghost" size="sm" onClick={() => onEdit(apt)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onCancel(apt)} className="text-red-500 hover:text-red-700">
            <XCircle className="h-4 w-4" />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
