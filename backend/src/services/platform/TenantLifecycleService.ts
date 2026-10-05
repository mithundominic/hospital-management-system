// Responsibility: Service for managing tenant lifecycle transitions (suspend, reactivate, archive)

import { SupabaseClient } from "@supabase/supabase-js";
import { logLifecycleEvent } from "./TenantLifecycleEventsService";

export const suspendTenant = async (
  supabase: SupabaseClient,
  hospitalId: string,
  reason: string,
  userId: string,
) => {
  const { data: hospital, error: updateError } = await supabase
    .from("hospitals")
    .update({ status: "suspended", suspension_reason: reason })
    .eq("id", hospitalId)
    .select()
    .single();

  if (updateError) throw updateError;

  await logLifecycleEvent(
    supabase,
    hospitalId,
    {
      event_type: "suspended",
      reason,
      metadata: { suspended_by: userId },
    },
    userId,
  );

  return hospital;
};

export const reactivateTenant = async (
  supabase: SupabaseClient,
  hospitalId: string,
  userId: string,
) => {
  const { data: hospital, error: updateError } = await supabase
    .from("hospitals")
    .update({ status: "active", suspension_reason: null })
    .eq("id", hospitalId)
    .select()
    .single();

  if (updateError) throw updateError;

  await logLifecycleEvent(
    supabase,
    hospitalId,
    {
      event_type: "reactivated",
      metadata: { reactivated_by: userId },
    },
    userId,
  );

  return hospital;
};

export const archiveTenant = async (
  supabase: SupabaseClient,
  hospitalId: string,
  userId: string,
) => {
  const { data: hospital, error: updateError } = await supabase
    .from("hospitals")
    .update({ status: "archived" })
    .eq("id", hospitalId)
    .select()
    .single();

  if (updateError) throw updateError;

  await logLifecycleEvent(
    supabase,
    hospitalId,
    {
      event_type: "archived",
      metadata: { archived_by: userId },
    },
    userId,
  );

  return hospital;
};
