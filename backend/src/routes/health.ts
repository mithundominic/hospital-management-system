// Responsibility: Deep healthcheck handler validating server and database connectivity

import { Request, Response } from "express";
import { publicClient } from "../config/supabase";

export const healthCheckHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const startTime = Date.now();
  try {
    const { error } = await publicClient
      .from("roles")
      .select("id")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    res.status(200).json({
      status: "ok",
      database: "connected",
      latencyMs: Date.now() - startTime,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  } catch (err: unknown) {
    res.status(503).json({
      status: "degraded",
      database: "disconnected",
      error: err instanceof Error ? err.message : "Database ping failed",
    });
  }
};
