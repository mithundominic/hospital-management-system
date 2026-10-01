// Responsibility: HTTP REST client for communicating with backend API

import { supabase } from "./supabase";
import config from "./config";

class ApiClient {
  private async getAuthHeaders(explicitToken?: string): Promise<HeadersInit> {
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

  async get<T = unknown>(endpoint: string, explicitToken?: string): Promise<T> {
    const headers = await this.getAuthHeaders(explicitToken);
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const json = await res.json();
    return json.data as T;
  }

  async post<T = unknown, B = unknown>(endpoint: string, data?: B): Promise<T> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error?.message || "API Error");
    }
    const json = await res.json();
    return json.data as T;
  }

  async postPublic<T = unknown, B = unknown>(
    endpoint: string,
    data?: B,
  ): Promise<T> {
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error?.message || "API Error");
    }
    const json = await res.json();
    return json.data as T;
  }

  async patch<T = unknown, B = unknown>(
    endpoint: string,
    data?: B,
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const json = await res.json();
    return json.data as T;
  }

  async delete(endpoint: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  }

  // Analytics endpoints
  async getAnalyticsOverview<T>(
    hospitalId: string,
    startDate: string,
    endDate: string,
  ): Promise<T> {
    return this.get<T>(
      `/hospitals/${hospitalId}/analytics/overview?startDate=${startDate}&endDate=${endDate}`,
    );
  }

  async getAnalyticsByCategory<T>(
    hospitalId: string,
    category: string,
    startDate: string,
    endDate: string,
  ): Promise<T> {
    return this.get<T>(
      `/hospitals/${hospitalId}/analytics/${category}?startDate=${startDate}&endDate=${endDate}`,
    );
  }
}

export const api = new ApiClient();
