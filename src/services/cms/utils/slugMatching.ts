
/**
 * Slug matching functionality - main entry point
 * Refactored to use smaller, focused modules
 */

// Export all functionality from the modular files
export { normalizeSlug, exactSlugMatch } from './slug/normalize';
export { mapUrlSlugToDatabaseSlug, mapDatabaseSlugToUrlSlug, registerSlugChange } from './slug/mapping';
export { getSlugVariations, slugsMatch } from './slug/variations';
export { extractUUID, createSlugWithUUID, parseSlugWithUUID } from './slug/uuid';
export { logSlugSearch, logSlugResult } from './slug/logging';
