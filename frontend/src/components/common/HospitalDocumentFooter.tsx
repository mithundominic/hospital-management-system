// Responsibility: Standardized document footer with signature line, emergency helpline, and disclaimers

import { useHospital } from "@/contexts/useHospital";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";

export interface HospitalDocumentFooterProps {
  signatoryTitle?: string;
  disclaimerText?: string;
  showEmergencyNotice?: boolean;
}

export const HospitalDocumentFooter = ({
  signatoryTitle = "Authorized Signatory",
  disclaimerText,
  showEmergencyNotice = true,
}: HospitalDocumentFooterProps) => {
  const { currentHospital } = useHospital();

  const helpline = currentHospital?.phone || "Casualty Desk / 108";

  return (
    <Box className="mt-8 pt-4 border-t border-gray-200">
      <Flex justify="between" align="end" gap={6}>
        <Box className="max-w-md space-y-1">
          {showEmergencyNotice && (
            <Text size="xs" weight="medium" className="text-red-700">
              24x7 Emergency / Casualty Helpline: {helpline}
            </Text>
          )}
          {disclaimerText && (
            <Text size="xs" variant="muted" className="leading-relaxed">
              {disclaimerText}
            </Text>
          )}
          <Text size="xs" variant="caption" className="text-gray-400 block pt-1">
            Generated via {currentHospital?.name || "HMS Portal"}. This is an authentic digital medical record.
          </Text>
        </Box>

        <Box className="text-center shrink-0 min-w-[180px]">
          <Box className="border-b border-gray-400 h-10 mb-1" />
          <Text size="xs" weight="medium" className="text-gray-800">
            {signatoryTitle}
          </Text>
          <Text size="xs" variant="caption" className="text-gray-400">
            Seal & Signature
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default HospitalDocumentFooter;
