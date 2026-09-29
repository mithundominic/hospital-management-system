// Responsibility: Callout alert card for notifications, warnings, and informational notices

import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Flex } from "@/components/ui/Flex";
import { Box } from "@/components/ui/Box";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export type NoticeVariant = "info" | "warning" | "danger" | "success";

const noticeStyles: Record<
  NoticeVariant,
  {
    card: string;
    text: string;
    icon: typeof Info;
    title: string;
  }
> = {
  warning: {
    card: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    title: "text-amber-900",
    icon: AlertTriangle,
  },
  info: {
    card: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    title: "text-blue-900",
    icon: Info,
  },
  danger: {
    card: "bg-red-50 border-red-200",
    text: "text-red-800",
    title: "text-red-900",
    icon: AlertCircle,
  },
  success: {
    card: "bg-green-50 border-green-200",
    text: "text-green-800",
    title: "text-green-900",
    icon: CheckCircle,
  },
};

export interface NoticeCardProps {
  variant?: NoticeVariant;
  title?: string;
  description: ReactNode;
  className?: string;
}

export const NoticeCard = ({
  variant = "info",
  title,
  description,
  className,
}: NoticeCardProps) => {
  const s = noticeStyles[variant];
  const Icon = s.icon;

  return (
    <Card className={cn("p-4", s.card, className)}>
      <Flex align="start" gap={3}>
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", s.text)} />
        <Box>
          {title && (
            <Heading level={4} className={cn("font-semibold text-sm", s.title)}>
              {title}
            </Heading>
          )}
          <Text size="sm" className={cn(s.text, title ? "mt-1" : "")}>
            {description}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default NoticeCard;
