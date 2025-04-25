
import { CMSProductType } from '@/types/cms';
import { toast } from 'sonner';

/**
 * Creates a new product type in Contentful (stub)
 * @param data The product type data to create
 * @returns The created product type or null if creation failed
 */
export async function createProductType(data: any): Promise<CMSProductType | null> {
  console.log('[createProductType] This feature is not implemented yet');
  toast.error('Creating product types is not supported with Contentful in this version');
  return null;
}
