// Responsibility: Type definitions for landing page modules, features, and metrics

import type { LucideIcon } from "lucide-react";

export interface ClinicalModule {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  features: readonly string[];
}

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText: string;
}

export interface MetricHighlight {
  label: string;
  value: string;
  description: string;
}
