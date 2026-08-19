/**
 * Provider-agnostic CMS contract. Contentful is the first implementation;
 * WordPress / Sanity / Strapi can be added without touching the capture UI.
 */

export type CmsProviderId = 'contentful';

export interface CmsFieldMapping {
  /** Content type / post type identifier in the target CMS */
  contentTypeId: string;
  /** Field that receives the article title */
  titleField: string;
  /** Rich text / body field that receives the image + caption sequence */
  bodyField: string;
  /** Optional taxonomy fields */
  sectionField?: string;
  headingField?: string;
  /** Locale key, e.g. "en-US" (Contentful) */
  locale: string;
}

export interface CmsConnection {
  id: string;
  provider: CmsProviderId;
  name: string;
  spaceId: string;
  environmentId: string;
  mapping: CmsFieldMapping;
  /** Tokens are never returned to the browser — server-side only. */
  hasManagementToken: boolean;
  createdAt: string;
}

export interface ArticleStep {
  /** Signed URL the CMS can fetch the image from */
  imageUrl: string;
  caption: string;
  order: number;
}

export interface CreateArticleInput {
  title: string;
  section?: string;
  heading?: string;
  steps: ArticleStep[];
  publishImmediately: boolean;
}

export interface CreateArticleResult {
  entryId: string;
  url?: string;
}

export interface CmsProvider {
  id: CmsProviderId;
  testConnection(): Promise<{ ok: boolean; message: string }>;
  createArticle(input: CreateArticleInput): Promise<CreateArticleResult>;
}
