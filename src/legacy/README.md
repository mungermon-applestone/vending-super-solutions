
# Legacy Code

This folder contains deprecated code that is being phased out. These implementations are kept temporarily to avoid breaking changes, but they should not be used for new development.

## Deprecation Plan

1. Phase 1: Isolation (Current) - Move deprecated code to this folder
2. Phase 2: Clean up Admin Interface - Remove or disable features that rely on deprecated functionality
3. Phase 3: Progressive Removal - Gradually remove unused modules
4. Phase 4: Schema Cleanup - Remove unused database tables

Please use the primary CMS implementation (Contentful) for all new development.
