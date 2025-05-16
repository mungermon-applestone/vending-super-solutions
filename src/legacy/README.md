
# Legacy Code

This folder contains deprecated code that is being phased out. These implementations are kept temporarily to avoid breaking changes, but they should not be used for new development.

## Critical Path Warning ⚠️

The following hooks and services are considered critical paths in the application and require careful testing before modification:

- `useContentfulProducts()` - Powers product display across the site
- `useContentfulMachines()` - Powers machine display across the site
- `useFeaturedProducts()` - Used by the homepage to display products
- `useFeaturedMachines()` - Used by the homepage to display machines
- `useMachineBySlug()` - Used by individual machine pages for display

Modifications to these hooks may cause broken functionality on:
- Homepage product/machine cards
- Product/machine listings
- Individual detail pages

**Always test thoroughly across these pages after any changes to CMS hook implementations.**

## Deprecation Plan

1. Phase 1: Isolation (Current) - Move deprecated code to this folder
2. Phase 2: Clean up Admin Interface - Remove or disable features that rely on deprecated functionality
3. Phase 3: Progressive Removal - Gradually remove unused modules
4. Phase 4: Schema Cleanup - Remove unused database tables

Please use the primary CMS implementation (Contentful) for all new development.

## Testing Requirements

Before modifying any CMS functionality:
1. Test homepage display of all content types
2. Test individual listing pages (/products, /machines, etc.)
3. Test detail pages with various slugs
4. Verify images and links work correctly

See `src/docs/CRITICAL_PATHS.md` for detailed documentation on critical code paths.
