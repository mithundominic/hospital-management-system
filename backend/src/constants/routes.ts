// Responsibility: Canonical API route path definitions for backend Express routers

export const API_ROUTES = {
  hospitals: {
    list: "/hospitals",
    detail: "/hospitals/:hospitalId",
  },
  patients: {
    list: "/hospitals/:hospitalId/patients",
    detail: "/hospitals/:hospitalId/patients/:patientId",
  },
  appointments: {
    list: "/hospitals/:hospitalId/appointments",
    detail: "/hospitals/:hospitalId/appointments/:apptId",
  },
  encounters: {
    list: "/hospitals/:hospitalId/encounters",
    detail: "/hospitals/:hospitalId/encounters/:encId",
    prescriptions: "/hospitals/:hospitalId/encounters/:encId/prescriptions",
  },
  billing: {
    invoices: "/hospitals/:hospitalId/invoices",
    invoiceDetail: "/hospitals/:hospitalId/invoices/:invId",
    payments: "/hospitals/:hospitalId/invoices/:invId/payments",
  },
  insurance: {
    policies: "/patients/:patientId/insurance-policies",
    policyDetail: "/patients/:patientId/insurance-policies/:id",
    claims: "/hospitals/:hospitalId/insurance-claims",
    claimDetail: "/hospitals/:hospitalId/insurance-claims/:claimId",
  },
  ipd: {
    beds: "/hospitals/:hospitalId/beds",
    bedDetail: "/hospitals/:hospitalId/beds/:bedId",
    admissions: "/hospitals/:hospitalId/admissions",
    admissionDetail: "/hospitals/:hospitalId/admissions/:admId",
  },
  lab: {
    orders: "/hospitals/:hospitalId/lab-orders",
    orderDetail: "/hospitals/:hospitalId/lab-orders/:orderId",
    results: "/hospitals/:hospitalId/lab-orders/:orderId/results",
  },
  pharmacy: {
    inventory: "/hospitals/:hospitalId/inventory",
    transactions: "/hospitals/:hospitalId/inventory/:itemId/transactions",
  },
  reports: {
    bedOccupancy: "/hospitals/:hospitalId/reports/bed-occupancy",
    dailyRevenue: "/hospitals/:hospitalId/reports/daily-revenue",
    lowStock: "/hospitals/:hospitalId/reports/low-stock",
  },
  shifts: {
    list: "/hospitals/:hospitalId/shifts",
    detail: "/hospitals/:hospitalId/shifts/:shiftId",
  },
  staff: {
    doctors: "/hospitals/:hospitalId/doctors",
    doctorDetail: "/hospitals/:hospitalId/doctors/:doctorId",
    departments: "/hospitals/:hospitalId/departments",
  },
  memberships: {
    list: "/hospitals/:hospitalId/memberships",
    detail: "/hospitals/:hospitalId/memberships/:membershipId",
  },
  abdm: {
    linkRequests:
      "/hospitals/:hospitalId/patients/:patientId/abdm/link-requests",
    verify: "/hospitals/:hospitalId/patients/:patientId/abdm/verify",
    confirm: "/hospitals/:hospitalId/patients/:patientId/abdm/confirm",
    consentRequests:
      "/hospitals/:hospitalId/patients/:patientId/abdm/consent-requests",
  },
  callbacks: {
    authOnInit: "/abdm/callbacks/users/auth/on-init",
    authOnConfirm: "/abdm/callbacks/users/auth/on-confirm",
    linkOnInit: "/abdm/callbacks/links/link/on-init",
    consentOnInit: "/abdm/callbacks/consent-requests/on-init",
    hiuNotify: "/abdm/callbacks/consents/hiu/notify",
  },
  platform: {
    status: "/platform/status",
    hospitals: "/platform/hospitals",
    hospitalStats: "/platform/hospitals/:hospitalId/stats",
    analytics: "/platform/analytics",
    activateHospital: "/platform/hospitals/:hospitalId/activate",
    deactivateHospital: "/platform/hospitals/:hospitalId/deactivate",
  },
  patientPortal: {
    registrations: "/patient-portal/my-registrations",
    myAppointments: "/patient-portal/my-appointments",
    appointmentRequests: "/patient-portal/appointment-requests",
    myLabResults: "/patient-portal/my-lab-results",
    myPrescriptions: "/patient-portal/my-prescriptions",
  },
} as const;
