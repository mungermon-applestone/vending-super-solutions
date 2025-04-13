import { CMSTechnology } from '@/types/cms';
import { getCMSProviderConfig } from './providerConfig';
import { getTechnologyAdapter } from './adapters/technologies/technologyAdapterFactory';
import { TechnologyCreateInput, TechnologyUpdateInput } from './adapters/technologies/types';
import { UseToastReturn } from '@/hooks/use-toast';
// Import technologyOperations from the correct path
import { technologyOperations } from './contentTypes/technologies';

/**
 * Get all technologies
 */
export async function getTechnologies(): Promise<CMSTechnology[]> {
  console.log("[technology.ts] Fetching all technologies");
  try {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return await adapter.getAll();
  } catch (error) {
    console.error("[technology.ts] Error fetching technologies:", error);
    throw error;
  }
}

/**
 * Get a technology by slug
 */
export async function getTechnologyBySlug(slug: string): Promise<CMSTechnology | null> {
  console.log(`[technology.ts] Fetching technology with slug: "${slug}"`);
  
  if (!slug || slug.trim() === '') {
    console.warn("[technology.ts] Empty slug passed to getTechnologyBySlug");
    return null;
  }
  
  try {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return await adapter.getBySlug(slug);
  } catch (error) {
    console.error(`[technology.ts] Error fetching technology by slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Get a technology by ID
 */
export async function getTechnologyById(id: string): Promise<CMSTechnology | null> {
  console.log(`[technology.ts] Fetching technology with ID: "${id}"`);
  
  if (!id || id.trim() === '') {
    console.warn("[technology.ts] Empty ID passed to getTechnologyById");
    return null;
  }
  
  try {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return await adapter.getById(id);
  } catch (error) {
    console.error(`[technology.ts] Error fetching technology by ID "${id}":`, error);
    throw error;
  }
}

/**
 * Create a new technology
 */
export async function createTechnology(data: TechnologyCreateInput, toast?: UseToastReturn): Promise<string> {
  console.log('[technology.ts] Creating new technology:', data);
  try {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    const result = await adapter.create(data);
    
    if (toast) {
      toast.toast({
        title: "Technology created",
        description: `${data.title} has been created successfully.`
      });
    }
    
    return result.id;
  } catch (error) {
    console.error('[technology.ts] Error creating technology:', error);
    
    if (toast) {
      toast.toast({
        title: "Error",
        description: `Failed to create technology: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
    
    throw error;
  }
}

/**
 * Update an existing technology
 */
export async function updateTechnology(
  id: string, 
  data: TechnologyUpdateInput, 
  toast?: UseToastReturn
): Promise<string> {
  console.log('[technology.ts] Updating technology:', id, data);
  
  try {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    const result = await adapter.update(id, data);
    
    if (toast) {
      toast.toast({
        title: "Technology updated",
        description: `${data.title} has been updated successfully.`
      });
    }
    
    return result.id;
  } catch (error) {
    console.error('[technology.ts] Error updating technology:', error);
    
    if (toast) {
      toast.toast({
        title: "Error",
        description: `Failed to update technology: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
    
    throw error;
  }
}

/**
 * Delete a technology
 */
export async function deleteTechnology(slug: string, toast?: UseToastReturn): Promise<boolean> {
  console.log(`[technology.ts] Deleting technology with slug: ${slug}`);
  
  try {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    
    // First get the technology ID from the slug
    const technology = await adapter.getBySlug(slug);
    
    if (!technology) {
      throw new Error(`Technology with slug "${slug}" not found`);
    }
    
    const success = await adapter.delete(technology.id);
    
    if (toast && success) {
      toast.toast({
        title: "Technology deleted",
        description: `The technology has been deleted successfully.`
      });
    }
    
    return success;
  } catch (error) {
    console.error(`[technology.ts] Error deleting technology "${slug}":`, error);
    
    if (toast) {
      toast.toast({
        title: "Error",
        description: `Failed to delete technology: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
    
    throw error;
  }
}

/**
 * Clone a technology
 */
export async function cloneTechnology(id: string, toast?: UseToastReturn): Promise<CMSTechnology | null> {
  console.log(`[technology.ts] Cloning technology with ID: ${id}`);
  
  try {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    const result = await adapter.clone(id);
    
    if (toast && result) {
      toast.toast({
        title: "Technology cloned",
        description: `${result.title} has been cloned successfully.`
      });
    }
    
    return result;
  } catch (error) {
    console.error(`[technology.ts] Error cloning technology "${id}":`, error);
    
    if (toast) {
      toast.toast({
        title: "Error",
        description: `Failed to clone technology: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
    
    throw error;
  }
}
