
// Consolidated export of all CMS hooks - Contentful only

// Export Contentful business goals hooks
export { 
  useContentfulBusinessGoals,
  useContentfulBusinessGoalBySlug 
} from './useContentfulBusinessGoals';

// Export Contentful testimonials hooks
export { 
  useContentfulTestimonials 
} from './useContentfulTestimonials';

// Re-export transformers for convenience
export { 
  transformBusinessGoal,
  ContentfulBusinessGoal
} from './transformers/businessGoalTransformer';

export {
  transformTestimonial,
  ContentfulTestimonial,
  transformContentfulAsset
} from './transformers/testimonialTransformer';

export {
  transformBlogPost,
  createAdjacentPost,
  ContentfulBlogPost
} from './transformers/blogPostTransformer';
