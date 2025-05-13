
/**
 * Migration helpers and utilities
 * 
 * This file provides tools for tracking and reporting on the CMS migration
 * status from legacy systems to Contentful.
 */

/**
 * Content type migration status
 */
export type MigrationStatus = 'completed' | 'in-progress' | 'pending';

/**
 * Content type migration information
 */
export interface ContentTypeMigrationInfo {
  name: string;
  status: MigrationStatus;
  progress: number; // 0-100
  contentfulType: string;
}

/**
 * Migration statistics
 */
export interface MigrationStats {
  completed: number;
  inProgress: number;
  pending: number;
  total: number;
}

/**
 * Migration report
 */
export interface MigrationReport {
  stats: MigrationStats;
  contentTypes: ContentTypeMigrationInfo[];
  completionPercentage: number;
  lastUpdated: Date;
}

/**
 * Define the migration status for all content types
 */
const CONTENT_TYPE_MIGRATION_STATUS: ContentTypeMigrationInfo[] = [
  {
    name: 'Business Goals',
    status: 'completed',
    progress: 100,
    contentfulType: 'businessGoal'
  },
  {
    name: 'Product Types',
    status: 'completed',
    progress: 100,
    contentfulType: 'productType'
  },
  {
    name: 'Technologies',
    status: 'completed',
    progress: 100,
    contentfulType: 'technology'
  },
  {
    name: 'Machines',
    status: 'completed',
    progress: 100,
    contentfulType: 'machine'
  },
  {
    name: 'Case Studies',
    status: 'completed',
    progress: 100,
    contentfulType: 'caseStudy'
  },
  {
    name: 'Landing Pages',
    status: 'completed',
    progress: 100,
    contentfulType: 'landingPage'
  },
  {
    name: 'Blog Posts',
    status: 'completed',
    progress: 100,
    contentfulType: 'blogPost'
  },
  {
    name: 'Testimonials',
    status: 'completed',
    progress: 100,
    contentfulType: 'testimonial'
  },
];

/**
 * Generate a migration report
 * 
 * @returns A report of migration progress
 */
export function generateMigrationReport(): MigrationReport {
  // Count content types by status
  const completed = CONTENT_TYPE_MIGRATION_STATUS.filter(ct => ct.status === 'completed').length;
  const inProgress = CONTENT_TYPE_MIGRATION_STATUS.filter(ct => ct.status === 'in-progress').length;
  const pending = CONTENT_TYPE_MIGRATION_STATUS.filter(ct => ct.status === 'pending').length;
  const total = CONTENT_TYPE_MIGRATION_STATUS.length;
  
  // Calculate overall completion percentage
  const completionPercentage = Math.round(
    (completed * 100 + 
     inProgress * CONTENT_TYPE_MIGRATION_STATUS.filter(ct => ct.status === 'in-progress')
       .reduce((sum, ct) => sum + ct.progress, 0) / inProgress || 0) / 
    total
  );
  
  return {
    stats: {
      completed,
      inProgress,
      pending,
      total
    },
    contentTypes: CONTENT_TYPE_MIGRATION_STATUS,
    completionPercentage,
    lastUpdated: new Date()
  };
}

/**
 * Get migration status for a specific content type
 * 
 * @param contentType The name of the content type
 * @returns Migration info or null if not found
 */
export function getContentTypeMigrationStatus(contentType: string): ContentTypeMigrationInfo | null {
  const found = CONTENT_TYPE_MIGRATION_STATUS.find(
    ct => ct.name.toLowerCase() === contentType.toLowerCase()
  );
  
  return found || null;
}

/**
 * Check if a content type migration is complete
 * 
 * @param contentType The name of the content type
 * @returns True if migration is complete
 */
export function isContentTypeMigrationComplete(contentType: string): boolean {
  const status = getContentTypeMigrationStatus(contentType);
  return status?.status === 'completed';
}
