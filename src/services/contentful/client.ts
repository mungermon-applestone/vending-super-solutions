
import { createClient } from "contentful";

// Create and export the Contentful client using environment variables
export const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || "",
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || "",
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master",
});

// Create a management client for admin operations (if needed)
export const getContentfulManagementClient = () => {
  const managementToken = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
  
  if (!managementToken) {
    throw new Error("Contentful management token not configured");
  }
  
  // This is a placeholder - actual implementation would use contentful-management SDK
  console.log("Management client would be created with token:", managementToken);
  return { 
    isConfigured: !!managementToken
  };
};

/**
 * Check if Contentful is properly configured
 * @returns true if Contentful is configured, false otherwise
 */
export function isContentfulConfigured(): boolean {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  return !!spaceId && !!accessToken;
}
