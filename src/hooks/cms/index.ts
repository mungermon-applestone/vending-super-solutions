// Re-export all CMS hooks for ease of use
// All hooks should use Contentful as the source of truth

// Business Goals
export {
  useContentfulBusinessGoals,
  useContentfulBusinessGoalBySlug,
  // Legacy hooks (using Contentful internally)
  useBusinessGoals,
  useBusinessGoalBySlug
} from './useBusinessGoals';

// Export other hooks as they are implemented
// Each content type should have its own file and transformer
