
import { Asset, Entry } from "contentful";
import { transformContentfulAsset } from "./testimonialTransformer";
import { BlogPost, AdjacentPost } from "@/types/cms";

// Interface for the structure of a Contentful Blog Post entry
export interface ContentfulBlogPost {
  fields: {
    title: string;
    slug: string;
    summary?: string;
    content: any;
    author?: string;
    publishedDate?: string;
    category?: string;
    tags?: string[];
    image?: Asset;
    status?: "published" | "draft";
  };
  sys: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Transform a Contentful Blog Post entry to our internal BlogPost format
 * @param entry Contentful Blog Post entry
 * @returns Standardized BlogPost object
 */
export function transformBlogPost(entry: ContentfulBlogPost): BlogPost {
  return {
    id: entry.sys.id,
    title: entry.fields.title || "",
    slug: entry.fields.slug || "",
    summary: entry.fields.summary,
    content: entry.fields.content,
    author: entry.fields.author,
    publishedDate: entry.fields.publishedDate,
    category: entry.fields.category,
    tags: entry.fields.tags || [],
    image: transformContentfulAsset(entry.fields.image),
    status: entry.fields.status || "draft",
    createdAt: entry.sys.createdAt || "",
    updatedAt: entry.sys.updatedAt || "",
  };
}

/**
 * Create an AdjacentPost object from a Contentful Blog Post entry
 * @param entry Contentful Blog Post entry
 * @returns Simplified AdjacentPost object
 */
export function createAdjacentPost(entry: ContentfulBlogPost): AdjacentPost {
  return {
    id: entry.sys.id,
    title: entry.fields.title || "",
    slug: entry.fields.slug || "",
    image: transformContentfulAsset(entry.fields.image),
  };
}
