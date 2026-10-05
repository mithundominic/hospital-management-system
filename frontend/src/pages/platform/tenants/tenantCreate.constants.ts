// Responsibility: Static configuration options for tenant creation form

export const TIMEZONES = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "America/New_York", label: "America/New_York (EST)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
] as const;

export const LOCALES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
] as const;

export const CURRENCIES = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
] as const;
