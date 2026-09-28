// Responsibility: Shared field validation constraints — lengths, ranges, and patterns

export const VALIDATION_RULES = {
  PATIENT: {
    NAME_MIN: 2,
    NAME_MAX: 100,
    PHONE_LENGTH: 10,
    ADDRESS_MAX: 500,
  },
  INVOICE: {
    ITEM_NAME_MIN: 2,
    ITEM_NAME_MAX: 100,
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 1000,
    MIN_UNIT_PRICE: 0,
  },
  PHARMACY: {
    NAME_MIN: 2,
    NAME_MAX: 100,
    MIN_STOCK: 0,
    MIN_UNIT_PRICE: 0,
  },
  APPOINTMENT: {
    REASON_MAX: 500,
  },
} as const;
