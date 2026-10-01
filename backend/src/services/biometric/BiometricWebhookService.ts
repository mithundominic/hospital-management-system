// Responsibility: Process ZKTeco ADMS webhook attendance data

import { SupabaseClient } from "@supabase/supabase-js";
import { findUserByPin } from "./EmployeePinService";

interface ParsedAttendanceRecord {
  pin: string;
  timestamp: string;
  status: number;
  verifyMode: number;
  workCode?: string;
}

const STATUS_MAP: Record<number, string> = {
  0: "checked_in",
  1: "checked_out",
  2: "checked_in",
  3: "checked_in",
  4: "checked_in",
  5: "checked_out",
};

const parseAttendanceLog = (logLine: string): ParsedAttendanceRecord | null => {
  const parts = logLine.trim().split("\t");
  if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) return null;

  return {
    pin: parts[0],
    timestamp: parts[1],
    status: parseInt(parts[2], 10),
    verifyMode: parseInt(parts[3] || "0", 10),
    workCode: parts[4] || undefined,
  };
};

export const processAttendanceLogs = async (
  supabase: SupabaseClient,
  deviceId: string,
  hospitalId: string,
  logsBody: string,
) => {
  const logs = logsBody
    .split("\n")
    .map(parseAttendanceLog)
    .filter((log): log is ParsedAttendanceRecord => log !== null);

  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (const log of logs) {
    try {
      const userId = await findUserByPin(supabase, hospitalId, log.pin);

      if (!userId) {
        results.failed++;
        results.errors.push(`Unknown PIN: ${log.pin}`);
        await supabase.from("attendance_records").insert({
          hospital_id: hospitalId,
          user_id: null,
          check_in_time: log.timestamp,
          status: "checked_in",
          source: "biometric",
          device_id: deviceId,
          verify_mode: log.verifyMode,
          work_code: log.workCode,
          notes: `Unknown employee PIN: ${log.pin}`,
        });
        continue;
      }

      const mappedStatus = STATUS_MAP[log.status] || "checked_in";

      await supabase.from("attendance_records").insert({
        hospital_id: hospitalId,
        user_id: userId,
        check_in_time: log.timestamp,
        check_out_time: mappedStatus === "checked_out" ? log.timestamp : null,
        status: mappedStatus,
        source: "biometric",
        device_id: deviceId,
        verify_mode: log.verifyMode,
        work_code: log.workCode,
        notes: log.status >= 2 ? (STATUS_MAP[log.status] || "Special") : null,
      });

      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(
        `Error processing PIN ${log.pin}: ${(error as Error).message}`,
      );
    }
  }

  await supabase
    .from("biometric_devices")
    .update({ last_sync_at: new Date().toISOString() })
    .eq("id", deviceId);

  return results;
};
