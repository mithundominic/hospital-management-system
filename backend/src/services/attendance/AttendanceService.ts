// Responsibility: Business logic for staff attendance check-in/out operations

import { SupabaseClient } from "@supabase/supabase-js";
import type { AttendanceRecord, AttendanceFilters } from "./attendance.types";

export type { AttendanceRecord, AttendanceFilters };

export const queryAttendanceRecords = async (
  supabase: SupabaseClient,
  hospitalId: string,
  filters: AttendanceFilters = {},
) => {
  let query = supabase
    .from("attendance_records")
    .select("id, hospital_id, user_id, check_in_time, check_out_time, status, notes, created_at, user:auth.users(email)")
    .eq("hospital_id", hospitalId)
    .order("check_in_time", { ascending: false });

  if (filters.date) {
    const startOfDay = `${filters.date}T00:00:00Z`;
    const endOfDay = `${filters.date}T23:59:59Z`;
    query = query.gte("check_in_time", startOfDay).lte("check_in_time", endOfDay);
  }

  if (filters.user_id) {
    query = query.eq("user_id", filters.user_id);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const queryMyAttendanceRecords = async (
  supabase: SupabaseClient,
  hospitalId: string,
  userId: string,
  limit = 30,
) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .select("id, hospital_id, user_id, check_in_time, check_out_time, status, notes, created_at")
    .eq("hospital_id", hospitalId)
    .eq("user_id", userId)
    .order("check_in_time", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const checkIn = async (
  supabase: SupabaseClient,
  hospitalId: string,
  userId: string,
  notes?: string,
) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .insert({
      hospital_id: hospitalId,
      user_id: userId,
      check_in_time: new Date().toISOString(),
      status: "checked_in",
      notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const checkOut = async (
  supabase: SupabaseClient,
  attendanceId: string,
) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .update({
      check_out_time: new Date().toISOString(),
      status: "checked_out",
    })
    .eq("id", attendanceId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
