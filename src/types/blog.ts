
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  status: 'draft' | 'published';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  // Additional fields to match the shape of contentful posts
  featuredImage?: {
    url: string;
    title: string;
    width?: number;
    height?: number;
  };
  author?: string;
  tags?: string[];
  // Fields to help with compatibility
  sys?: any;
  fields?: any;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published';
}
