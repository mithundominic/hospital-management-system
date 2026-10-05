// Responsibility: Root application component configuring global providers, query client, and error boundary

import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { PlatformProvider } from "./contexts/PlatformContext";
import { OrganizationProvider } from "./contexts/OrganizationContext";
import { HospitalProvider } from "./contexts/HospitalContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { AppRoutes } from "./AppRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <PlatformProvider>
              <OrganizationProvider>
                <HospitalProvider>
                  <AppRoutes />
                  <Toaster position="top-right" />
                </HospitalProvider>
              </OrganizationProvider>
            </PlatformProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
