// Responsibility: Business logic for managing biometric devices

import { SupabaseClient } from "@supabase/supabase-js";

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

export const listDevices = async (
  supabase: SupabaseClient,
  hospitalId: string,
) => {
  const { data, error } = await supabase
    .from("biometric_devices")
    .select("*")
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getDevice = async (
  supabase: SupabaseClient,
  deviceId: string,
) => {
  const { data, error } = await supabase
    .from("biometric_devices")
    .select("*")
    .eq("id", deviceId)
    .single();

  if (error) throw error;
  return data;
};

export const createDevice = async (
  supabase: SupabaseClient,
  hospitalId: string,
  input: CreateDeviceInput,
) => {
  const { data, error } = await supabase
    .from("biometric_devices")
    .insert({
      hospital_id: hospitalId,
      ...input,
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateDevice = async (
  supabase: SupabaseClient,
  deviceId: string,
  updates: Partial<CreateDeviceInput>,
) => {
  const { data, error } = await supabase
    .from("biometric_devices")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", deviceId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateDeviceStatus = async (
  supabase: SupabaseClient,
  deviceId: string,
  status: "active" | "inactive" | "maintenance",
) => {
  const { data, error } = await supabase
    .from("biometric_devices")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", deviceId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteDevice = async (
  supabase: SupabaseClient,
  deviceId: string,
) => {
  const { error } = await supabase
    .from("biometric_devices")
    .delete()
    .eq("id", deviceId);

  if (error) throw error;
};
