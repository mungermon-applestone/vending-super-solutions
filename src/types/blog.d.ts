
import { Asset, Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';

export interface ContentfulBlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    publishDate: string;
    excerpt?: string;
    content?: Document;
    featuredImage?: Asset;
    author?: {
      fields: {
        name: string;
        photo?: Asset;
        bio?: string;
      }
    };
    tags?: string[];
    relatedPosts?: Entry<ContentfulBlogPost>[];
  };
  includes?: {
    Asset?: Asset[];
    Entry?: Entry<any>[];
  };
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  publishDate: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
}
