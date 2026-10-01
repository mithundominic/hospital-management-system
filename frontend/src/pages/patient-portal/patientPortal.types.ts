// Responsibility: Type definitions for patient portal domain

export interface PatientRegistration {
  id: string;
  registration_date: string;
  hospital?: {
    id: string;
    name: string;
  };
}

export interface PatientAppointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  reason?: string;
  notes?: string;
  doctor_membership?: {
    id: string;
    doctor?: {
      full_name: string;
      specialization?: string;
    };
  };
  department?: {
    name: string;
  };
  patient_registration?: {
    hospital?: {
      name: string;
    };
  };
}

export interface PatientLabResult {
  id: string;
  test_name: string;
  result_value: string;
  reference_range?: string;
  status: "pending" | "completed" | "cancelled";
  result_date: string;
  notes?: string;
  lab_order?: {
    encounter?: {
      encounter_date: string;
      patient_registration?: {
        hospital?: {
          name: string;
        };
      };
    };
  };
}

export interface PatientPrescription {
  id: string;
  prescription_date: string;
  notes?: string;
  prescription_items?: Array<{
    id: string;
    medication_name: string;
    dosage: string;
    frequency: string;
    duration_days: number;
    instructions?: string;
  }>;
  encounter?: {
    encounter_date: string;
    diagnosis?: string;
    doctor_membership?: {
      doctor?: {
        full_name: string;
        specialization?: string;
      };
    };
    patient_registration?: {
      hospital?: {
        name: string;
      };
    };
  };
}

export interface AppointmentRequest {
  patient_registration_id: string;
  department_id?: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
}
