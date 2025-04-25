
/**
 * Type of content provider
 */
export enum ContentProviderType {
  CONTENTFUL = 'contentful',
  SUPABASE = 'supabase',
}

/**
 * Configuration for the content provider
 */
export interface ContentProviderConfig {
  type: ContentProviderType;
  options?: any;
}
