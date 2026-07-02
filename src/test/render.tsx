import { act, render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  PathEditStepsTestProvider,
  type PathEditStepsProviderProps,
} from "./form";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });

interface RenderWithRouterOptions extends RenderOptions {
  searchParams?: Record<string, number | boolean | undefined | string>;
  path?: string;
}

export const createTestRouter = (
  ui: ReactElement,
  initialSearch: Record<string, number | boolean | undefined | string> = {},
  path = "/",
) => {
  const rootRoute = createRootRoute();

  // Clean the search params to remove undefined or null values and convert values to strings
  const cleanSearch: Record<string, string> = {};
  Object.entries(initialSearch).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cleanSearch[key] = String(value);
    }
  });
  const TestRoute = createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: () => ui,
  });

  const routeTree = rootRoute.addChildren([TestRoute]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [
        `${path}?${new URLSearchParams(cleanSearch).toString()}`,
      ],
    }),
  });
};

// for rendering components that need Tanstack query hooks in tests
export const renderWithQuery = async (
  ui: ReactElement,
  options?: RenderWithRouterOptions,
) => {
  const queryClient = createTestQueryClient();
  const { searchParams = {}, path = "/", ...restOptions } = options || {};

  const router = createTestRouter(ui, searchParams, path);

  await act(async () => {
    await router.load();
  });
  function Wrapper() {
    return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  }
  return {
    ...render(<></>, { wrapper: Wrapper, ...restOptions }),
    queryClient,
  };
};

// for rendering components that need PathEditStepsContext in tests
export const renderWithPathEditStepsProvider = async (
  ui: ReactElement,
  args: PathEditStepsProviderProps,
  options?: RenderWithRouterOptions,
) => {
  const queryClient = createTestQueryClient();

  const { searchParams = {}, path = "/", ...restOptions } = options || {};

  const router = createTestRouter(ui, searchParams, path);

  await act(async () => {
    await router.load();
  });

  function Wrapper() {
    return (
      <QueryClientProvider client={queryClient}>
        <PathEditStepsTestProvider {...args}>
          <RouterProvider router={router} />
        </PathEditStepsTestProvider>
      </QueryClientProvider>
    );
  }
  return {
    ...render(<></>, { wrapper: Wrapper, ...restOptions }),
    queryClient,
  };
};
