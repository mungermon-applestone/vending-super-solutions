
import { CMSTechnology } from '@/types/cms';
import { getTechnologyAdapter } from '../../adapters/technologies/technologyAdapterFactory';
import { getCMSProviderConfig } from '../../providerConfig';

/**
 * Clone a technology by ID
 * @param id ID of the technology to clone
 * @returns The cloned technology, or null if cloning failed
 */
export async function cloneTechnology(id: string): Promise<CMSTechnology | null> {
  try {
    console.log(`[CMS:Technology] cloneTechnology: Cloning technology with ID: ${id}`);
    
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    
    if (!adapter.clone) {
      console.warn(`[CMS:Technology] cloneTechnology: Clone operation not supported by the current adapter`);
      return null;
    }
    
    const clonedTechnology = await adapter.clone(id);
    
    if (clonedTechnology) {
      console.log(`[CMS:Technology] cloneTechnology: Successfully cloned technology, new ID: ${clonedTechnology.id}`);
    } else {
      console.error(`[CMS:Technology] cloneTechnology: Failed to clone technology with ID: ${id}`);
    }
    
    return clonedTechnology;
  } catch (error) {
    console.error(`[CMS:Technology] cloneTechnology: Error cloning technology with ID ${id}:`, error);
    return null;
  }
}

export default cloneTechnology;
