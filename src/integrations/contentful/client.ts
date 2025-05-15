
import { createClient } from "contentful";

// Create and export the Contentful client using environment variables
export const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || "",
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || "",
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master",
});

// Check if Contentful is properly configured
export function isContentfulConfigured(): boolean {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  return !!spaceId && !!accessToken;
}
