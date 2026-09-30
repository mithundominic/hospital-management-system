// Responsibility: Standardized hospital letterhead header for clinical and billing documents

import { useHospital } from "@/contexts/useHospital";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { HospitalBrandLogo } from "@/components/layout/HospitalBrandLogo";

export interface HospitalLetterheadProps {
  documentTitle: string;
  documentNumber?: string;
  documentDate?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export const HospitalLetterhead = ({
  documentTitle,
  documentNumber,
  documentDate,
  badgeVariant = "info",
  className,
}: HospitalLetterheadProps) => {
  const { currentHospital } = useHospital();

  const hospitalName = currentHospital?.name || "Healthcare Medical Center";
  const addressLine = [currentHospital?.address, currentHospital?.city, currentHospital?.state]
    .filter(Boolean)
    .join(", ");
  const contactLine = [
    currentHospital?.phone ? `Ph: ${currentHospital.phone}` : null,
    currentHospital?.email ? `Email: ${currentHospital.email}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <Box className={`border-b-2 border-gray-200 pb-4 mb-4 ${className || ""}`}>
      <Flex justify="between" align="start" gap={4}>
        <Flex gap={3} align="center" className="min-w-0">
          <HospitalBrandLogo
            logoUrl={currentHospital?.logo_url}
            name={hospitalName}
            size="lg"
          />
          <Box className="min-w-0">
            <Heading level={2} className="text-xl font-bold text-gray-900 tracking-tight truncate">
              {hospitalName}
            </Heading>
            {addressLine && (
              <Text size="xs" variant="muted" className="truncate block">
                {addressLine}
              </Text>
            )}
            {contactLine && (
              <Text size="xs" variant="muted" className="truncate block">
                {contactLine}
              </Text>
            )}
          </Box>
        </Flex>

        <Box className="text-right shrink-0">
          <Badge variant={badgeVariant} className="text-xs font-bold uppercase tracking-wider mb-1">
            {documentTitle}
          </Badge>
          {documentNumber && (
            <Text size="xs" className="font-mono text-gray-700 block">
              Ref: {documentNumber}
            </Text>
          )}
          {documentDate && (
            <Text size="xs" variant="muted" className="block">
              Date: {documentDate}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default HospitalLetterhead;
