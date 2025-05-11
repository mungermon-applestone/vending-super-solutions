
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

## Resources

- [Contentful Web App](https://app.contentful.com/)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Internal Contentful Implementation Docs](./contentful-implementation.md)

## Timeline

- **Q2 2025**: Complete Phase 3 (Progressive Removal)
- **Q3 2025**: Complete Phase 4 (Schema Cleanup)
- **Q4 2025**: Complete Phase 5 (Final Validation)
- **Q1 2026**: Complete removal of all deprecated code
