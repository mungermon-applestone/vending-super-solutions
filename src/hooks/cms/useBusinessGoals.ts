
import { useContentfulBusinessGoals } from "./useContentfulBusinessGoals";
import { logDeprecation } from "@/services/cms/utils/deprecation";

/**
 * Hook to fetch all business goals
 * This is a wrapper around useContentfulBusinessGoals for backward compatibility
 */
export function useBusinessGoals() {
  logDeprecation("useBusinessGoals", "useContentfulBusinessGoals");
  return useContentfulBusinessGoals();
}
