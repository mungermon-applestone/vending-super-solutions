
import { navigate } from "@/services/navigation";
import { normalizeSlug, getCanonicalSlug, resolveSlug } from "./slugMatching";

/**
 * Redirects to the canonical version of a business goal detail page if needed
 * @param slug The current slug from the URL
 * @returns True if a redirect was performed
 */
export function redirectToCanonicalBusinessGoalIfNeeded(slug: string): boolean {
  if (!slug) return false;
  
  console.log(`[redirectToCanonical] Checking if redirection needed for slug: ${slug}`);
  
  const resolvedSlug = resolveSlug(slug);
  
  // If resolved slug is different from the normalized input, redirect
  if (resolvedSlug && resolvedSlug !== normalizeSlug(slug)) {
    console.log(`[redirectToCanonical] Redirecting from ${slug} to canonical slug ${resolvedSlug}`);
    navigate(`/business-goals/${resolvedSlug}`);
    return true;
  }
  
  return false;
}

/**
 * Create a service to handle navigation, useful for testing and to avoid circular imports
 */
export const navigationService = {
  navigate: (path: string): void => {
    window.location.href = path;
  }
};
