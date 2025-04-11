
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogPostFormData } from "@/types/blog";

// Fetch all blog posts with optional filters
export const fetchBlogPosts = async (filters: { 
  status?: string;
  slug?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<BlogPost[]> => {
  console.log("[fetchBlogPosts] Fetching blog posts with filters:", filters);
  
  let query = supabase
    .from('blog_posts')
    .select('*');

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.slug) {
    query = query.eq('slug', filters.slug);
  }
  
  // Apply pagination
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }
  
  // Sort by published_at for published posts, created_at for drafts
  query = query.order('published_at', { ascending: false, nullsFirst: false })
               .order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error("[fetchBlogPosts] Error fetching blog posts:", error);
    throw error;
  }
  
  return data as BlogPost[];
};

// Fetch a single blog post by slug
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  console.log("[fetchBlogPostBySlug] Fetching blog post with slug:", slug);
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  
  if (error) {
    console.error("[fetchBlogPostBySlug] Error fetching blog post:", error);
    throw error;
  }
  
  return data as BlogPost | null;
};

// Create a new blog post
export const createBlogPost = async (postData: BlogPostFormData): Promise<BlogPost> => {
  console.log("[createBlogPost] Creating blog post:", postData);
  
  const newPost = {
    ...postData,
    published_at: postData.status === 'published' ? new Date().toISOString() : null
  };
  
  console.log("[createBlogPost] Sending to Supabase:", newPost);
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(newPost)
    .select()
    .single();
  
  if (error) {
    console.error("[createBlogPost] Error creating blog post:", error);
    throw error;
  }
  
  return data as BlogPost;
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: BlogPostFormData): Promise<BlogPost> => {
  console.log("[updateBlogPost] Updating blog post:", id, postData);
  
  // First, get the existing post to check its status
  const { data: existingPost } = await supabase
    .from('blog_posts')
    .select('status, published_at')
    .eq('id', id)
    .single();
  
  const updatedPost: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    status: 'draft' | 'published';
    published_at?: string | null;
    updated_at: string;
  } = {
    ...postData,
    updated_at: new Date().toISOString()
  };
  
  // If status changed to published and wasn't previously published, set published_at date
  if (postData.status === 'published') {
    if (existingPost && existingPost.status !== 'published') {
      updatedPost.published_at = new Date().toISOString();
    } else if (existingPost && existingPost.published_at) {
      // Keep the original published date
      updatedPost.published_at = existingPost.published_at;
    }
  } else {
    // If changing to draft, set published_at to null
    updatedPost.published_at = null;
  }
  
  console.log("[updateBlogPost] Sending to Supabase:", updatedPost);
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updatedPost)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("[updateBlogPost] Error updating blog post:", error);
    throw error;
  }
  
  return data as BlogPost;
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  console.log("[deleteBlogPost] Deleting blog post:", id);
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("[deleteBlogPost] Error deleting blog post:", error);
    throw error;
  }
  
  return true;
};

// Clone a blog post
export const cloneBlogPost = async (id: string): Promise<BlogPost> => {
  console.log("[cloneBlogPost] Cloning blog post:", id);
  
  // Fetch the post to clone
  const { data: postToClone, error: fetchError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (fetchError) {
    console.error("[cloneBlogPost] Error fetching blog post to clone:", fetchError);
    throw fetchError;
  }
  
  // Generate a unique slug
  const timestamp = Date.now();
  const clonedPost = {
    title: `${postToClone.title} (Copy)`,
    slug: `${postToClone.slug}-copy-${timestamp}`,
    content: postToClone.content,
    excerpt: postToClone.excerpt,
    status: 'draft', // Always create clones as drafts
    published_at: null
  };
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(clonedPost)
    .select()
    .single();
  
  if (error) {
    console.error("[cloneBlogPost] Error creating cloned blog post:", error);
    throw error;
  }
  
  return data as BlogPost;
};

// Get adjacent posts (previous and next)
export const getAdjacentPosts = async (currentPostSlug: string): Promise<{
  previous: BlogPost | null;
  next: BlogPost | null;
}> => {
  console.log("[getAdjacentPosts] Finding adjacent posts for:", currentPostSlug);
  
  // Fetch the current post to get its published date
  const currentPost = await fetchBlogPostBySlug(currentPostSlug);
  
  if (!currentPost) {
    throw new Error(`Blog post with slug ${currentPostSlug} not found`);
  }
  
  // For published posts, use published_at date for navigation
  if (currentPost.status === 'published' && currentPost.published_at) {
    // Get previous post (newer)
    const { data: previousData } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .gt('published_at', currentPost.published_at)
      .order('published_at', { ascending: true })
      .limit(1);
    
    // Get next post (older)
    const { data: nextData } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .lt('published_at', currentPost.published_at)
      .order('published_at', { ascending: false })
      .limit(1);
    
    return {
      previous: previousData && previousData.length > 0 ? previousData[0] as BlogPost : null,
      next: nextData && nextData.length > 0 ? nextData[0] as BlogPost : null
    };
  } else {
    // For drafts, use created_at date for navigation
    // Get previous post (newer)
    const { data: previousData } = await supabase
      .from('blog_posts')
      .select('*')
      .gt('created_at', currentPost.created_at)
      .order('created_at', { ascending: true })
      .limit(1);
    
    // Get next post (older)
    const { data: nextData } = await supabase
      .from('blog_posts')
      .select('*')
      .lt('created_at', currentPost.created_at)
      .order('created_at', { ascending: false })
      .limit(1);
    
    return {
      previous: previousData && previousData.length > 0 ? previousData[0] as BlogPost : null,
      next: nextData && nextData.length > 0 ? nextData[0] as BlogPost : null
    };
  }
};
