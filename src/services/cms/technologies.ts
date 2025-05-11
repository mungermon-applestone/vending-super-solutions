
import { CMSTechnology } from '@/types/cms';
import { getTechnologyAdapter } from './adapters/technologies';
import { TechnologyCreateInput, TechnologyUpdateInput } from './adapters/technologies/types';
import { logDeprecationWarning } from './utils/deprecationLogger';

// Import the operations directly
import { technologyOperations } from './contentTypes/technologies';

/**
 * Get all technologies
 */
export async function getTechnologies(): Promise<CMSTechnology[]> {
  console.log("[technology.ts] Fetching all technologies");
  try {
    // Use the Contentful adapter directly for clarity
    const adapter = getTechnologyAdapter();
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
    const adapter = getTechnologyAdapter();
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
    const adapter = getTechnologyAdapter();
    return await adapter.getById(id);
  } catch (error) {
    console.error(`[technology.ts] Error fetching technology by ID "${id}":`, error);
    throw error;
  }
}

/**
 * Create a new technology
 */
export async function createTechnology(data: TechnologyCreateInput): Promise<string> {
  console.log('[technology.ts] Creating new technology:', data);
  try {
    const adapter = getTechnologyAdapter();
    const result = await adapter.create(data);
    return result.id;
  } catch (error) {
    console.error('[technology.ts] Error creating technology:', error);
    throw error;
  }
}

/**
 * Update an existing technology
 */
export async function updateTechnology(id: string, data: TechnologyUpdateInput): Promise<string> {
  console.log('[technology.ts] Updating technology:', id, data);
  
  try {
    const adapter = getTechnologyAdapter();
    const result = await adapter.update(id, data);
    return result.id;
  } catch (error) {
    console.error('[technology.ts] Error updating technology:', error);
    throw error;
  }
}

/**
 * Delete a technology
 */
export async function deleteTechnology(slug: string): Promise<boolean> {
  console.log(`[technology.ts] Deleting technology with slug: ${slug}`);
  
  try {
    const adapter = getTechnologyAdapter();
    
    // First get the technology ID from the slug
    const technology = await adapter.getBySlug(slug);
    
    if (!technology) {
      throw new Error(`Technology with slug "${slug}" not found`);
    }
    
    const success = await adapter.delete(technology.id);
    return success;
  } catch (error) {
    console.error(`[technology.ts] Error deleting technology "${slug}":`, error);
    throw error;
  }
}

/**
 * Clone a technology
 */
export async function cloneTechnology(id: string): Promise<CMSTechnology | null> {
  console.log(`[technology.ts] Cloning technology with ID: ${id}`);
  
  try {
    const adapter = getTechnologyAdapter();
    const result = await adapter.clone(id);
    return result;
  } catch (error) {
    console.error(`[technology.ts] Error cloning technology "${id}":`, error);
    throw error;
  }
}

// Re-export the technology operations for direct use
export { technologyOperations };
