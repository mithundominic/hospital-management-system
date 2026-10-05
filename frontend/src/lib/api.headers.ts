// Responsibility: Authentication header resolution for API client

import { supabase } from "./supabase";

export async function getAuthHeaders(
  explicitToken?: string,
): Promise<HeadersInit> {
  let token = explicitToken;
  if (!token) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    token = session?.access_token;
  }
  if (!token) throw new Error("Not authenticated");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
