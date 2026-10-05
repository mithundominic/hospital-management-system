// Responsibility: Type definitions for enterprise organizations and organization context state

import type { Hospital } from "./hospital";
import type { Patient } from "./clinical.types";

export type OrganizationStatus = "active" | "suspended" | "archived";
export type SubscriptionTier = "starter" | "standard" | "enterprise";

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

export interface UserOrganization extends Organization {
  role: string;
}

export interface CreateFacilityInput {
  name: string;
  code?: string;
  facility_type?:
    | "hospital"
    | "clinic"
    | "diagnostic_center"
    | "pharmacy_store"
    | "central_warehouse";
  registration_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email?: string;
  phone?: string;
}

export interface EmpiPatientResult {
  patient: Patient;
  registrations: Array<{
    hospitalId: string;
    hospitalName: string;
    patientNumber: string;
    registeredAt: string;
  }>;
}

export interface OrganizationContextType {
  organizations: UserOrganization[];
  currentOrganization: UserOrganization | null;
  setCurrentOrganization: (org: UserOrganization) => void;
  facilities: Hospital[];
  refreshOrganizations: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
