// Responsibility: HTTP REST client for communicating with backend API

import config from "./config";
import { getAuthHeaders } from "./api.headers";

class ApiClient {
  async get<T = unknown>(endpoint: string, explicitToken?: string): Promise<T> {
    const headers = await getAuthHeaders(explicitToken);
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const json = await res.json();
    return json.data as T;
  }

  async post<T = unknown, B = unknown>(endpoint: string, data?: B): Promise<T> {
    const headers = await getAuthHeaders();
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
    const headers = await getAuthHeaders();
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const json = await res.json();
    return json.data as T;
  }

  async put<T = unknown, B = unknown>(endpoint: string, data?: B): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "PUT",
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const json = await res.json();
    return json.data as T;
  }

  async delete(endpoint: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  }
}

export const api = new ApiClient();
