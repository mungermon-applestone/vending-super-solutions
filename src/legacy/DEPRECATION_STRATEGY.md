
# CMS Code Deprecation Strategy

## Background

The application was originally designed to work with both Contentful and Supabase as CMS providers. However, the actual implementation primarily uses Contentful, with Supabase functionality being mostly unused or incomplete.

## Deprecation Plan

### Phase 1: Isolation (Current)

- ✅ Create a dedicated "legacy" folder for deprecated code
- ✅ Move mock implementations there with clear deprecation notices
- ✅ Update imports to point to new location
- ✅ Add usage monitoring to identify active usage patterns

### Phase 2: Clean Up Admin Interface

- [ ] Update the Admin dashboard
  - [ ] Remove or disable features that rely on deprecated Supabase functionality
  - [ ] Add clear UI indicators for features that are Contentful-only
- [ ] Consolidate CMS configuration
  - [ ] Focus solely on Contentful configuration
  - [ ] Remove or disable Strapi/Supabase CMS configuration options

### Phase 3: Progressive Removal

- [ ] Start removing the least integrated deprecated modules
  - [ ] Begin with utility functions like data migration
  - [ ] Move to larger services that aren't in the critical path
- [ ] Test extensively after each removal

### Phase 4: Schema Cleanup

- [ ] Assess whether Supabase tables can be safely removed
- [ ] If safe, create SQL to clean up unused tables

## Usage Monitoring

A monitoring system has been implemented to track usage of deprecated functions. This helps identify which parts of the legacy code are still being used and prioritize removal efforts.

In development mode, press `Ctrl+Shift+M` to toggle the LegacyMonitor overlay, which displays usage statistics for deprecated functions.

## Guidelines for Developers

1. Do not use functions or components from the `src/legacy` directory in new code
2. When encountering code that imports from legacy modules, consider refactoring to use primary implementations
3. Before removing any legacy code, check the usage statistics to ensure it's not being called
4. Test thoroughly after any changes to legacy code or its removal

## Timeline

The deprecation process should be completed incrementally:

1. Phase 1: Complete
2. Phase 2: Next Sprint
3. Phase 3: Following Sprint
4. Phase 4: Final Sprint
