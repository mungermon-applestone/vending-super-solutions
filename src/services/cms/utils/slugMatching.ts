
/**
 * Slug matching functionality - main entry point
 * Refactored to use smaller, focused modules
 */

// Export common utilities from common.ts
export { normalizeSlug, getCanonicalSlug, getBasicVariations, BUSINESS_GOAL_SLUG_MAP } from './slug/common';

// Export main slug variation functionality
export { 
  getSlugVariations,
  slugsMatch, 
  findBestSlugMatch 
} from './slug/variations';

// Keep existing exports from other modules
export { mapUrlSlugToDatabaseSlug, mapDatabaseSlugToUrlSlug, registerSlugChange } from './slug/mapping';
export { extractUUID, createSlugWithUUID, parseSlugWithUUID } from './slug/uuid';
export { logSlugSearch, logSlugResult, getSlugNotFoundMessage } from './slug/logging';

// Re-export any missing functionality from normalize.ts
export { exactSlugMatch } from './slug/normalize';
