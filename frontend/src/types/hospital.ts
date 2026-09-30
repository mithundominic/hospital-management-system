// Responsibility: Type definitions for hospitals and hospital context state

export interface Hospital {
  id: string;
  name: string;
  registration_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  is_active?: boolean;
  phone?: string;
  email?: string;
  logo_url?: string;
  tagline?: string;
  brand_color?: string;
  website?: string;
  gst_number?: string;
  nabh_number?: string;
  prescription_footer?: string;
  invoice_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateHospitalInput {
  name: string;
  registration_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface OnboardHospitalInput extends CreateHospitalInput {
  admin_email: string;
  admin_password: string;
}

export interface OnboardHospitalResponse {
  hospital: Hospital;
  admin: { id: string; email: string };
  session: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    token_type?: string;
  } | null;
}

export interface HospitalContextType {
  hospitals: Hospital[];
  currentHospital: Hospital | null;
  setCurrentHospital: (hospital: Hospital) => void;
  refreshHospitals: () => Promise<Hospital[]>;
  loading: boolean;
}
