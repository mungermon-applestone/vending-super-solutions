
/**
 * CMS Hooks
 * 
 * This file re-exports all CMS hooks for easy access
 */

// Business Goals
import { 
  useContentfulBusinessGoals, 
  useContentfulBusinessGoalBySlug 
} from './useContentfulBusinessGoals';

// Testimonials
import { useContentfulTestimonials } from './useContentfulTestimonials';

// Blog
import { 
  useContentfulBlogPosts, 
  useContentfulBlogPostBySlug,
  useContentfulFeaturedBlogPosts,
  useContentfulAdjacentBlogPosts
} from './useContentfulBlogPosts';

// Legacy hook re-exports for backward compatibility
import { useBusinessGoals } from './useBusinessGoals';
import { useTestimonials } from './useTestimonials';

export {
  // Business Goals
  useContentfulBusinessGoals,
  useContentfulBusinessGoalBySlug,
  useBusinessGoals,
  
  // Testimonials
  useContentfulTestimonials,
  useTestimonials,
  
  // Blog
  useContentfulBlogPosts,
  useContentfulBlogPostBySlug,
  useContentfulFeaturedBlogPosts,
  useContentfulAdjacentBlogPosts
};
