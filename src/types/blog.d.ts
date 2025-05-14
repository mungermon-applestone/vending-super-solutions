
export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
  title?: string;
  email?: string;
  website?: string;
  twitter?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface AdjacentPost {
  slug: string; 
  title: string;
}

export interface BlogImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

export interface BlogPostMeta {
  title: string;
  description?: string;
  keywords?: string[];
  image?: BlogImage;
  canonical?: string;
}

export interface BlogListOptions {
  limit?: number;
  skip?: number;
  order?: string;
  tag?: string;
  category?: string;
  author?: string;
  status?: 'draft' | 'published' | 'archived';
}
