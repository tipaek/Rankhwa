import { QueryClient } from '@tanstack/react-query';

/**
 * A singleton QueryClient instance used across the application.  It
 * specifies global defaults such as avoiding refetches on window
 * focus and using a small cache time for stale data.  Consumers
 * should import this rather than creating their own clients.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Avoid retrying unauthorized responses since they'll immediately fail again.
        if (error instanceof Error && error.message === 'Unauthorized') {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});