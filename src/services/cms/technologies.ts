import { CMSTechnology } from '@/types/cms';
import { getCMSProviderConfig } from './providerConfig';
import { getTechnologyAdapter } from './adapters/technologies/technologyAdapterFactory';
import { TechnologyCreateInput, TechnologyUpdateInput } from './adapters/technologies/types';
import { UseToastReturn } from '@/hooks/use-toast';

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
 * Delete a technology
 */
export async function deleteTechnology(slug: string): Promise<boolean> {
  return await technologyOperations.delete(slug);
}
