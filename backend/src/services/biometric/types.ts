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

export interface EmployeePinMapping {
  id: string;
  hospital_id: string;
  user_id: string;
  biometric_pin: string;
  created_at: string;
}

export interface ParsedAttendanceRecord {
  pin: string;
  timestamp: string;
  status: number;
  verifyMode: number;
  workCode?: string;
}

