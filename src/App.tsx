import { useContext, useEffect } from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AppRouter } from "./routes/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiError } from "@api/errors";
import { AuthContext } from "@auth/authContext";

const retryQuery = (failureCount: number, error: unknown) => {
  if (!(error instanceof ApiError) || !error.retryable) return false;
  return failureCount < (error.status === 429 ? 5 : 3);
};

// only retry mutations on 429 errors (too many requests)
const retryMutation = (failureCount: number, error: unknown) => {
  return (
    error instanceof ApiError &&
    error.status === 429 &&
    failureCount < 5
  );
};

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
    // longer delay for network errors and server errors to avoid spam
    return Math.min(5000 * 2 ** attempt, 60000);
  }
  return Math.min(1000 * 2 ** attempt, 30000);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10*60*1000, // 10 minutes
      retry: retryQuery,
      retryDelay: retryDelay,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: retryMutation,
      retryDelay: retryDelay,
    }
  },
});

const router = createRouter({
  routeTree: AppRouter,
  basepath: import.meta.env.BASE_URL,
  context: {
    auth: undefined!,
  },
});

function App() {
  const auth = useContext(AuthContext);

  // Update the router context with the current auth state whenever it changes
  useEffect(() => {
    void router.invalidate();
  }, [auth.isAuthenticated, auth.userRole]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
    </QueryClientProvider>
  );
}

export default App
