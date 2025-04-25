
import { CMSProductType } from '@/types/cms';
import { toast } from 'sonner';

/**
 * Clones a product type in Contentful (stub)
 * @param idOrSlug The ID or slug of the product type to clone
 * @returns The cloned product type or null if cloning failed
 */
export async function cloneProductType(idOrSlug: string): Promise<CMSProductType | null> {
  console.log('[cloneProductType] This feature is not implemented yet');
  toast.error('Cloning product types is not supported with Contentful in this version');
  return null;
}
