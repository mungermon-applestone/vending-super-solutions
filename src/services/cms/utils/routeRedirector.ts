
import { navigate } from "@/services/navigation";
import { normalizeSlug, getCanonicalSlug } from "./slugMatching";

/**
 * Redirects to the canonical version of a business goal detail page if needed
 * @param slug The current slug from the URL
 * @returns True if a redirect was performed
 */
export function redirectToCanonicalBusinessGoalIfNeeded(slug: string): boolean {
  if (!slug) return false;
  
  console.log(`[redirectToCanonical] Checking if redirection needed for slug: ${slug}`);
  
  const normalizedSlug = normalizeSlug(slug);
  const canonicalSlug = getCanonicalSlug(normalizedSlug);
  
  // If we have a mapping and it's different from the current slug, redirect
  if (canonicalSlug && canonicalSlug !== normalizedSlug) {
    console.log(`[redirectToCanonical] Redirecting from ${normalizedSlug} to canonical slug ${canonicalSlug}`);
    navigate(`/business-goals/${canonicalSlug}`);
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
