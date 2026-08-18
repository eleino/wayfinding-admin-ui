import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./errors";

const retryQuery = (failureCount: number, error: unknown) => {
  if (!(error instanceof ApiError) || !error.retryable) return false;
  return failureCount < (error.status === 429 ? 5 : 3);
};

const retryMutation = (failureCount: number, error: unknown) =>
  error instanceof ApiError && error.status === 429 && failureCount < 5;

const retryDelay = (attempt: number, error: unknown) => {
  if (error instanceof ApiError && error.retryAfterMs !== undefined) {
    return Math.min(error.retryAfterMs, 60000);
  }
  if (error instanceof ApiError && error.status === 429) {
    return 10000;
  }
  if (
    error instanceof ApiError &&
    (error.kind === "network" || error.status === 502 || error.status === 503)
  ) {
    return Math.min(5000 * 2 ** attempt, 60000);
  }
  return Math.min(1000 * 2 ** attempt, 30000);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      retry: retryQuery,
      retryDelay,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: retryMutation,
      retryDelay,
    },
  },
});
