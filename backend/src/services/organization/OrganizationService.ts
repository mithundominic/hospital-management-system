// Responsibility: Organization profile and user membership queries

import { SupabaseClient } from "@supabase/supabase-js";
import { Organization, UpdateOrganizationDTO } from "../../types";

interface UserOrgMembershipRow {
  role?: { name?: string } | null;
  organization: Organization;
}

export class OrganizationService {
  async getUserOrganizations(
    userId: string,
    client: SupabaseClient,
  ): Promise<Array<Organization & { role: string }>> {
    const { data, error } = await client
      .from("tenant_memberships")
      .select("role:roles(name), organization:organizations(*)")
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) throw error;
    if (!data) return [];

    return (data as unknown as UserOrgMembershipRow[]).map((item) => ({
      ...item.organization,
      role: item.role?.name || "Member",
    }));
  }

  async getOrganization(
    orgId: string,
    client: SupabaseClient,
  ): Promise<Organization> {
    const { data, error } = await client
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateOrganization(
    orgId: string,
    updates: UpdateOrganizationDTO,
    client: SupabaseClient,
  ): Promise<Organization> {
    const { data, error } = await client
      .from("organizations")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", orgId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
