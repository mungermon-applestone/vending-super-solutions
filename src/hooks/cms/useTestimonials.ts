
import { useContentfulTestimonials } from "./useContentfulTestimonials";
import { logDeprecation } from "@/services/cms/utils/deprecation";

/**
 * Hook to fetch all testimonials
 * This is a wrapper around useContentfulTestimonials for backward compatibility
 */
export function useTestimonials() {
  logDeprecation("useTestimonials", "useContentfulTestimonials directly");
  return useContentfulTestimonials();
}
