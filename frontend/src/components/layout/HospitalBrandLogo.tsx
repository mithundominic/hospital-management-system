// Responsibility: Render hospital logo image with monogram or medical icon fallback

import { Hospital } from "lucide-react";
import { Box } from "@/components/ui/Box";
import { Flex } from "@/components/ui/Flex";
import { Text } from "@/components/ui/Text";
import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/utils";

interface HospitalBrandLogoProps {
  logoUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
} as const;

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

const getInitials = (name?: string): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const HospitalBrandLogo = ({
  logoUrl,
  name,
  size = "md",
  className,
}: HospitalBrandLogoProps) => {
  if (logoUrl) {
    return (
      <Box
        className={cn(
          "rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-50 border border-gray-100",
          sizeClasses[size],
          className,
        )}
      >
        <Image src={logoUrl} alt={name || "Hospital logo"} className="h-full w-full object-contain" />
      </Box>
    );
  }

  const initials = getInitials(name);

  if (initials) {
    return (
      <Flex
        align="center"
        justify="center"
        className={cn(
          "rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold tracking-wider shrink-0 shadow-sm",
          sizeClasses[size],
          className,
        )}
      >
        <Text size="xs" className="text-white font-bold leading-none">
          {initials}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      align="center"
      justify="center"
      className={cn(
        "rounded-lg bg-primary-50 text-primary-600 shrink-0",
        sizeClasses[size],
        className,
      )}
    >
      <Hospital className={iconSizes[size]} />
    </Flex>
  );
};
