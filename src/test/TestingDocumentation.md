
# Testing Documentation for Vending Platform

## Overview

This document provides detailed information about the testing approach for the Vending Platform application. It covers the different types of tests implemented, how to run them, and best practices for adding new tests.

## Testing Types

### 1. Unit Tests

Unit tests focus on testing individual components or functions in isolation. We use Vitest for these tests.

#### Key Areas Covered:
- Component rendering
- Hook functionality
- Utility functions
- Service layer operations

#### Example:

```tsx
// Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('handles click events', async () => {
    const onClickMock = vi.fn();
    const { user } = render(<Button onClick={onClickMock}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Integration Tests

Integration tests verify that different components work together correctly. These tests often involve mocked API responses and test the flow between multiple components.

#### Example:

```tsx
// ProductListing.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import ProductListing from '@/components/products/ProductListing';
import * as productService from '@/services/product';

vi.mock('@/services/product', () => ({
  fetchProducts: vi.fn()
}));

describe('ProductListing integration', () => {
  it('displays products when loaded', async () => {
    // Mock the API response
    vi.mocked(productService.fetchProducts).mockResolvedValue([
      { id: '1', name: 'Coffee Machine', price: 1200 }
    ]);
    
    render(<ProductListing />);
    
    // Initially shows loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Then shows products
    await waitFor(() => {
      expect(screen.getByText('Coffee Machine')).toBeInTheDocument();
      expect(screen.getByText('$1,200')).toBeInTheDocument();
    });
  });
});
```

### 3. End-to-End Tests

E2E tests simulate user interactions across multiple pages. We use Cypress for these tests.

#### Example:

```js
// cypress/e2e/product-purchase.cy.js
describe('Product purchase flow', () => {
  it('allows a user to view and purchase a product', () => {
    // Visit the products page
    cy.visit('/products');
    
    // Click on a product
    cy.contains('Coffee Machine').click();
    
    // Verify product details page loaded
    cy.contains('Product Details').should('be.visible');
    
    // Add to cart
    cy.contains('Add to Cart').click();
    
    // Go to cart
    cy.get('[data-testid="cart-icon"]').click();
    
    // Verify product is in cart
    cy.contains('Coffee Machine').should('be.visible');
    
    // Start checkout
    cy.contains('Checkout').click();
    
    // Fill in shipping information
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    // ... fill in other fields
    
    // Complete purchase
    cy.contains('Complete Purchase').click();
    
    // Verify success message
    cy.contains('Thank you for your purchase').should('be.visible');
  });
});
```

### 4. Visual Regression Tests

Visual regression tests capture screenshots of components and compare them against baseline images to catch unintended visual changes.

## Running Tests

### Unit and Integration Tests

```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### End-to-End Tests

```bash
# Open Cypress test runner
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

### Visual Regression Tests

```bash
# Update baseline images
npm run test:visual-update

# Run visual regression tests
npm run test:visual
```

## Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on what your component does, not how it does it.

2. **Descriptive Test Names**: Use descriptive test names that explain what behavior is being tested.

3. **Arrange-Act-Assert Pattern**: Structure tests with clear arrangement, action, and assertion phases.

4. **Mock External Dependencies**: Use mocks for external dependencies like API calls to maintain test isolation.

5. **Test Edge Cases**: Include tests for error states, empty states, loading states, and boundary conditions.

6. **Keep Tests Fast**: Optimize tests to run quickly to ensure they're run frequently during development.

7. **Avoid Test Duplication**: Don't repeat the same test logic across multiple test files.

8. **Clean Up After Tests**: Ensure tests clean up any resources they use to avoid affecting other tests.

9. **Test Accessibility**: Include tests for accessibility features using tools like jest-axe.

## Directory Structure

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.test.tsx
├── hooks/
│   ├── useHookName.ts
│   └── useHookName.test.ts
├── services/
│   ├── serviceFile.ts
│   └── serviceFile.test.ts
└── test/
    ├── utils/
    │   ├── test-utils.tsx
    │   └── mocks/
    ├── fixtures/
    └── TestingDocumentation.md
```

## Adding New Tests

When adding new functionality, always include corresponding tests:

1. For components, create a `.test.tsx` file alongside the component file
2. For hooks, create a `.test.ts` file alongside the hook file
3. For services, create a `.test.ts` file alongside the service file
4. For E2E tests, add new test files in the appropriate Cypress directory

## CI/CD Integration

Tests are automatically run in our CI/CD pipeline:

1. Unit and integration tests run on every pull request
2. E2E tests run on merges to main branches
3. Visual regression tests run on deployment to staging

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
