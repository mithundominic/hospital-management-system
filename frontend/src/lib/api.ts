// Responsibility: HTTP REST client for communicating with backend API

import { supabase } from './supabase';
import config from './config';

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }
    return {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  async get<T = unknown>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data as T;
  }

  async post<T = unknown, B = unknown>(endpoint: string, data?: B): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API Error');
    }

    const json = await response.json();
    return json.data as T;
  }

  async patch<T = unknown, B = unknown>(endpoint: string, data?: B): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data as T;
  }

  async delete(endpoint: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
  }
}

export const api = new ApiClient();
