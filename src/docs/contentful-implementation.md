
# Contentful Implementation Guide

## Overview
Our application uses Contentful as the primary CMS provider. Here's how it works:

1. **Initialization**
   - We use `forceContentfulProvider()` in `main.tsx` to ensure Contentful is always used
   - This sets up the ContentProviderType.CONTENTFUL in our provider configuration

2. **Adapter Pattern**
   - Each content type (products, machines, etc.) has its own adapter
   - Adapters implement a common interface defined in their respective types.ts files
   - The adapter factory pattern allows us to switch between different CMS providers if needed

3. **Data Fetching Flow**
   ```typescript
   // 1. Hook calls adapter
   useContentfulProduct(slug)
     // 2. Adapter uses Contentful client
     -> contentfulProductAdapter.getBySlug(slug)
       // 3. Client makes API request
       -> getContentfulClient().getEntries()
   ```

4. **Error Handling**
   - Each adapter includes comprehensive error logging
   - DiagnosticInfo components display debugging information in development
   - ContentfulErrorBoundary catches and handles Contentful-specific errors

5. **Content Types**
   Products:
   - Title (required)
   - Slug (required, unique)
   - Description (required)
   - Image (optional)
   - Benefits (optional array)
   - Features (optional array of references)
   - Recommended Machines (optional array of references)

## Adding New Content Types
1. Create adapter in `src/services/cms/adapters/[content-type]`
2. Implement required interface methods (getAll, getBySlug, etc.)
3. Add factory function to select appropriate adapter
4. Create React hooks for data fetching
5. Add error boundaries and diagnostic components as needed

## Best Practices
- Always use TypeScript interfaces for content types
- Implement comprehensive error handling
- Add diagnostic information for debugging
- Keep adapters focused and single-responsibility
- Use React Query for caching and state management
