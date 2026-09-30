// Responsibility: ZKTeco ADMS webhook handler (device callback endpoint)
// NO authentication required - follows Rule 9: Auth Exceptions pattern

import { Request, Response, NextFunction } from "express";
import { getAdminClient } from "../config/supabase";
import { processAttendanceLogs } from "../services/biometric/BiometricWebhookService";

export const webhookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serialNumber = req.query.SN as string;
    const table = req.query.table as string;

    if (!serialNumber) {
      return res.status(400).json({ error: "Missing device serial number" });
    }

    if (table !== "ATTLOG") {
      return res.status(200).send("OK");
    }

    const supabase = getAdminClient();

    const { data: device, error: deviceError } = await supabase
      .from("biometric_devices")
      .select("id, hospital_id, status")
      .eq("serial_number", serialNumber)
      .single();

    if (deviceError || !device) {
      console.warn(`Unknown device serial: ${serialNumber}`);
      return res.status(404).json({ error: "Device not registered" });
    }

    if (device.status !== "active") {
      console.warn(`Inactive device attempted sync: ${serialNumber}`);
      return res.status(403).json({ error: "Device is not active" });
    }

    const logsBody = req.body;
    if (typeof logsBody !== "string" || !logsBody.trim()) {
      return res.status(200).send("OK");
    }

    const results = await processAttendanceLogs(
      supabase,
      device.id,
      device.hospital_id,
      logsBody,
    );

    console.log(
      `Webhook processed for ${serialNumber}: ${results.success} success, ${results.failed} failed`,
    );

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    next(error);
  }
};
