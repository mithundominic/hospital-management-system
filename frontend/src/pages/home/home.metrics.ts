// Responsibility: Static configuration data for homepage hero metrics and key performance indicators

import type { MetricHighlight } from "./home.types";

export const HERO_METRICS: readonly MetricHighlight[] = [
  { label: "Clinical Domains", value: "10+", description: "OPD, IPD, Lab, Pharmacy & Billing" },
  { label: "Audit Ledgers", value: "100%", description: "Immutable financial & clinical history" },
  { label: "Tenant Isolation", value: "Zero Leak", description: "PostgreSQL Row-Level Security" },
  { label: "Setup Time", value: "< 5 Mins", description: "Self-serve hospital tenant onboarding" },
] as const;
