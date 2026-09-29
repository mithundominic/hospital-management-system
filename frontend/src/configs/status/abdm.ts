// Responsibility: ABDM status badge configurations

import type { StatusBadgeConfig } from "./types";

export const abdmLinkStatusConfig: Record<string, StatusBadgeConfig> = {
  initiated: { label: "Initiated", variant: "info" },
  otp_sent: { label: "OTP Sent", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "success" },
  failed: { label: "Failed", variant: "danger" },
  active: { label: "Active", variant: "success" },
};

export const abdmConsentStatusConfig: Record<string, StatusBadgeConfig> = {
  requested: { label: "Requested", variant: "warning" },
  granted: { label: "Granted", variant: "success" },
  denied: { label: "Denied", variant: "danger" },
  expired: { label: "Expired", variant: "default" },
  revoked: { label: "Revoked", variant: "danger" },
};

export const abhaVerificationStatusConfig: Record<string, StatusBadgeConfig> = {
  active: { label: "Active", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
};

export const careContextStatusConfig: Record<string, StatusBadgeConfig> = {
  completed: { label: "Completed", variant: "success" },
  in_progress: { label: "In Progress", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "danger" },
  draft: { label: "Draft", variant: "default" },
};
