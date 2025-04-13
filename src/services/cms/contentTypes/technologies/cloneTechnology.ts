
import { CMSTechnology } from '@/types/cms';
import { getCMSProviderConfig } from '../../providerConfig';
import { getTechnologyAdapter } from '../../adapters/technologies/technologyAdapterFactory';

/**
 * Clone a technology by ID
 * @param id ID of the technology to clone
 * @returns The cloned technology if successful, null otherwise
 */
export async function cloneTechnology(id: string): Promise<CMSTechnology | null> {
  try {
    console.log(`[CMS:Technology] cloneTechnology: Cloning technology with ID: ${id}`);
    
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    
    if (!adapter.clone) {
      console.error(`[CMS:Technology] cloneTechnology: Clone operation not supported by adapter`);
      return null;
    }
    
    const result = await adapter.clone(id);
    
    if (result) {
      console.log(`[CMS:Technology] cloneTechnology: Successfully cloned technology with ID: ${id} to new technology: ${result.id}`);
    } else {
      console.error(`[CMS:Technology] cloneTechnology: Failed to clone technology with ID: ${id}`);
    }
    
    return result;
  } catch (error) {
    console.error(`[CMS:Technology] cloneTechnology: Error cloning technology with ID ${id}:`, error);
    return null;
  }
}

export { cloneTechnology };
