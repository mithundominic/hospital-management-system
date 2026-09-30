// Responsibility: Section displaying core clinical and operational modules of the SaaS

import { Stethoscope } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { CLINICAL_MODULES } from "../home.data";
import { HomeModuleCard } from "./HomeModuleCard";

export const HomeModules = () => {
  return (
    <Box id="modules" className="py-16 sm:py-20 bg-gray-50 border-y border-gray-200/60">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box className="text-center max-w-3xl mx-auto mb-12">
          <Flex justify="center" className="mb-3">
            <Badge variant="purple" size="sm" className="px-3 py-1 flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 text-purple-600" />
              Comprehensive Healthcare Suite
            </Badge>
          </Flex>
          <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Integrated Clinical & Hospital Workflows
          </Heading>
          <Text size="base" variant="muted" className="mt-4">
            From patient intake and bed assignments to diagnostic reports, pharmaceutical dispensing,
            and split GST billing, every department operates on unified real-time data.
          </Text>
        </Box>

        <Grid cols={3} gap={6}>
          {CLINICAL_MODULES.map((mod) => (
            <HomeModuleCard key={mod.id} module={mod} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
