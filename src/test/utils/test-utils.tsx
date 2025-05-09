
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a query client for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Custom render function that wraps components with necessary providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>,
    options
  );
};

// Export everything from testing-library
export * from '@testing-library/react';

// Explicitly export the DOM testing utilities
export { screen, fireEvent, waitFor };

// Export our custom render function as the render method
export { customRender as render };
