// Responsibility: Type definitions for enterprise organizations and tenant memberships

export type OrganizationStatus = "active" | "suspended" | "archived";
export type SubscriptionTier = "starter" | "standard" | "enterprise";
export type TenantMembershipStatus = "active" | "invited" | "suspended";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  subscription_tier: SubscriptionTier;
  max_facilities: number;
  billing_email: string;
  currency: string;
  timezone: string;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UpdateOrganizationDTO {
  name?: string;
  billing_email?: string;
  currency?: string;
  timezone?: string;
  settings?: Record<string, unknown>;
}

export interface CreateFacilityDTO {
  name: string;
  code?: string;
  facility_type?: "hospital" | "clinic" | "diagnostic_center" | "pharmacy_store" | "central_warehouse";
  registration_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email?: string;
  phone?: string;
}

export interface TenantMembership {
  id: string;
  user_id: string;
  tenant_id: string;
  role_id: string;
  status: TenantMembershipStatus;
  created_at: string;
}
