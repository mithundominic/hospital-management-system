// Responsibility: Type definitions for platform admin features and API responses

export interface PlatformMembership {
  id: string;
  user_id: string;
  role_id: string;
  status: "active" | "invited" | "suspended";
  created_at: string;
}

export interface PlatformHospital {
  id: string;
  name: string;
  registration_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  memberships?: PlatformMembership[];
  patient_count?: number;
  staff_count?: number;
}

export interface HospitalStats {
  total_staff: number;
  total_patients: number;
  total_appointments: number;
}

export interface PlatformAnalytics {
  total_hospitals: number;
  active_hospitals: number;
  inactive_hospitals: number;
  total_staff: number;
  total_patients: number;
  total_appointments: number;
  total_revenue?: number;
  recent_hospitals?: PlatformHospital[];
}
