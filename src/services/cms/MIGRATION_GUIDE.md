
# CMS Migration Guide: From Legacy to Contentful

## Overview

This document outlines the migration strategy from legacy CMS implementations (Strapi, direct DB) to Contentful. It provides guidance for developers working with the codebase during this transition period.

## Current Status

As of May 2025, we have completed the following migration steps:

1. ✅ Implementation of Contentful adapters for all content types
2. ✅ Deprecation of non-Contentful adapters
3. ✅ Addition of compatibility layers for legacy code
4. ✅ Implementation of deprecation tracking system
5. ✅ Creation of adapter compatibility layer to bridge different method naming conventions
6. 🔄 Conversion of admin interfaces to read-only views
7. 🔄 Removal of mock database operations
8. ⏳ Complete removal of compatibility layers

## Timeline

- **Phase 1:** ✅ Implement Contentful adapters (Completed January 2025)
- **Phase 2:** ✅ Deprecate non-Contentful adapters (Completed March 2025)
- **Phase 3:** ✅ Provide compatibility layers & method name bridging (Completed May 2025)
- **Phase 4:** 🔄 Convert interfaces to read-only (In progress - May 2025)
- **Phase 5:** ⏳ Remove compatibility layers and legacy code (Scheduled for July 2025)

## For Developers

### Using the New System

All content management should now be done directly in Contentful. The application code should:

1. Import adapters directly from their specific modules:
   ```typescript
   // Correct approach
   import { contentfulProductAdapter } from '@/services/cms/adapters/products/contentfulProductAdapter';
   
   // Deprecated approach - do not use
   import { getProductAdapter } from '@/services/cms/adapters/products/productAdapterFactory';
   ```

2. Use Contentful content type IDs:
   | Entity | Content Type ID | Description |
   |--------|----------------|-------------|
   | Product | `product` | Products offered |
   | Machine | `machine` | Physical machines |  
   | Technology | `technology` | Technology platform |
   | Business Goal | `businessGoal` | Business goals |
   | Case Study | `caseStudy` | Customer success stories |

3. Reference environment variables from the Contentful configuration:
   ```typescript
   import { getContentfulConfig } from '@/services/cms/utils/contentfulConfig';
   
   const { spaceId, accessToken } = getContentfulConfig();
   ```

### Method Name Compatibility

We've added a compatibility layer to bridge different method naming conventions:

```typescript
// BusinessGoalAdapter uses getAll, getBySlug, getById methods
// ContentTypeOperations uses fetchAll, fetchBySlug, fetchById methods

// This compatibility layer creates a unified interface
const compatibleAdapter = makeContentTypeOperationsCompatible(
  businessGoalAdapter,
  'businessGoal'
);

// Now compatibleAdapter has both sets of methods:
// - Original methods: getAll, getBySlug, getById 
// - Compatibility methods: fetchAll, fetchBySlug, fetchById
```

### Working with Deprecated Types

All legacy types have been moved to compatibility layers and should not be used in new code:

1. Machine Types:
   - Old import (deprecated): `@/utils/machineMigration/types`
   - New recommended import: `@/types/cms`

2. Business Goal Types:
   - Old import (deprecated): Various legacy locations
   - New recommended import: `@/types/cms`

3. Product Types:
   - Old import (deprecated): Various adapter-specific interfaces
   - New recommended import: `@/types/cms`

### Admin Interface

All admin interfaces are now read-only views with clear redirects to Contentful:

1. Product editing is now done in Contentful directly
2. Business Goal management is now done in Contentful directly
3. Technology content management is now done in Contentful directly

### Identifying Deprecated Code

All deprecated code includes:

1. Clear `@deprecated` JSDoc annotations
2. Runtime deprecation warnings via `logDeprecationWarning()`
3. Usage tracking via our deprecation monitoring system

You can view usage statistics of deprecated features in the admin dashboard.

## Removal Schedule

The following components and modules are scheduled for complete removal:

| Component/Module | Removal Date |
|------------------|--------------|
| Strapi configuration | July 2025 |
| Supabase direct database operations | July 2025 |
| Legacy admin interfaces | August 2025 |
| Compatibility types | August 2025 |
| Deprecation tracking system | September 2025 |

## Need Help?

Contact the engineering team for assistance with this migration.
