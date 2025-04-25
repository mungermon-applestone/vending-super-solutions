
export enum ContentProviderType {
  CONTENTFUL = 'contentful',
  SUPABASE = 'supabase'
}

export interface ContentProviderConfig {
  type: ContentProviderType;
  options?: Record<string, unknown>;
}
