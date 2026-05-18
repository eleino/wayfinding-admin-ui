import { RouterProvider, createRouter } from "@tanstack/react-router"
import { AppRouter } from "./routes/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { HTTPError } from "ky";

const retryOn429 = (failureCount: number, error: unknown) => {
  const err = error as HTTPError;
  if ( err?.response?.status === 429) return true;
  return failureCount < 3;
};

const retryDelay = (attempt: number, error: unknown) => {
  const err = error as HTTPError;
  if (err?.response?.status === 429) { // too many requests error
    const retryAfter = err.response.headers.get('Retry-After');
    return (retryAfter ? parseInt(retryAfter, 10) : 10) * 1000;
  }
  return Math.min(1000 * 2 ** attempt, 30000); // exponential backoff for other errors
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10*60*1000, // 10 minutes
    },
    mutations: {
      retry: retryOn429,
      retryDelay: retryDelay,
    }
  },
});

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={createRouter({ routeTree: AppRouter })} />
    </QueryClientProvider>
  );
}

export default App
