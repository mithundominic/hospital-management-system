// Responsibility: Service for organization facility provisioning and listing

import { SupabaseClient } from "@supabase/supabase-js";
import { CreateFacilityDTO, Hospital, Organization } from "../../types";

export class OrganizationFacilityService {
  async getFacilities(
    orgId: string,
    client: SupabaseClient,
  ): Promise<Hospital[]> {
    const { data, error } = await client
      .from("hospitals")
      .select("*")
      .eq("tenant_id", orgId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createFacility(
    orgId: string,
    facilityData: CreateFacilityDTO,
    org: Organization,
    client: SupabaseClient,
  ): Promise<Hospital> {
    const facilities = await this.getFacilities(orgId, client);

    if (facilities.length >= org.max_facilities) {
      const err = new Error(
        `Facility limit reached for ${org.subscription_tier} tier (${org.max_facilities} facilities allowed)`,
      ) as Error & { code: string };
      err.code = "QUOTA_EXCEEDED";
      throw err;
    }

    const { data, error } = await client
      .from("hospitals")
      .insert({
        tenant_id: orgId,
        name: facilityData.name,
        code: facilityData.code || `FAC-${facilities.length + 1}`,
        facility_type: facilityData.facility_type || "hospital",
        registration_number: facilityData.registration_number,
        address: facilityData.address,
        city: facilityData.city,
        state: facilityData.state,
        pincode: facilityData.pincode,
        email: facilityData.email,
        phone: facilityData.phone,
        is_active: true,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
