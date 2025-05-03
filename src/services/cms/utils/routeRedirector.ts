
import { navigate } from "@/services/navigation";

/**
 * Map of problematic slugs to their proper canonical paths
 */
const BUSINESS_GOAL_SLUG_MAP: Record<string, string> = {
  // Data analytics variations
  'data-analytics': 'data-analytics',
  'data_analytics': 'data-analytics',
  'analytics': 'data-analytics',
  'data-analysis': 'data-analytics',
  'data': 'data-analytics',
  
  // Expand footprint variations
  'expand-footprint': 'expand-footprint',
  'expand_footprint': 'expand-footprint',
  'expansion': 'expand-footprint',
  'market-expansion': 'expand-footprint',
  'footprint': 'expand-footprint',
  
  // Marketing and promotions variations
  'marketing-and-promotions': 'marketing-and-promotions',
  'marketing_and_promotions': 'marketing-and-promotions',
  'marketing-promotions': 'marketing-and-promotions',
  'marketing_promotions': 'marketing-and-promotions',
  'marketing': 'marketing-and-promotions',
  'promotions': 'marketing-and-promotions'
};

/**
 * Redirects to the canonical version of a business goal detail page if needed
 * @param slug The current slug from the URL
 * @returns True if a redirect was performed
 */
export function redirectToCanonicalBusinessGoalIfNeeded(slug: string): boolean {
  if (!slug) return false;
  
  const normalizedSlug = slug.toLowerCase().replace(/_/g, '-');
  const canonicalSlug = BUSINESS_GOAL_SLUG_MAP[normalizedSlug];
  
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
