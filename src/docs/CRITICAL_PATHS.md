
# Critical Code Paths Documentation

This document outlines the critical code paths in the application related to CMS functionality. These paths should be modified with extreme caution and thoroughly tested to ensure application stability.

## Critical Data Flow

```
Homepage
├─ useHomepageItems
│  ├─ useFeaturedProducts → useContentfulProducts
│  ├─ useFeaturedMachines → fetchMachines
│  └─ useFeaturedBusinessGoals → businessGoalOperations.fetchAll
│
Products Page
├─ useContentfulProducts
│
Machines Page
├─ useMachines → useContentfulMachines
│
Product Detail Page
├─ useContentfulProduct
│
Machine Detail Page
├─ useMachineBySlug → fetchMachines, fetchMachineById
   OR
├─ useContentfulMachine
│
Business Goals Page
├─ useBusinessGoals → useContentfulBusinessGoals
```

## Critical Hooks

### Product Data Hooks

| Hook | Used In | Critical Note |
|------|---------|---------------|
| `useContentfulProducts` | Homepage, Products page | Powers all product listings |
| `useFeaturedProducts` | Homepage | Must return valid product data with links |
| `useContentfulProduct` | Product detail pages | Powers individual product pages |

### Machine Data Hooks

| Hook | Used In | Critical Note |
|------|---------|---------------|
| `useContentfulMachines` | Machines page | Powers all machine listings |
| `useFeaturedMachines` | Homepage | Powers machine cards on homepage |
| `useMachineBySlug` | Machine detail pages | Legacy hook used by all machine detail pages |
| `useContentfulMachine` | New machine detail implementations | Direct Contentful machine fetching |

### Business Goals Hooks

| Hook | Used In | Critical Note |
|------|---------|---------------|
| `useContentfulBusinessGoals` | Business goals page | Powers all business goal listings |
| `useFeaturedBusinessGoals` | Homepage | Powers business goal cards on homepage |
| `useBusinessGoal` | Business goal detail pages | Powers individual goal pages |

## Known Issues During Deprecation

1. **Empty Data Arrays**: 
   - Mock implementations that return empty arrays will cause sections to display empty states
   - Always ensure fallback data or proper data fetching for homepage components

2. **Broken Image Links**: 
   - Images must have proper URL formatting with `https:` prefixes
   - The `thumbnail` property is critical for card displays

3. **Invalid Links**: 
   - Ensure all slugs are properly normalized
   - Route patterns must match across the application

## Testing Strategy

Before modifying any critical path:

1. **Homepage Testing**:
   - Verify all sections load with proper data
   - Check that card images display
   - Validate all links work correctly

2. **Listing Page Testing**:
   - Ensure product/machine/goal lists load
   - Verify filtering and sorting functions
   - Test pagination if implemented

3. **Detail Page Testing**:
   - Test multiple different detail pages
   - Verify all content sections load
   - Test any interactive elements

4. **Error Handling**:
   - Test behavior when data is unavailable
   - Verify fallbacks function as expected
   - Check error boundary components

## Deprecation Strategy for Legacy Hooks

1. **Identify Usage**: Document all files importing legacy hooks

2. **Create Wrappers**:
   ```typescript
   // Wrapper approach
   export function useLegacyHook() {
     logDeprecationWarning('useLegacyHook', 'Use useNewHook instead');
     return useNewHook(); // Forward to new implementation
   }
   ```

3. **Replace Gradually**: Update top-level components first, then work down

4. **Dual Implementation Period**: Maintain both implementations temporarily

5. **Final Removal**: Remove legacy implementation after full migration

## Critical Dependencies

The following packages are critical for CMS functionality:
- `contentful` - Primary CMS client
- `@tanstack/react-query` - Data fetching and caching
- `sonner` - Toast notifications used for errors

## Additional Resources

- Review `fallbackMachineData` and `productFallbacks` for expected data structure
- See `src/data/fallbacks/machineFallbacks.ts` for example machine data
- Consult `src/types/cms.ts` for content type definitions
