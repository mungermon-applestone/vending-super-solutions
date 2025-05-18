
import { getTechnologyAdapter } from '../../adapters/technologies/technologyAdapterFactory';
import { getCMSProviderConfig } from '../../providerConfig';

/**
 * Delete a technology by ID
 * @param id ID of the technology to delete
 * @returns True if deletion was successful
 */
export async function deleteTechnology(id: string): Promise<boolean> {
  try {
    console.log(`[CMS:Technology] deleteTechnology: Deleting technology with ID: ${id}`);
    
    const adapter = getTechnologyAdapter();
    const result = await adapter.delete(id);
    
    if (result) {
      console.log(`[CMS:Technology] deleteTechnology: Successfully deleted technology with ID: ${id}`);
    } else {
      console.error(`[CMS:Technology] deleteTechnology: Failed to delete technology with ID: ${id}`);
    }
    
    return result;
  } catch (error) {
    console.error(`[CMS:Technology] deleteTechnology: Error deleting technology with ID ${id}:`, error);
    return false;
  }
}

export default deleteTechnology;
