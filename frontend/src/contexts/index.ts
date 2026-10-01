// Responsibility: Barrel exports for all context providers and hooks

export { HospitalProvider, HospitalContext } from "./HospitalContext";
export { useHospital } from "./useHospital";
export { AuthProvider, useAuth } from "./AuthContext";
// Types should be imported from their original source: @/types/hospital
// export type { Hospital, HospitalContextType } from "./HospitalContext";
