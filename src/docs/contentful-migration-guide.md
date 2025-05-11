
# Contentful Migration Guide

## Overview

This guide documents the transition from our previous CMS implementations to Contentful as the primary content management system.

## Migration Phases

1. **Initial Deprecation (Completed)**
   - Added deprecation warnings to legacy systems
   - Updated documentation to refer to Contentful
   - Created initial implementations of Contentful adapters

2. **Admin Interface Updates (Completed)**
   - Added clear visual indicators in admin UI
   - Implemented "View in Contentful" buttons
   - Created deprecation statistics dashboard
   - Made admin interfaces read-only

3. **Progressive Removal (In Progress)**
   - Replacing write operations with read-only implementations
   - Consolidating duplicative code
   - Creating clear migration paths
   - Adding toast notifications for deprecated functionality
   - Tracking usage of deprecated functions to prioritize cleanup

4. **Schema Cleanup (Planned - Q3 2025)**
   - Remove legacy database schemas
   - Update API endpoints to use Contentful directly
   - Complete removal of deprecated adapters

5. **Final Validation (Planned - Q4 2025)**
   - Complete testing of all functionality
   - Remove all deprecated code
   - Finalize documentation

## Migration Patterns

### Adapter Pattern

We use an adapter pattern to abstract away the CMS implementation details:

```typescript
// Before migration:
const adapter = getCMSAdapter(config); // Could return Strapi, Supabase, etc.

// After migration:
const adapter = getCMSAdapter(config); // Always returns Contentful
```

### Read-Only Pattern

For deprecated write operations, we follow this pattern:

```typescript
// All write operations now throw clear errors
export async function updateEntity(id: string, data: any): Promise<boolean> {
  // Log deprecation warning
  logDeprecationWarning('updateEntity', 'Use Contentful directly');
  
  // Show UI notification
  toast({
    title: "Deprecated Feature",
    description: "Please use Contentful directly for content management.",
    variant: "destructive",
  });
  
  // Throw informative error
  throw new Error("This operation is disabled. Please use Contentful directly.");
}
```

### Redirection Pattern

For admin interfaces, we use this redirection pattern:

```typescript
// Replace admin forms with redirects to Contentful
const AdminEntityEditor = () => {
  // Show deprecation warnings
  useEffect(() => {
    logDeprecationWarning('AdminEntityEditor', 'Use Contentful directly');
    
    // Show UI notification
    toast({
      title: "Content Management Moved",
      description: "This functionality has moved to Contentful CMS.",
      variant: "destructive",
    });
  }, []);
  
  // Provide a button to redirect to Contentful
  return (
    <ContentfulRedirector 
      contentType="entityType"
      entityId={entityId}
    />
  );
};
```

### Data Structures

All data structures now follow Contentful's content model:

- Products
- Business Goals
- Technologies
- Machines
- Case Studies

### Critical Migration Paths

These components and hooks have been identified as critical paths:

1. `useContentfulProducts()` - Used in Homepage, Products page
2. `useFeaturedProducts()` - Used in Homepage  
3. `useContentfulMachines()` - Used in Machines page
4. `useFeaturedMachines()` - Used in Homepage
5. `useMachineBySlug()` - Used in Machine detail pages

## Using Contentful Directly

### Content Types

| Entity | Content Type ID | Description |
|--------|----------------|-------------|
| Product | `product` | Products offered |
| Machine | `machine` | Physical machines |  
| Technology | `technology` | Technology platform |
| Business Goal | `businessGoal` | Business goals |
| Case Study | `caseStudy` | Customer success stories |

### Recommended Approach for New Development

For new development, always:

1. Use the Contentful adapters directly
2. Reference content by ID rather than slug when possible
3. Leverage React Query for data fetching and caching
4. Use type definitions from `@/types/cms.ts`

## Deprecation Tracking

We've implemented a deprecation tracking system to:

1. Log when deprecated functions are called
2. Monitor which parts of the application are still using legacy code
3. Display statistics in the admin dashboard
4. Help prioritize migration efforts

### Usage Statistics

To view deprecation usage statistics:

1. Navigate to `/admin/deprecation-stats` in the admin portal
2. Review which features are still being used
3. Use the data to prioritize your migration efforts

## Resources

- [Contentful Web App](https://app.contentful.com/)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Internal Contentful Implementation Docs](./contentful-implementation.md)

## Timeline

- **Q2 2025**: Complete Phase 3 (Progressive Removal)
- **Q3 2025**: Complete Phase 4 (Schema Cleanup)
- **Q4 2025**: Complete Phase 5 (Final Validation)
- **Q1 2026**: Complete removal of all deprecated code

## Recently Completed Tasks

- ✅ Fixed build errors in mock adapter implementations
- ✅ Created centralized deprecation warning utilities
- ✅ Implemented read-only pattern for all business goal operations
- ✅ Added redirector components for admin interfaces
- ✅ Updated documentation with detailed migration patterns

## Next Steps

- 🔄 Complete review of remaining admin interfaces
- 🔄 Consolidate redundant utility functions
- 🔄 Update adapter interfaces to be more consistent
- 🔄 Enhance usage tracking to provide more detailed reports

