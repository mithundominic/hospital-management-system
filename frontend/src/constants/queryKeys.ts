// Responsibility: Centralized React Query key factories for cache invalidation and query deduplication

export const QUERY_KEYS = {
  hospitals: {
    all: ["hospitals"] as const,
    dashboardStats: (hospitalId?: string) =>
      ["dashboard-stats", hospitalId] as const,
    patients: (hospitalId?: string) => ["patients", hospitalId] as const,
    patientDetail: (hospitalId?: string, patientId?: string) =>
      ["patient", hospitalId, patientId] as const,
    doctors: (hospitalId?: string) => ["doctors", hospitalId] as const,
    appointments: (hospitalId?: string, date?: string) =>
      date
        ? (["appointments", hospitalId, date] as const)
        : (["appointments", hospitalId] as const),
    encounters: (hospitalId?: string, patientId?: string) =>
      patientId
        ? (["encounters", hospitalId, patientId] as const)
        : (["encounters", hospitalId] as const),
    labOrders: (hospitalId?: string) => ["lab-orders", hospitalId] as const,
    invoices: (hospitalId?: string) => ["invoices", hospitalId] as const,
    insuranceClaims: (hospitalId?: string) =>
      ["insurance-claims", hospitalId] as const,
    beds: (hospitalId?: string) => ["beds", hospitalId] as const,
    admissions: (hospitalId?: string) => ["admissions", hospitalId] as const,
    inventory: (hospitalId?: string) => ["inventory", hospitalId] as const,
    shifts: (hospitalId?: string) => ["shifts", hospitalId] as const,
    memberships: (hospitalId?: string) => ["memberships", hospitalId] as const,
    abdm: {
      linkRequests: (hospitalId?: string, patientId?: string) =>
        ["abdm-link-requests", hospitalId, patientId] as const,
      consentArtifacts: (hospitalId?: string, patientId?: string) =>
        ["consent-artifacts", hospitalId, patientId] as const,
      linkedContexts: (patientId?: string) =>
        ["linked-contexts", patientId] as const,
    },
    reports: {
      bedOccupancy: (hospitalId?: string) =>
        ["reports-bed-occupancy", hospitalId] as const,
      revenue: (hospitalId?: string) =>
        ["reports-revenue", hospitalId] as const,
      lowStock: (hospitalId?: string) =>
        ["reports-low-stock", hospitalId] as const,
    },
  },
} as const;
