// Responsibility: Tenant management API calls

import { api } from "@/lib/api";
import type {
  Tenant,
  TenantBranding,
  LifecycleEvent,
  BAADocument,
} from "@/types/platform";

interface TenantCreateData {
  name: string;
  address?: string;
  contact?: string;
  license_info?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
}

interface TenantUpdateData {
  name?: string;
  address?: string;
  contact?: string;
  license_info?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
}

interface SuspendData {
  reason: string;
}

interface BrandingData {
  logo_url?: string;
  color_scheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  custom_domain?: string;
}

interface BAADocumentData {
  document_url: string;
  signed_at?: string;
  expires_at?: string;
}

export const tenantService = {
  createTenant: (data: TenantCreateData) => api.post<Tenant>("/tenants", data),

  getAllTenants: () => api.get<Tenant[]>("/tenants"),

  getTenantById: (hospitalId: string) =>
    api.get<Tenant>(`/tenants/${hospitalId}`),

  updateTenant: (hospitalId: string, data: TenantUpdateData) =>
    api.patch<Tenant>(`/tenants/${hospitalId}`, data),

  suspendTenant: (hospitalId: string, data: SuspendData) =>
    api.post<Tenant>(`/tenants/${hospitalId}/suspend`, data),

  reactivateTenant: (hospitalId: string) =>
    api.post<Tenant>(`/tenants/${hospitalId}/reactivate`),

  archiveTenant: (hospitalId: string) =>
    api.post<Tenant>(`/tenants/${hospitalId}/archive`),

  updateBranding: (hospitalId: string, data: BrandingData) =>
    api.put<TenantBranding>(`/tenants/${hospitalId}/branding`, data),

  getLifecycleEvents: (hospitalId: string) =>
    api.get<LifecycleEvent[]>(`/tenants/${hospitalId}/lifecycle-events`),

  uploadBAADocument: (hospitalId: string, data: BAADocumentData) =>
    api.post<BAADocument>(`/tenants/${hospitalId}/baa-documents`, data),

  getBAADocuments: (hospitalId: string) =>
    api.get<BAADocument[]>(`/tenants/${hospitalId}/baa-documents`),

  exportTenantData: (hospitalId: string, format: "json" | "csv") =>
    api.post(`/tenants/${hospitalId}/export?format=${format}`),

  cloneTenant: (
    hospitalId: string,
    data: { name: string; address?: string; contact?: string },
  ) => api.post<Tenant>(`/tenants/${hospitalId}/clone`, data),
};
