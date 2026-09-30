// Responsibility: TypeScript types for biometric device domain

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
  user?: {
    email: string;
  };
}

export interface CreatePinMappingInput {
  user_id: string;
  biometric_pin: string;
}

export const DEVICE_STATUS_LABELS: Record<
  BiometricDevice["status"],
  string
> = {
  active: "Active",
  inactive: "Inactive",
  maintenance: "Maintenance",
};

export const DEVICE_STATUS_COLORS: Record<
  BiometricDevice["status"],
  string
> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  maintenance: "bg-yellow-100 text-yellow-800",
};
