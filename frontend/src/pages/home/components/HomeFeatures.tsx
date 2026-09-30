// Responsibility: Section presenting platform security, ABDM readiness, and architecture

import { ShieldCheck } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { PLATFORM_FEATURES } from "../home.data";
import { HomeFeatureCard } from "./HomeFeatureCard";

export const HomeFeatures = () => {
  return (
    <Box id="features" className="py-16 sm:py-20 bg-white">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box className="text-center max-w-3xl mx-auto mb-12">
          <Flex justify="center" className="mb-3">
            <Badge variant="success" size="sm" className="px-3 py-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Enterprise Standards
            </Badge>
          </Flex>
          <Heading level={2} className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Security, Compliance & Multi-Tenancy by Default
          </Heading>
          <Text size="base" variant="muted" className="mt-4">
            Engineered with strict tenant isolation, immutable clinical and financial ledgers,
            and complete ABDM / DPDP compliance readiness.
          </Text>
        </Box>

        <Grid cols={4} gap={6}>
          {PLATFORM_FEATURES.map((feature) => (
            <HomeFeatureCard key={feature.id} feature={feature} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
