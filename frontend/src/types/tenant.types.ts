// Responsibility: Type definitions for tenant hierarchy, branding, and lifecycle events

export type TenantStatus = "active" | "suspended" | "archived";

export interface TenantBranding {
  hospital_id: string;
  logo_url?: string;
  color_scheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  custom_domain?: string;
  updated_at: string;
}

export interface BAADocument {
  id: string;
  hospital_id: string;
  document_url: string;
  signed_at?: string;
  expires_at?: string;
  created_at: string;
}

export type LifecycleEventType =
  | "created"
  | "activated"
  | "suspended"
  | "reactivated"
  | "archived"
  | "deleted";

export interface LifecycleEvent {
  id: string;
  hospital_id: string;
  event_type: LifecycleEventType;
  reason?: string;
  metadata?: Record<string, unknown>;
  created_by?: string;
  created_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  address?: string;
  contact?: string;
  license_info?: string;
  status: TenantStatus;
  suspension_reason?: string;
  timezone: string;
  locale: string;
  currency: string;
  created_at: string;
  updated_at: string;
  hospital_branding?: TenantBranding[];
  hospital_baa_documents?: BAADocument[];
}
