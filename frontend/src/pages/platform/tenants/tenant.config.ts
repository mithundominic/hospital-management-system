// Responsibility: Tenant management configuration and constants

import type { TenantStatus, LifecycleEventType } from "@/types/platform";
import type { BadgeVariant } from "@/components/ui/Badge";

export const STATUS_CONFIG: Record<
  TenantStatus,
  { label: string; variant: BadgeVariant }
> = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "warning" },
  archived: { label: "Archived", variant: "danger" },
};

export const EVENT_TYPE_CONFIG: Record<LifecycleEventType, string> = {
  created: "Created",
  activated: "Activated",
  suspended: "Suspended",
  reactivated: "Reactivated",
  archived: "Archived",
  deleted: "Deleted",
};

export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Kolkata", label: "IST (Asia/Kolkata)" },
  { value: "America/New_York", label: "EST (New York)" },
  { value: "Europe/London", label: "GMT (London)" },
] as const;

export const LOCALE_OPTIONS = [
  { value: "en-US", label: "English (US)" },
  { value: "en-IN", label: "English (India)" },
  { value: "hi-IN", label: "Hindi (India)" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
] as const;
