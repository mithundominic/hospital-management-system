// Responsibility: Centralized application route constants and route builder helpers

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  PATIENTS: "/patients",
  PATIENT_DETAIL: "/patients/:id",
  APPOINTMENTS: "/appointments",
  ENCOUNTERS: "/encounters",
  LAB_ORDERS: "/lab",
  PHARMACY: "/pharmacy",
  BILLING: "/billing",
  INSURANCE: "/insurance",
  IPD: "/ipd",
  STAFF: "/staff",
  SHIFTS: "/shifts",
  ATTENDANCE: "/attendance",
  LEAVE: "/leave",
  BIOMETRIC_DEVICES: "/biometric-devices",
  REPORTS: "/reports",
  PLATFORM_HOSPITALS: "/platform/hospitals",
  PLATFORM_ANALYTICS: "/platform/analytics",
  SETTINGS: "/settings",
} as const;

export const buildPatientDetailRoute = (patientId: string): string =>
  `/patients/${encodeURIComponent(patientId)}`;

export const buildLoginRedirect = (redirectPath: string): string => {
  if (
    !redirectPath ||
    redirectPath === APP_ROUTES.DASHBOARD ||
    redirectPath === APP_ROUTES.HOME
  ) {
    return APP_ROUTES.LOGIN;
  }
  return `${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectPath)}`;
};
