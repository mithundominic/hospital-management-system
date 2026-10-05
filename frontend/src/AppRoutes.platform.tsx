// Responsibility: Platform administration routes with security guard wrapper

import { Route } from "react-router-dom";
import { PlatformGuard } from "@/pages/platform/PlatformGuard";
import * as Pages from "./AppRoutes.pages";

export const platformRoutes = (
  <>
    <Route
      path="platform/hospitals"
      element={
        <PlatformGuard>
          <Pages.PlatformHospitalsPage />
        </PlatformGuard>
      }
    />
    <Route
      path="platform/analytics"
      element={
        <PlatformGuard>
          <Pages.PlatformAnalyticsPage />
        </PlatformGuard>
      }
    />
    <Route
      path="platform/tenants"
      element={
        <PlatformGuard>
          <Pages.TenantManagementPage />
        </PlatformGuard>
      }
    />
  </>
);
