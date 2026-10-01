// Responsibility: Validate ABDM callback timestamps are within 5-minute window

/**
 * Validates that a callback timestamp is within 5 minutes of current time
 * @param timestamp ISO 8601 timestamp string from callback payload
 * @returns true if timestamp is within 5 minutes (fresh), false if stale or invalid
 */
export function validateCallbackTimestamp(timestamp: string): boolean {
  try {
    const callbackTime = new Date(timestamp).getTime();
    const now = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;

    // Check if timestamp is valid
    if (isNaN(callbackTime)) {
      return false;
    }

    // Check if timestamp is within 5 minutes (past or future to account for clock skew)
    const timeDiff = Math.abs(now - callbackTime);
    return timeDiff <= fiveMinutesMs;
  } catch {
    return false;
  }
}
