
export enum ContentProviderType {
  CONTENTFUL = 'contentful'
}

export interface ContentProviderConfig {
  type: ContentProviderType;
  options?: Record<string, unknown>;
  initialized?: boolean;
  error?: string | null;
}
