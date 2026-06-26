import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PathEditStepsTestProvider, type PathEditStepsProviderProps } from './form';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// for rendering components that need Tanstack query hooks in tests
export const renderWithQuery = (ui: ReactElement, options?: RenderOptions) => {

  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
    );
  }
  return { ...render(ui, { wrapper: Wrapper, ...options }), queryClient };
}

// for rendering components that need PathEditStepsContext in tests
export const renderWithPathEditStepsProvider = (ui: ReactElement, args: PathEditStepsProviderProps, options?: RenderOptions) => {

    const queryClient = createTestQueryClient();

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
            <PathEditStepsTestProvider {...args}>
                {children}
            </PathEditStepsTestProvider>
            </QueryClientProvider>
        );
    }
    return { ...render(ui, { wrapper: Wrapper, ...options }), queryClient };
}