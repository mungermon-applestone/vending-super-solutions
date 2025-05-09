
import { BlogPost, BlogPostFormData } from "@/types/blog";

// Mock blog posts data
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Introduction to Vending Technology",
    slug: "introduction-to-vending-technology",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    excerpt: "A brief overview of modern vending technology.",
    status: "published",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "The Future of Automated Retail",
    slug: "future-of-automated-retail",
    content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    excerpt: "Exploring what's next in automated retail solutions.",
    status: "published",
    published_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Fetch all blog posts with optional filters
export const fetchBlogPosts = async (filters: { 
  status?: string;
  slug?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<BlogPost[]> => {
  console.log("[fetchBlogPosts] Fetching blog posts with filters:", filters);
  
  // Apply filters to mock data
  let filteredPosts = [...mockBlogPosts];
  
  if (filters.status) {
    filteredPosts = filteredPosts.filter(post => post.status === filters.status);
  }
  
  if (filters.slug) {
    filteredPosts = filteredPosts.filter(post => post.slug === filters.slug);
  }
  
  // Apply pagination
  if (filters.offset !== undefined) {
    const end = filters.limit ? filters.offset + filters.limit : undefined;
    filteredPosts = filteredPosts.slice(filters.offset, end);
  } else if (filters.limit) {
    filteredPosts = filteredPosts.slice(0, filters.limit);
  }
  
  // Sort by published_at for published posts in descending order (newest first)
  filteredPosts.sort((a, b) => {
    if (a.published_at && b.published_at) {
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  
  return filteredPosts;
};

// Fetch a single blog post by slug
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  console.log("[fetchBlogPostBySlug] Fetching blog post with slug:", slug);
  
  const post = mockBlogPosts.find(post => post.slug === slug) || null;
  return post;
};

// Create a new blog post
export const createBlogPost = async (postData: BlogPostFormData): Promise<BlogPost> => {
  console.log("[createBlogPost] Creating blog post:", postData);
  
  const newPost: BlogPost = {
    id: `mock-${Date.now()}`,
    ...postData,
    published_at: postData.status === 'published' ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockBlogPosts.push(newPost);
  return newPost;
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: BlogPostFormData): Promise<BlogPost> => {
  console.log("[updateBlogPost] Updating blog post:", id, postData);
  
  const existingPostIndex = mockBlogPosts.findIndex(post => post.id === id);
  
  if (existingPostIndex === -1) {
    throw new Error(`Blog post with ID ${id} not found`);
  }
  
  const existingPost = mockBlogPosts[existingPostIndex];
  
  const updatedPost: BlogPost = {
    ...existingPost,
    ...postData,
    updated_at: new Date().toISOString()
  };
  
  // If status changed to published and wasn't previously published, set published_at date
  if (postData.status === 'published' && existingPost.status !== 'published') {
    updatedPost.published_at = new Date().toISOString();
  } else if (postData.status !== 'published') {
    updatedPost.published_at = null;
  }
  
  mockBlogPosts[existingPostIndex] = updatedPost;
  return updatedPost;
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  console.log("[deleteBlogPost] Deleting blog post:", id);
  
  const initialLength = mockBlogPosts.length;
  const filteredPosts = mockBlogPosts.filter(post => post.id !== id);
  
  // Update our mock data array
  mockBlogPosts.length = 0;
  mockBlogPosts.push(...filteredPosts);
  
  return initialLength !== mockBlogPosts.length;
};

// Clone a blog post
export const cloneBlogPost = async (id: string): Promise<BlogPost> => {
  console.log("[cloneBlogPost] Cloning blog post:", id);
  
  const postToClone = mockBlogPosts.find(post => post.id === id);
  
  if (!postToClone) {
    throw new Error(`Blog post with ID ${id} not found`);
  }
  
  // Generate a unique slug
  const timestamp = Date.now();
  const clonedPost: BlogPost = {
    ...postToClone,
    id: `clone-${timestamp}`,
    title: `${postToClone.title} (Copy)`,
    slug: `${postToClone.slug}-copy-${timestamp}`,
    status: 'draft',
    published_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockBlogPosts.push(clonedPost);
  return clonedPost;
};

// Get adjacent posts (previous and next)
export const getAdjacentPosts = async (currentPostSlug: string): Promise<{
  previous: BlogPost | null;
  next: BlogPost | null;
}> => {
  console.log("[getAdjacentPosts] Finding adjacent posts for:", currentPostSlug);
  
  const sortedPosts = [...mockBlogPosts].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at) : new Date(a.created_at);
    const dateB = b.published_at ? new Date(b.published_at) : new Date(b.created_at);
    return dateB.getTime() - dateA.getTime();
  });
  
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentPostSlug);
  
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }
  
  return {
    previous: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
    next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
  };
};
