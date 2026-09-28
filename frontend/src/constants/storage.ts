// Responsibility: Centralized storage keys and event names for client-side persistence

export const STORAGE_KEYS = {
  CURRENT_HOSPITAL_ID: "hms_current_hospital_id",
  AUTH_TOKEN: "hms_auth_token",
  SIDEBAR_COLLAPSED: "hms_sidebar_collapsed",
  THEME: "hms_theme",
} as const;

export const STORAGE_EVENTS = {
  HOSPITAL_CHANGED: "hms_hospital_changed",
  AUTH_STATE_CHANGED: "hms_auth_state_changed",
} as const;
