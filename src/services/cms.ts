
import { 
  CMSMachine, 
  CMSProductType, 
  CMSTestimonial, 
  CMSBusinessGoal 
} from '@/types/cms';
import { IS_DEVELOPMENT } from '@/config/cms';
import { mockMachines, mockProductTypes } from '@/data/mockCmsData';
import { fetchFromCMS } from '@/services/cms/fetchFromCMS';

export async function getMachines(filters: Record<string, any> = {}): Promise<CMSMachine[]> {
  return await fetchFromCMS<CMSMachine>('machines', filters);
}

export async function getMachineBySlug(type: string, id: string): Promise<CMSMachine | null> {
  const machines = await fetchFromCMS<CMSMachine>('machines', { 
    slug: id,
    type: type
  });
  
  return machines.length > 0 ? machines[0] : null;
}

export async function getProductTypes(): Promise<CMSProductType[]> {
  return await fetchFromCMS<CMSProductType>('product-types');
}

export async function getProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  console.log(`Attempting to fetch product type with slug: ${slug}`);
  if (!slug || slug.trim() === '') {
    console.warn("Empty slug passed to getProductTypeBySlug");
    return null;
  }
  
  try {
    const productTypes = await fetchFromCMS<CMSProductType>('product-types', { slug });
    console.log(`Found ${productTypes.length} product types for slug ${slug}:`, productTypes);
    return productTypes.length > 0 ? productTypes[0] : null;
  } catch (error) {
    console.error(`Error fetching product type by slug ${slug}:`, error);
    return null;
  }
}

export async function getTestimonials(): Promise<CMSTestimonial[]> {
  return await fetchFromCMS<CMSTestimonial>('testimonials');
}

export async function getBusinessGoals(): Promise<CMSBusinessGoal[]> {
  return await fetchFromCMS<CMSBusinessGoal>('business-goals');
}

export async function getBusinessGoalBySlug(slug: string): Promise<CMSBusinessGoal | null> {
  const goals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { slug });
  return goals.length > 0 ? goals[0] : null;
}
