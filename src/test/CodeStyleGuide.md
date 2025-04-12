# Code Style Guide

## Overview

This document outlines the coding standards and best practices for the Vending Platform application. Following these guidelines will ensure consistency across the codebase and make collaboration more efficient.

## General Principles

1. **Readability Over Cleverness**: Write code that's easy to understand rather than code that's clever but difficult to follow.
2. **Consistent Formatting**: Use consistent formatting throughout the codebase.
3. **Self-Documenting Code**: Write code that explains itself through clear naming and structure.
4. **DRY (Don't Repeat Yourself)**: Avoid code duplication by creating reusable components and utilities.
5. **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones.

## TypeScript Guidelines

### Types and Interfaces

1. Use interfaces for defining object shapes and classes that will be implemented:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
```

2. Use type aliases for unions, intersections, and simpler types:

```typescript
type ButtonSize = 'sm' | 'md' | 'lg';
type UserOrAdmin = User | Admin;
```

3. Always define return types for functions:

```typescript
function fetchUser(id: string): Promise<User> {
  // Implementation
}
```

4. Use generics to create reusable, type-safe components:

```typescript
function getFirstItem<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

5. Avoid using `any` - use `unknown` if the type is truly unknown:

```typescript
// Bad
function processData(data: any) {
  return data.value; // Unsafe
}

// Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value;
  }
  return undefined;
}
```

### Error Handling

1. Use try/catch blocks for error handling, especially with async code:

```typescript
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw new Error('Failed to fetch data');
  }
}
```

2. Always include error messages that provide context:

```typescript
// Bad
throw new Error('Failed');

// Good
throw new Error('Failed to update user profile: Network request timed out');
```

## React Guidelines

### Components

1. Use functional components with hooks instead of class components:

```typescript
// Prefer this
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

// Instead of this
class UserProfile extends React.Component<UserProfileProps> {
  render() {
    return <div>{this.props.user.name}</div>;
  }
}
```

2. Split large components into smaller, focused components:

```typescript
// Bad: Large monolithic component
const ProductPage = () => {
  // 200+ lines of code with multiple sections
};

// Good: Split into focused components
const ProductPage = () => {
  return (
    <div>
      <ProductHeader />
      <ProductDetails />
      <RelatedProducts />
      <ProductReviews />
    </div>
  );
};
```

3. Use descriptive names for components:

```typescript
// Bad
const Comp = () => <div>User Profile</div>;

// Good
const UserProfileCard = () => <div>User Profile</div>;
```

4. Use PascalCase for component names and camelCase for variables and functions:

```typescript
// Component (PascalCase)
const ProductCard = () => {...};

// Variables, functions (camelCase)
const fetchProducts = () => {...};
const userProfile = {...};
```

### Props

1. Destructure props in function parameters:

```typescript
// Bad
const UserCard = (props) => {
  return <div>{props.name}</div>;
};

// Good
const UserCard = ({ name, email, role }) => {
  return <div>{name}</div>;
};
```

2. Use default props when applicable:

```typescript
const Button = ({ 
  variant = 'primary',
  size = 'medium',
  children 
}) => {
  return <button className={`btn-${variant} btn-${size}`}>{children}</button>;
};
```

3. Always define prop types:

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({...}) => {...};
```

### Hooks

1. Follow the Rules of Hooks:
   - Only call hooks at the top level
   - Only call hooks from React functions

2. Use custom hooks to reuse stateful logic:

```typescript
// Custom hook
const useProductSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Search logic here
  }, [query]);

  return { query, setQuery, results, loading };
};

// Usage
const ProductSearch = () => {
  const { query, setQuery, results, loading } = useProductSearch();
  // ...
};
```

3. Name hooks with "use" prefix to follow convention:

```typescript
// Good
const useWindowSize = () => {...};

// Bad
const windowSize = () => {...};
```

### File Structure

1. One component per file:

```
// Good
Button.tsx
Card.tsx

// Bad
Components.tsx (containing multiple components)
```

2. Use index files for cleaner imports:

```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';

// Usage
import { Button, Card, Input } from '@/components/ui';
```

3. Organize related components in folders:

```
components/
  ui/
    Button.tsx
    Card.tsx
    Input.tsx
    index.ts
  layout/
    Header.tsx
    Footer.tsx
    Sidebar.tsx
    index.ts
```

## State Management

1. Use React Query for server state management:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts
});
```

2. Use React Context + useReducer for complex global state:

```typescript
// Define context and reducer
const CartContext = createContext<CartState | undefined>(undefined);

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      // Return new state with added item
    case 'REMOVE_ITEM':
      // Return new state without removed item
    default:
      return state;
  }
}

// Provider component
export const CartProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using this context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```

## CSS and Styling

1. Use Tailwind CSS for styling:

```tsx
// Good (using Tailwind)
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click me
</button>

// Bad (using inline styles)
<button style={{ padding: '0.5rem 1rem', backgroundColor: 'blue', color: 'white' }}>
  Click me
</button>
```

2. For component variants, use cva (class-variance-authority):

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg px-6 py-3"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

const Button = ({ variant, size, className, ...props }) => {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }), className)} 
      {...props} 
    />
  );
};
```

3. Use the `cn` utility for conditional class names:

```typescript
import { cn } from '@/lib/utils';

const Card = ({ isActive, className, children }) => {
  return (
    <div 
      className={cn(
        "p-4 rounded shadow",
        isActive && "border-2 border-blue-500",
        className
      )}
    >
      {children}
    </div>
  );
};
```

## Testing

1. Write tests for components, hooks, and utilities:

```tsx
import { render, screen } from '@/test/utils/test-utils';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

2. Test user interactions:

```tsx
import { render, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';

test('calls onClick when clicked', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const user = userEvent.setup();
  await user.click(screen.getByRole('button'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

3. Use data-testid attributes sparingly:

```tsx
// Only when necessary and no better option exists
<div data-testid="product-card">{/* content */}</div>
```

## Documentation

1. Add JSDoc comments for functions and components:

```typescript
/**
 * Formats a price with the specified currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns A formatted price string
 */
function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
```

2. Add TODO comments for code that needs revisiting:

```typescript
// TODO: Optimize this query to reduce database load
function fetchAllProducts() {
  // Implementation
}
```

## Performance

1. Memoize expensive calculations and component renders:

```typescript
// Memoize value
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Memoize callback
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// Memoize component
const MemoizedComponent = memo(MyComponent);
```

2. Use virtualization for long lists:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  
  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Version Control

1. Write meaningful commit messages:

```
// Bad
fix bug

// Good
fix: correct product price calculation in checkout
```

2. Follow conventional commits format:

```
feat: add user profile page
fix: resolve authentication redirect issue
docs: update API documentation
style: format code according to style guide
refactor: simplify product filtering logic
test: add unit tests for cart functionality
chore: update dependencies
```

## Additional Best Practices

1. Avoid prop drilling by using context or composition:

```tsx
// Instead of passing props through multiple layers
<App>
  <Layout user={user}>
    <Sidebar user={user}>
      <Profile user={user} />
    </Sidebar>
  </Layout>
</App>

// Use context
<UserProvider>
  <App>
    <Layout>
      <Sidebar>
        <Profile /> {/* Gets user from context */}
      </Sidebar>
    </Layout>
  </App>
</UserProvider>
```

2. Use portal for modals and overlays:

```tsx
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};
```

3. Handle asynchronous state properly:

```tsx
const ProductPage = ({ id }) => {
  const { data: product, error, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id)
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!product) {
    return <NotFound message="Product not found" />;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      {/* Rest of the component */}
    </div>
  );
};
```
