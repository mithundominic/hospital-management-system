// Responsibility: Type definitions for staff attendance and leave domain concepts
 
export interface AttendanceRecord {
  id: string;
  hospital_id: string;
  user_id: string;
  check_in_time: string;
  check_out_time: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface AttendanceFilters {
  date?: string;
  user_id?: string;
  status?: string;
}

export interface LeaveApplication {
  id: string;
  hospital_id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string | null;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}
