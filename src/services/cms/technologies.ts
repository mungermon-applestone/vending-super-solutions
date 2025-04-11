
import { CMSTechnology } from '@/types/cms';
import { technologyOperations } from './contentTypes/technologies';

/**
 * Get all technologies
 */
export async function getTechnologies(): Promise<CMSTechnology[]> {
  return await technologyOperations.fetchAll();
}

/**
 * Get a technology by slug
 */
export async function getTechnologyBySlug(slug: string): Promise<CMSTechnology | null> {
  return await technologyOperations.fetchBySlug(slug);
}

/**
 * Delete a technology
 */
export async function deleteTechnology(slug: string): Promise<boolean> {
  return await technologyOperations.delete(slug);
}
