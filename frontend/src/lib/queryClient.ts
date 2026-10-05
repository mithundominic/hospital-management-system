// Responsibility: TanStack Query client configuration with production caching defaults

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});
