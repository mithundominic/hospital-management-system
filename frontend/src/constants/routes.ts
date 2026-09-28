// Responsibility: Centralized application route constants and route builder helpers

export const APP_ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
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
  REPORTS: "/reports",
} as const;

export const buildPatientDetailRoute = (patientId: string): string =>
  `/patients/${encodeURIComponent(patientId)}`;

export const buildLoginRedirect = (redirectPath: string): string => {
  if (!redirectPath || redirectPath === APP_ROUTES.DASHBOARD) {
    return APP_ROUTES.LOGIN;
  }
  return `${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectPath)}`;
};
