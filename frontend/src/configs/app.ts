// Responsibility: App-wide configuration — metadata, pagination, table limits, and currency

export const appConfig = {
  name: "Hospital Management System",
  shortName: "HMS",
  description: "Multi-Tenant Healthcare Operations & EMR Platform",
  currency: {
    symbol: "₹",
    code: "INR",
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },
  table: {
    defaultRowsPerPage: 10,
    compactRowsPerPage: 5,
  },
  timeouts: {
    requestTimeoutMs: 30000,
    debounceMs: 300,
  },
} as const;
