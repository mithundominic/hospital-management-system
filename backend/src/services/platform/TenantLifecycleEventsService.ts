// Responsibility: Service for logging and retrieving tenant lifecycle events and BAA documents

import { SupabaseClient } from "@supabase/supabase-js";

export interface LifecycleEventData {
  event_type:
    | "created"
    | "activated"
    | "suspended"
    | "reactivated"
    | "archived"
    | "deleted";
  reason?: string;
  metadata?: Record<string, unknown>;
}

export const logLifecycleEvent = async (
  supabase: SupabaseClient,
  hospitalId: string,
  eventData: LifecycleEventData,
  userId: string,
) => {
  const { error } = await supabase.from("hospital_lifecycle_events").insert({
    hospital_id: hospitalId,
    ...eventData,
    created_by: userId,
  });

  if (error) throw error;
};

export const getLifecycleEvents = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("hospital_lifecycle_events")
    .select("*")
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const uploadBAADocument = async (
  supabase: SupabaseClient,
  hospitalId: string,
  documentUrl: string,
  signedAt?: string,
  expiresAt?: string,
) => {
  const { data, error } = await supabase
    .from("hospital_baa_documents")
    .insert({
      hospital_id: hospitalId,
      document_url: documentUrl,
      signed_at: signedAt,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getBAADocuments = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("hospital_baa_documents")
    .select("*")
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
