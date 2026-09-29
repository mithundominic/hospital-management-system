// Responsibility: Centralized API endpoint route constants and URL builders

export const API_ROUTES = {
  hospitals: {
    list: "/hospitals",
    detail: (hId: string) => `/hospitals/${hId}`,
    patients: (hId: string) => `/hospitals/${hId}/patients`,
    patient: (hId: string, pId: string) => `/hospitals/${hId}/patients/${pId}`,
    doctors: (hId: string) => `/hospitals/${hId}/doctors`,
    appointments: (hId: string, date?: string) =>
      date
        ? `/hospitals/${hId}/appointments?date=${date}`
        : `/hospitals/${hId}/appointments`,
    appointment: (hId: string, id: string) =>
      `/hospitals/${hId}/appointments/${id}`,
    encounters: (hId: string, patientId?: string) =>
      patientId
        ? `/hospitals/${hId}/encounters?patient_id=${patientId}`
        : `/hospitals/${hId}/encounters`,
    encounter: (hId: string, id: string) =>
      `/hospitals/${hId}/encounters/${id}`,
    prescriptions: (hId: string) => `/hospitals/${hId}/prescriptions`,
    labOrders: (hId: string) => `/hospitals/${hId}/lab-orders`,
    labOrder: (hId: string, id: string) => `/hospitals/${hId}/lab-orders/${id}`,
    labOrderResults: (hId: string, id: string) =>
      `/hospitals/${hId}/lab-orders/${id}/results`,
    invoices: (hId: string) => `/hospitals/${hId}/invoices`,
    invoice: (hId: string, id: string) => `/hospitals/${hId}/invoices/${id}`,
    insuranceClaims: (hId: string) => `/hospitals/${hId}/insurance-claims`,
    insuranceClaim: (hId: string, id: string) =>
      `/hospitals/${hId}/insurance-claims/${id}`,
    beds: (hId: string) => `/hospitals/${hId}/beds`,
    admissions: (hId: string) => `/hospitals/${hId}/admissions`,
    admission: (hId: string, id: string) =>
      `/hospitals/${hId}/admissions/${id}`,
    inventory: (hId: string) => `/hospitals/${hId}/inventory`,
    inventoryTransactions: (hId: string, itemId: string) =>
      `/hospitals/${hId}/inventory/${itemId}/transactions`,
    shifts: (hId: string) => `/hospitals/${hId}/shifts`,
    shift: (hId: string, id: string) => `/hospitals/${hId}/shifts/${id}`,
    memberships: (hId: string) => `/hospitals/${hId}/memberships`,
    abdm: {
      linkRequests: (hId: string, pId: string) =>
        `/hospitals/${hId}/patients/${pId}/abdm/link-requests`,
      verify: (hId: string, pId: string) =>
        `/hospitals/${hId}/patients/${pId}/abdm/verify`,
      confirm: (hId: string, pId: string) =>
        `/hospitals/${hId}/patients/${pId}/abdm/confirm`,
      consentRequests: (hId: string, pId: string) =>
        `/hospitals/${hId}/patients/${pId}/abdm/consent-requests`,
      consents: (hId: string, pId: string) =>
        `/hospitals/${hId}/patients/${pId}/abdm/consents`,
      linkCareContext: (hId: string, pId: string) =>
        `/hospitals/${hId}/patients/${pId}/abdm/link-care-context`,
    },
    reports: {
      bedOccupancy: (hId: string) => `/hospitals/${hId}/reports/bed-occupancy`,
      dailyRevenue: (hId: string) => `/hospitals/${hId}/reports/daily-revenue`,
      lowStock: (hId: string) => `/hospitals/${hId}/reports/low-stock`,
    },
  },
  patients: {
    insurancePolicies: (pId: string) => `/patients/${pId}/insurance-policies`,
    insurancePolicy: (pId: string, id: string) =>
      `/patients/${pId}/insurance-policies/${id}`,
  },
} as const;
