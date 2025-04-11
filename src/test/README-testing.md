
# Testing Documentation

This project includes a comprehensive testing framework with component tests, end-to-end tests, and regression testing capabilities.

## Testing Setup

The testing framework includes:

1. **Component Tests** - Using Vitest and React Testing Library
2. **End-to-End Tests** - Using Cypress
3. **Regression Testing** - A comprehensive script that runs all tests and generates reports

## Running Tests

### Component Tests

```bash
# Run component tests in watch mode
npm run test

# Run component tests once
npm run test:run
```

### End-to-End Tests

```bash
# Open Cypress UI for development
npm run test:e2e:open

# Run Cypress tests headlessly
npm run test:e2e
```

### Regression Tests

```bash
# Run all tests and generate a report
node src/scripts/run-regression.js --report

# Run only component tests
node src/scripts/run-regression.js --component-only --report

# Run only E2E tests
node src/scripts/run-regression.js --e2e-only --report
```

You can also run regression tests directly from the Admin Dashboard using the "Run Regression Tests" button.

## Adding New Tests

### Component Tests

Place component tests next to their corresponding components with the naming convention `ComponentName.test.tsx`.

Example:
```tsx
// Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { Button } from './Button';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### End-to-End Tests

Add new E2E tests in the `cypress/e2e` directory. Group related tests in subdirectories.

Example:
```ts
// cypress/e2e/admin/products.cy.ts
describe('Admin Products Page', () => {
  it('displays the products list', () => {
    cy.visit('/admin/products');
    cy.contains('h1', 'Products Management').should('be.visible');
  });
});
```

## Best Practices

1. **Test Behavior, Not Implementation** - Focus on what the component does, not how it does it.
2. **Keep Tests Simple** - Each test should test one specific thing.
3. **Use Meaningful Assertions** - Make sure your assertions clearly express what you're testing.
4. **Test Edge Cases** - Test error states, empty states, loading states, etc.
5. **Avoid Test Duplication** - Don't test the same thing multiple times.
