// Responsibility: Type definitions for biometric device domain

export interface BiometricDevice {
  id: string;
  hospital_id: string;
  serial_number: string;
  name: string;
  location?: string;
  model?: string;
  ip_address?: string;
  firmware_version?: string;
  status: "active" | "inactive" | "maintenance";
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDeviceInput {
  serial_number: string;
  name: string;
  location?: string;
  model?: string;
  ip_address?: string;
}
