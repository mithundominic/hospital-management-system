// Responsibility: Enterprise Master Patient Index (EMPI) search and member directory

import { SupabaseClient } from "@supabase/supabase-js";
import { Patient } from "../../types";

export interface EmpiPatientResult {
  patient: Patient;
  registrations: Array<{
    hospitalId: string;
    hospitalName: string;
    patientNumber: string;
    registeredAt: string;
  }>;
}

interface EmpiQueryRow {
  hospital_patient_number: string;
  registered_at: string;
  hospital: { id: string; name: string; tenant_id: string };
  patient: Patient;
}

export class OrganizationEmpiService {
  async searchPatients(
    orgId: string,
    query: string,
    client: SupabaseClient,
  ): Promise<EmpiPatientResult[]> {
    if (!query || query.trim().length === 0) return [];

    const trimmed = query.trim();

    const { data, error } = await client
      .from("patient_registrations")
      .select(`
        hospital_patient_number,
        registered_at,
        hospital:hospitals!inner(id, name, tenant_id),
        patient:patients!inner(*)
      `)
      .eq("hospital.tenant_id", orgId)
      .or(
        `full_name.ilike.%${trimmed}%,phone.ilike.%${trimmed}%,abha_id.ilike.%${trimmed}%`,
        { foreignTable: "patient" },
      )
      .limit(20);

    if (error) throw error;
    if (!data) return [];

    const patientMap = new Map<string, EmpiPatientResult>();

    for (const row of (data as unknown as EmpiQueryRow[])) {
      const p = row.patient;
      if (!patientMap.has(p.id)) {
        patientMap.set(p.id, {
          patient: p,
          registrations: [],
        });
      }
      patientMap.get(p.id)!.registrations.push({
        hospitalId: row.hospital.id,
        hospitalName: row.hospital.name,
        patientNumber: row.hospital_patient_number,
        registeredAt: row.registered_at,
      });
    }

    return Array.from(patientMap.values());
  }

  async getMembers(orgId: string, client: SupabaseClient) {
    const { data, error } = await client
      .from("tenant_memberships")
      .select("id, user_id, status, created_at, role:roles(name, scope)")
      .eq("tenant_id", orgId);

    if (error) throw error;
    return data || [];
  }
}
