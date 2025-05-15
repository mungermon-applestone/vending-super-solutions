
import { useContentfulBusinessGoals, useContentfulBusinessGoalBySlug } from "./useContentfulBusinessGoals";
import { logDeprecation } from "@/services/cms/utils/deprecation";

/**
 * Hook to fetch all business goals
 * This is a wrapper around useContentfulBusinessGoals for backward compatibility
 */
export function useBusinessGoals() {
  logDeprecation("useBusinessGoals", "Use useContentfulBusinessGoals directly");
  return useContentfulBusinessGoals();
}

/**
 * Hook to fetch a single business goal by slug
 * This is a wrapper around useContentfulBusinessGoalBySlug for backward compatibility
 * @param slug The slug of the business goal to fetch
 */
export function useBusinessGoalBySlug(slug: string | undefined) {
  logDeprecation("useBusinessGoalBySlug", "Use useContentfulBusinessGoalBySlug directly");
  return useContentfulBusinessGoalBySlug(slug);
}

/**
 * Export all business goal hooks
 */
export {
  useContentfulBusinessGoals,
  useContentfulBusinessGoalBySlug
};
