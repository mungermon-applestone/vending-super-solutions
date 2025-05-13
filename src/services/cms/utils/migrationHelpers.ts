
import { logDeprecation, getContentfulRedirectUrl } from './deprecation';
import { CONTENT_TYPE_MIGRATION_STATUS, MIGRATION_STATUS } from './deprecationConstants';

/**
 * Determine if a content type has been fully migrated to Contentful
 */
export const isContentTypeMigrated = (contentType: string): boolean => {
  return CONTENT_TYPE_MIGRATION_STATUS[contentType] === MIGRATION_STATUS.COMPLETED;
};

/**
 * Determine if a content type is in the process of being migrated
 */
export const isContentTypeMigrating = (contentType: string): boolean => {
  return CONTENT_TYPE_MIGRATION_STATUS[contentType] === MIGRATION_STATUS.IN_PROGRESS;
};

/**
 * Get Contentful URL for a specific content type and optional entity
 */
export const getContentfulEditUrl = (
  contentType: string,
  entityId?: string
): string => {
  return getContentfulRedirectUrl(contentType, entityId);
};

/**
 * Log deprecated API usage with appropriate warning
 */
export const logDeprecatedApiUsage = (
  apiName: string,
  contentType: string
): void => {
  const migrationStatus = CONTENT_TYPE_MIGRATION_STATUS[contentType] || 'unknown';
  const message = `Using deprecated ${apiName} API for ${contentType} (migration status: ${migrationStatus})`;
  
  logDeprecation(`API-${apiName}`, message, 'Use Contentful API directly');
};

/**
 * Check if we should use Contentful for a specific content type
 * based on migration status
 */
export const shouldUseContentful = (contentType: string): boolean => {
  const status = CONTENT_TYPE_MIGRATION_STATUS[contentType];
  return status === MIGRATION_STATUS.COMPLETED || status === MIGRATION_STATUS.IN_PROGRESS;
};

/**
 * Generate a detailed migration report for all content types
 */
export const generateMigrationReport = () => {
  const entries = Object.entries(CONTENT_TYPE_MIGRATION_STATUS);
  const stats = {
    total: entries.length,
    completed: entries.filter(([_, status]) => status === MIGRATION_STATUS.COMPLETED).length,
    inProgress: entries.filter(([_, status]) => status === MIGRATION_STATUS.IN_PROGRESS).length,
    pending: entries.filter(([_, status]) => status === MIGRATION_STATUS.PENDING).length
  };
  
  const completionPercentage = Math.round((stats.completed / stats.total) * 100);
  
  return {
    stats,
    completionPercentage,
    contentTypes: entries.map(([type, status]) => ({
      type,
      status,
      isCompleted: status === MIGRATION_STATUS.COMPLETED,
      isInProgress: status === MIGRATION_STATUS.IN_PROGRESS,
      isPending: status === MIGRATION_STATUS.PENDING
    }))
  };
};
