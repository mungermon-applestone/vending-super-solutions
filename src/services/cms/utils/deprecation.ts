
/**
 * Simple deprecation utility for logging deprecated CMS functionality
 * This replaces the complex deprecation tracker system
 */

import { toast } from "@/components/ui/use-toast";

/**
 * Log a deprecation warning for a function or feature
 * @param feature The feature being deprecated
 * @param message Optional custom message
 */
export function logDeprecation(feature: string, message?: string) {
  console.warn(
    `[DEPRECATED] ${feature} is deprecated and will be removed. ${message || "Please use Contentful instead."}`
  );
  
  // Optional toast for user-visible warnings
  if (import.meta.env.DEV) {
    toast({
      title: "Deprecated Feature Used",
      description: `${feature} is deprecated. ${message || "Please use Contentful instead."}`,
      variant: "destructive",
    });
  }
}

/**
 * Get the URL to redirect to Contentful for a specific content type and ID
 * @param contentType The type of content (e.g., "businessGoal", "product")
 * @param contentId The ID of the content in Contentful
 * @returns The URL to the Contentful web app for this content
 */
export function getContentfulRedirectUrl(contentType: string, contentId?: string) {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master";
  
  // Base URL for the Contentful web app
  const baseUrl = `https://app.contentful.com/spaces/${spaceId}/environments/${environmentId}`;
  
  if (!contentId) {
    // Return URL to content type listing
    return `${baseUrl}/entries?contentTypeId=${contentType}`;
  }
  
  // Return URL to specific entry
  return `${baseUrl}/entries/${contentId}`;
}
