// Responsibility: Business logic and data queries for staff memberships and roles

import { SupabaseClient } from "@supabase/supabase-js";
import type { Membership } from "../../types";

export const queryHospitalMemberships = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("memberships")
    .select("*, roles(name)")
    .eq("hospital_id", hospitalId);
  if (error) throw error;
  return data;
};

export const createNewMembership = async (
  supabase: SupabaseClient,
  hospitalId: string,
  membershipData: {
    user_id: string;
    role_id: string;
  },
) => {
  const { data, error } = await supabase
    .from("memberships")
    .insert({
      user_id: membershipData.user_id,
      role_id: membershipData.role_id,
      hospital_id: hospitalId,
      status: "invited",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateExistingMembership = async (
  supabase: SupabaseClient,
  hospitalId: string,
  membershipId: string,
  updates: Partial<Pick<Membership, "role_id" | "status">>,
) => {
  const { role_id, status } = updates;
  const { data, error } = await supabase
    .from("memberships")
    .update({ ...(role_id && { role_id }), ...(status && { status }) })
    .eq("id", membershipId)
    .eq("hospital_id", hospitalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
