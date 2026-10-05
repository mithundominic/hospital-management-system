// Responsibility: Database-backed rate limit store with resilient in-memory fallback

import { Store, Options, ClientRateLimitInfo } from "express-rate-limit";
import { publicClient } from "../config/supabase";

interface MemoryRecord {
  count: number;
  resetAt: number;
}

export class DatabaseRateLimitStore implements Store {
  readonly localKeys = false;
  prefix: string;
  private windowMs = 900000;
  private maxRequests = 300;
  private memoryFallback = new Map<string, MemoryRecord>();

  constructor(prefix: string = "") {
    this.prefix = prefix;
  }

  init(options: Options): void {
    this.windowMs = options.windowMs;
    this.maxRequests = options.limit as number;
  }

  async increment(key: string): Promise<ClientRateLimitInfo> {
    const fullKey = `${this.prefix}${key}`;
    try {
      const windowSec = Math.ceil(this.windowMs / 1000);
      const { data, error } = await publicClient.rpc("check_rate_limit", {
        p_key: fullKey,
        p_window_seconds: windowSec,
        p_max_requests: this.maxRequests,
      });

      if (!error && data) {
        const resetSec = (data.reset_seconds as number) || windowSec;
        const remaining = (data.remaining as number) ?? 0;
        return {
          totalHits: this.maxRequests - remaining,
          resetTime: new Date(Date.now() + resetSec * 1000),
        };
      }
      if (error) {
        console.warn(
          `[RateLimitStore] DB check_rate_limit error: ${error.message}`,
        );
      }
    } catch (err) {
      console.warn("[RateLimitStore] RPC call failed, using memory", err);
    }
    return this.incrementMemory(fullKey);
  }

  private incrementMemory(key: string): ClientRateLimitInfo {
    const now = Date.now();
    const existing = this.memoryFallback.get(key);

    if (!existing || existing.resetAt <= now) {
      const record: MemoryRecord = { count: 1, resetAt: now + this.windowMs };
      this.memoryFallback.set(key, record);
      return { totalHits: 1, resetTime: new Date(record.resetAt) };
    }

    existing.count += 1;
    return { totalHits: existing.count, resetTime: new Date(existing.resetAt) };
  }

  async decrement(key: string): Promise<void> {
    const fullKey = `${this.prefix}${key}`;
    const record = this.memoryFallback.get(fullKey);
    if (record && record.count > 0) record.count -= 1;
  }

  async resetKey(key: string): Promise<void> {
    const fullKey = `${this.prefix}${key}`;
    this.memoryFallback.delete(fullKey);
  }
}
