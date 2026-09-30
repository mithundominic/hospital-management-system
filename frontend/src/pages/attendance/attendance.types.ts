// Responsibility: TypeScript interfaces for attendance and leave management

export interface AttendanceRecord {
  id: string;
  hospital_id: string;
  user_id: string;
  check_in_time: string;
  check_out_time: string | null;
  status: "checked_in" | "checked_out" | "absent";
  source?: "manual" | "biometric";
  device_id?: string | null;
  verify_mode?: number | null;
  work_code?: string | null;
  notes: string | null;
  created_at: string;
  user?: {
    email: string;
  };
}

export interface LeaveApplication {
  id: string;
  hospital_id: string;
  user_id: string;
  leave_type: "casual" | "sick" | "earned" | "maternity" | "paternity";
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  user?: {
    email: string;
  };
}

export interface LeaveBalance {
  id: string;
  hospital_id: string;
  user_id: string;
  year: number;
  casual_leave: number;
  sick_leave: number;
  earned_leave: number;
}

export interface CheckInPayload {
  notes?: string;
}

export interface CheckOutPayload {
  attendance_id: string;
}

export interface LeaveApplicationPayload {
  leave_type: string;
  start_date: string;
  end_date: string;
  days_count: number;
  reason?: string;
}
