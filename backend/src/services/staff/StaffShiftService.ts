// Responsibility: Business logic and database operations for staff shifts

import { SupabaseClient } from "@supabase/supabase-js";
import type { StaffShift } from "../../types";

export interface ShiftFilters {
  date?: string;
  membership_id?: string;
}

export const queryStaffShifts = async (
  supabase: SupabaseClient,
  hospitalId: string,
  filters: ShiftFilters = {},
) => {
  let query = supabase
    .from("staff_shifts")
    .select("*")
    .eq("hospital_id", hospitalId);

  if (filters.date) {
    query = query.eq("shift_date", filters.date);
  }
  if (filters.membership_id) {
    query = query.eq("membership_id", filters.membership_id);
  }

  const { data, error } = await query.order("shift_date", { ascending: true });
  if (error) throw error;
  return data;
};

export const createNewStaffShift = async (
  supabase: SupabaseClient,
  hospitalId: string,
  shiftData: {
    membership_id: string;
    department_id: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    notes?: string;
  },
) => {
  const { data, error } = await supabase
    .from("staff_shifts")
    .insert({ hospital_id: hospitalId, ...shiftData })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateExistingStaffShift = async (
  supabase: SupabaseClient,
  hospitalId: string,
  shiftId: string,
  updates: Partial<StaffShift>,
) => {
  const { data, error } = await supabase
    .from("staff_shifts")
    .update(updates)
    .eq("id", shiftId)
    .eq("hospital_id", hospitalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
