// Responsibility: Leave balance queries and management

import { SupabaseClient } from "@supabase/supabase-js";

export interface LeaveBalance {
  id: string;
  hospital_id: string;
  user_id: string;
  year: number;
  casual_leave: number;
  sick_leave: number;
  earned_leave: number;
}

export const queryLeaveBalance = async (
  supabase: SupabaseClient,
  hospitalId: string,
  userId: string,
  year: number,
) => {
  const { data, error } = await supabase
    .from("leave_balances")
    .select("*")
    .eq("hospital_id", hospitalId)
    .eq("user_id", userId)
    .eq("year", year)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const initializeLeaveBalance = async (
  supabase: SupabaseClient,
  hospitalId: string,
  userId: string,
  year: number,
) => {
  const { data, error } = await supabase
    .from("leave_balances")
    .insert({
      hospital_id: hospitalId,
      user_id: userId,
      year,
      casual_leave: 12,
      sick_leave: 12,
      earned_leave: 15,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
