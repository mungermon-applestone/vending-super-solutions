
import { getContentfulConfig } from './cmsInfo';
import { createClient } from 'contentful-management';
import { 
  ContentTypeProps, 
  FieldProps,
  ContentfulContentTypeResponse 
} from '../types/contentfulTypes';

/**
 * Creates a Contentful Management API client
 */
export const getContentfulClient = async () => {
  const config = await getContentfulConfig();
  
  if (!config || !config.management_token) {
    throw new Error('No Contentful configuration or management token found');
  }
  
  return createClient({
    accessToken: config.management_token
  });
};

/**
 * Create a new content type in Contentful
 * @param contentType Content type definition
 * @returns Created content type or error
 */
export const createContentType = async (
  contentType: ContentTypeProps
): Promise<ContentfulContentTypeResponse> => {
  try {
    console.log(`[createContentType] Creating content type: ${contentType.name}`);
    
    const client = await getContentfulClient();
    const space = await client.getSpace(await getSpaceId());
    const environment = await space.getEnvironment(await getEnvironmentId());
    
    // Check if the content type already exists
    try {
      const existingType = await environment.getContentType(contentType.id);
      console.log(`[createContentType] Content type ${contentType.id} already exists`);
      return {
        success: false,
        message: `Content type '${contentType.name}' already exists`,
        contentType: existingType
      };
    } catch (error) {
      // Content type doesn't exist, proceed with creation
      console.log(`[createContentType] Content type ${contentType.id} not found, creating new...`);
    }
    
    // Create the content type
    const createdType = await environment.createContentTypeWithId(
      contentType.id,
      {
        name: contentType.name,
        description: contentType.description,
        displayField: contentType.displayField,
        fields: contentType.fields
      }
    );
    
    // Publish the content type if requested
    if (contentType.publish) {
      console.log(`[createContentType] Publishing content type: ${contentType.id}`);
      await createdType.publish();
    }
    
    console.log(`[createContentType] Successfully created content type: ${contentType.id}`);
    return {
      success: true,
      message: `Content type '${contentType.name}' created successfully`,
      contentType: createdType
    };
    
  } catch (error) {
    console.error('[createContentType] Error creating content type:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error creating content type',
      error
    };
  }
};

/**
 * Get the configured Contentful space ID
 */
export const getSpaceId = async (): Promise<string> => {
  const config = await getContentfulConfig();
  if (!config || !config.space_id) {
    throw new Error('No Contentful space ID found in configuration');
  }
  return config.space_id;
};

/**
 * Get the configured Contentful environment ID
 */
export const getEnvironmentId = async (): Promise<string> => {
  const config = await getContentfulConfig();
  if (!config || !config.environment_id) {
    return 'master'; // Default to 'master' environment if not specified
  }
  return config.environment_id;
};

/**
 * Delete a content type in Contentful
 */
export const deleteContentType = async (contentTypeId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    console.log(`[deleteContentType] Deleting content type: ${contentTypeId}`);
    
    const client = await getContentfulClient();
    const space = await client.getSpace(await getSpaceId());
    const environment = await space.getEnvironment(await getEnvironmentId());
    
    // Get the content type
    const contentType = await environment.getContentType(contentTypeId);
    
    // Unpublish if published
    if (contentType.isPublished()) {
      await contentType.unpublish();
    }
    
    // Delete the content type
    await contentType.delete();
    
    console.log(`[deleteContentType] Successfully deleted content type: ${contentTypeId}`);
    return {
      success: true,
      message: `Content type '${contentTypeId}' deleted successfully`
    };
  } catch (error) {
    console.error('[deleteContentType] Error deleting content type:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error deleting content type'
    };
  }
};
