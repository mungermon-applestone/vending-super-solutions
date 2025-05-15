
/**
 * CMS Hooks
 * 
 * This file exports all Contentful CMS hooks
 */

// Blog Posts
import { 
  useContentfulBlogPosts, 
  useContentfulBlogPostBySlug,
  useContentfulFeaturedBlogPosts,
  useContentfulAdjacentBlogPosts
} from '@/hooks/useBlogData';

// Testimonials
import { useContentfulTestimonials } from './useContentfulTestimonials';

export {
  // Blog Posts
  useContentfulBlogPosts,
  useContentfulBlogPostBySlug,
  useContentfulFeaturedBlogPosts,
  useContentfulAdjacentBlogPosts,
  
  // Testimonials
  useContentfulTestimonials,
};
