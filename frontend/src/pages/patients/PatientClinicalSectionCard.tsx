// Responsibility: Render clinical record section card with header icon and content/empty state

import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export interface PatientClinicalSectionCardProps {
  icon: LucideIcon;
  title: string;
  emptyText?: string;
  children?: ReactNode;
}

export const PatientClinicalSectionCard = ({
  icon: Icon,
  title,
  emptyText,
  children,
}: PatientClinicalSectionCardProps) => (
  <Card className="p-6">
    <Flex align="center" gap={2} className="mb-4">
      <Icon className="h-5 w-5 text-primary-600" />
      <Heading level={3} className="text-lg font-semibold text-gray-900">
        {title}
      </Heading>
    </Flex>
    {children || (
      <Text size="sm" variant="muted">
        {emptyText}
      </Text>
    )}
  </Card>
);

export default PatientClinicalSectionCard;
