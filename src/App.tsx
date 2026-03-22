import { RouterProvider, createRouter } from "@tanstack/react-router"
import { AppRouter } from "./routes/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={createRouter({ routeTree: AppRouter })} />
    </QueryClientProvider>
  );
}

export default App
