// Responsibility: Parsing and mapping utilities for biometric attendance raw logs

import type { ParsedAttendanceRecord } from "./types";

export const STATUS_MAP: Record<number, string> = {
  0: "checked_in",
  1: "checked_out",
  2: "checked_in",
  3: "checked_in",
  4: "checked_in",
  5: "checked_out",
};

export const parseAttendanceLog = (
  logLine: string,
): ParsedAttendanceRecord | null => {
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
