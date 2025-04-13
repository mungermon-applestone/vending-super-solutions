
import { CMSTechnology } from '@/types/cms';
import { getCMSProviderConfig } from '../../providerConfig';
import { getTechnologyAdapter } from '../../adapters/technologies/technologyAdapterFactory';

/**
 * Clones an existing technology entry
 * @param id ID of the technology to clone
 * @returns The cloned technology object or null if the source technology wasn't found
 */
export const cloneTechnology = async (id: string): Promise<CMSTechnology | null> => {
  console.log(`[cloneTechnology] Cloning technology with ID: ${id}`);
  
  try {
    // Get the appropriate adapter based on the current CMS configuration
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    
    // Use the adapter's clone method
    return await adapter.clone(id);
  } catch (error) {
    console.error(`[cloneTechnology] Error cloning technology with ID "${id}":`, error);
    throw error;
  }
};
