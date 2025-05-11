
# CMS Migration Guide: From Legacy to Contentful

## Overview

This document outlines the migration strategy from legacy CMS implementations (Strapi, direct DB) to Contentful. It provides guidance for developers working with the codebase during this transition period.

## Current Status

As of May 2025, we are in the process of:
- Removing all legacy CMS adapters (Strapi, Supabase direct)
- Consolidating on Contentful as our single CMS provider
- Deprecating old admin interfaces in favor of direct Contentful management

## For Developers

### Working with Deprecated Types

Several type definitions and utilities have been moved to compatibility layers:

1. Machine Types:
   - Old import: `@/utils/machineMigration/types`
   - New recommended import: Use Contentful types directly from `@/types/cms`

2. Technology Types:
   - Old import: Various legacy locations
   - New recommended import: Use Contentful types directly from `@/types/cms`

### Configuration

1. Legacy CMS configurations:
   - Old: Various configuration files for Strapi and direct DB access
   - New: Use Contentful configuration utilities in `@/services/cms/utils/contentfulConfig`

### Adapters

We've simplified all adapter factories to return Contentful implementations:

1. Previously:
```typescript
import { getConfiguredAdapter } from '../adapterFactory';
const adapter = getConfiguredAdapter('strapi'); // or 'contentful', 'supabase'
```

2. Now (recommended):
```typescript
import { contentfulProductAdapter } from './contentfulProductAdapter';
const adapter = contentfulProductAdapter;
```

## Timeline

- **Phase 1:** ✅ Implement Contentful adapters
- **Phase 2:** ✅ Deprecate non-Contentful adapters
- **Phase 3:** 🔄 Provide compatibility layers (current phase)
- **Phase 4:** ⏳ Remove compatibility layers and legacy code

## Need Help?

Contact the engineering team for assistance with this migration.

