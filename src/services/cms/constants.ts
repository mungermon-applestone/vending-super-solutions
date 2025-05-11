
/**
 * Shared constants for CMS integration and migration
 */

// Feature flags for controlling migration features
export const SHOW_MIGRATION_WARNINGS = true;
export const REDIRECT_TO_CONTENTFUL = true;

// Documentation URLs
export const MIGRATION_GUIDE_URL = 'https://github.com/your-org/your-repo/blob/main/src/services/cms/MIGRATION_GUIDE.md';
export const CONTENTFUL_DOCS_URL = 'https://www.contentful.com/developers/docs/';

// Contentful integration status
export enum MigrationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

// Tracking which content types are fully migrated
export const CONTENT_TYPE_MIGRATION_STATUS: Record<string, MigrationStatus> = {
  product: MigrationStatus.COMPLETED,
  businessGoal: MigrationStatus.COMPLETED,
  technology: MigrationStatus.IN_PROGRESS,
  machine: MigrationStatus.IN_PROGRESS,
  blog: MigrationStatus.PENDING,
  caseStudy: MigrationStatus.PENDING,
  landingPage: MigrationStatus.IN_PROGRESS
};

// Map of content type IDs to their human-readable names
export const CONTENT_TYPE_NAMES: Record<string, string> = {
  product: 'Product',
  businessGoal: 'Business Goal',
  technology: 'Technology',
  machine: 'Machine',
  blog: 'Blog Post',
  caseStudy: 'Case Study',
  landingPage: 'Landing Page'
};

// Legacy database names - referenced by deprecation warnings
export const LEGACY_SYSTEMS = {
  STRAPI: 'Strapi CMS',
  SUPABASE: 'Supabase Database',
  FIREBASE: 'Firebase Database',
  MOCK_DATA: 'Mock Data'
};
