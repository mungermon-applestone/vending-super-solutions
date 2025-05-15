
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

// Technologies
import {
  useContentfulTechnologies,
  useContentfulTechnologyBySlug
} from './useTechnologies';

// Business Goals
import {
  useContentfulBusinessGoals,
  useContentfulBusinessGoalBySlug
} from './useContentfulBusinessGoals';

export {
  // Blog Posts
  useContentfulBlogPosts,
  useContentfulBlogPostBySlug,
  useContentfulFeaturedBlogPosts,
  useContentfulAdjacentBlogPosts,
  
  // Testimonials
  useContentfulTestimonials,
  
  // Technologies
  useContentfulTechnologies,
  useContentfulTechnologyBySlug,
  
  // Business Goals
  useContentfulBusinessGoals,
  useContentfulBusinessGoalBySlug,
};

// Backward compatibility exports
export const useBlogPosts = useContentfulBlogPosts;
export const useBlogPostBySlug = useContentfulBlogPostBySlug;
export const useAdjacentPosts = useContentfulAdjacentBlogPosts;
export const useTechnologies = useContentfulTechnologies;
export const useTechnologyBySlug = useContentfulTechnologyBySlug;
