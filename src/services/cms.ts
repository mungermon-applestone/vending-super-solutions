
import { 
  CMSMachine, 
  CMSProductType, 
  CMSTestimonial, 
  CMSBusinessGoal 
} from '@/types/cms';
import { CMS_API_URL, IS_DEVELOPMENT } from '@/config/cms';
import { mockMachines, mockProductTypes } from '@/data/mockCmsData';

// Use mock data in development mode
const useMockData = IS_DEVELOPMENT;

// Mock data fetching function - will be replaced with actual API calls
async function fetchFromCMS<T>(contentType: string, params: Record<string, any> = {}): Promise<T[]> {
  console.log(`Fetching ${contentType} with params:`, params);
  
  if (useMockData) {
    console.log('Using mock data (development mode)');
    // Return mock data based on content type
    if (contentType === 'machines') {
      let filteredMachines = [...mockMachines] as unknown as T[];
      
      // Apply filters if present
      if (params.type) {
        filteredMachines = filteredMachines.filter((m: any) => m.type === params.type) as unknown as T[];
      }
      
      if (params.temperature) {
        filteredMachines = filteredMachines.filter((m: any) => m.temperature === params.temperature) as unknown as T[];
      }
      
      if (params.slug) {
        filteredMachines = filteredMachines.filter((m: any) => m.slug === params.slug) as unknown as T[];
      }
      
      return filteredMachines;
    } else if (contentType === 'product-types') {
      let filteredProducts = [...mockProductTypes] as unknown as T[];
      
      // Apply filters if present
      if (params.slug) {
        filteredProducts = filteredProducts.filter((p: any) => p.slug === params.slug) as unknown as T[];
      }
      
      return filteredProducts;
    }
    
    return [] as T[];
  }
  
  // In a real implementation, this would be:
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${CMS_API_URL}/${contentType}${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${contentType}: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from CMS (${contentType}):`, error);
    return [] as T[];
  }
}

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
  const productTypes = await fetchFromCMS<CMSProductType>('product-types', { slug });
  return productTypes.length > 0 ? productTypes[0] : null;
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
