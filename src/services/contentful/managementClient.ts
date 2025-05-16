
import { createClient as createManagementClient } from 'contentful-management';

/**
 * Create a Contentful Management API client
 */
export async function createClient() {
  try {
    // Get management token from environment variables
    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN || 
                           import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
    
    if (!managementToken) {
      throw new Error('Contentful Management Token is not configured');
    }
    
    return createManagementClient({
      accessToken: managementToken
    });
  } catch (error) {
    console.error('Error creating Contentful Management client:', error);
    throw error;
  }
}
