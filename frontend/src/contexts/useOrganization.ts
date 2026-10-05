// Responsibility: Hook for consuming OrganizationContext

import { createContext, useContext } from "react";
import type { OrganizationContextType } from "@/types/organization";

export const OrganizationContext = createContext<
  OrganizationContextType | undefined
>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider",
    );
  }
  return context;
};
