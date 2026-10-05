// Responsibility: Type definitions for tenant/hospital entities

export interface TenantCreateData {
  name: string;
  address?: string;
  contact?: string;
  license_info?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
}

export interface TenantUpdateData {
  name?: string;
  address?: string;
  contact?: string;
  license_info?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
}

export interface BrandingData {
  logo_url?: string;
  color_scheme?: { primary: string; secondary: string; accent: string };
  custom_domain?: string;
}
