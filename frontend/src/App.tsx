// Responsibility: Root application component configuring global providers, query client, and error boundary

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { HospitalProvider } from './contexts/HospitalContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppRoutes } from './AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <HospitalProvider>
              <AppRoutes />
              <Toaster position="top-right" />
            </HospitalProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
