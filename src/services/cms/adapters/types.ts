
export enum ContentProviderType {
  CONTENTFUL = 'contentful',
  SUPABASE = 'supabase',
  STRAPI = 'strapi' // Add STRAPI to the enum
}

export interface ContentProviderConfig {
  type: ContentProviderType;
  options?: Record<string, unknown>;
  apiUrl?: string; // Add apiUrl for STRAPI
  apiKey?: string; // Add apiKey for STRAPI
  initialized?: boolean; // Add initialized property
  error?: string | null; // Add error property
}
