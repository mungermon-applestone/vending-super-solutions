
import { CMSTechnology } from '@/types/cms';
import { getCMSProviderConfig } from '../../providerConfig';
import { getTechnologyAdapter } from '../../adapters/technologies/technologyAdapterFactory';
import { UseToastReturn } from '@/hooks/use-toast';

/**
 * Clone a technology by ID
 * @param id ID of the technology to clone
 * @param options Additional options
 * @returns The cloned technology if successful, null otherwise
 */
export async function cloneTechnology(
  id: string, 
  options?: { toast?: UseToastReturn }
): Promise<CMSTechnology | null> {
  try {
    console.log(`[CMS:Technology] cloneTechnology: Cloning technology with ID: ${id}`);
    
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    
    if (!adapter.clone) {
      console.error(`[CMS:Technology] cloneTechnology: Clone operation not supported by adapter`);
      options?.toast?.toast({
        title: "Operation not supported",
        description: "Cloning is not supported by the current CMS adapter",
        variant: "destructive"
      });
      return null;
    }
    
    const result = await adapter.clone(id);
    
    if (result) {
      console.log(`[CMS:Technology] cloneTechnology: Successfully cloned technology with ID: ${id} to new technology: ${result.id}`);
      options?.toast?.toast({
        title: "Technology cloned",
        description: "The technology was successfully cloned",
        variant: "default"
      });
    } else {
      console.error(`[CMS:Technology] cloneTechnology: Failed to clone technology with ID: ${id}`);
      options?.toast?.toast({
        title: "Clone failed",
        description: "Failed to clone the technology",
        variant: "destructive"
      });
    }
    
    return result;
  } catch (error) {
    console.error(`[CMS:Technology] cloneTechnology: Error cloning technology with ID ${id}:`, error);
    options?.toast?.toast({
      title: "Error",
      description: `An error occurred while cloning: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    return null;
  }
}
