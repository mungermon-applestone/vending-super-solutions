
import { 
  CMSMachine, 
  CMSProductType, 
  CMSTestimonial, 
  CMSBusinessGoal 
} from '@/types/cms';
import { IS_DEVELOPMENT } from '@/config/cms';
import { mockMachines, mockProductTypes } from '@/data/mockCmsData';
import { supabase } from '@/integrations/supabase/client';

// Use mock data in development mode if needed
const useMockData = IS_DEVELOPMENT && false; // Set to true to use mock data instead of Supabase

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
  
  // Real implementation using Supabase
  try {
    if (contentType === 'machines') {
      let query = supabase
        .from('machines')
        .select(`
          id,
          slug,
          title,
          type,
          temperature,
          description,
          machine_images (
            id,
            url,
            alt,
            width,
            height,
            display_order
          ),
          machine_specs (
            id,
            key,
            value
          ),
          machine_features (
            id,
            feature,
            display_order
          ),
          deployment_examples (
            id,
            title,
            description,
            image_url,
            image_alt,
            display_order
          )
        `)
        .eq('visible', true);
      
      // Apply filters if present
      if (params.type) {
        query = query.eq('type', params.type);
      }
      
      if (params.temperature) {
        query = query.eq('temperature', params.temperature);
      }
      
      if (params.slug) {
        query = query.eq('slug', params.slug);
      }
      
      const { data, error } = await query.order('title');
      
      if (error) {
        throw error;
      }

      // Transform the Supabase response to match our CMS types
      return data.map(machine => {
        // Sort related data by display_order
        const sortedImages = [...machine.machine_images].sort((a, b) => a.display_order - b.display_order);
        const sortedFeatures = [...machine.machine_features].sort((a, b) => a.display_order - b.display_order);
        const sortedExamples = [...machine.deployment_examples].sort((a, b) => a.display_order - b.display_order);
        
        // Transform to our CMSMachine type
        return {
          id: machine.id,
          slug: machine.slug,
          title: machine.title,
          type: machine.type,
          temperature: machine.temperature,
          description: machine.description,
          images: sortedImages.map(img => ({
            url: img.url,
            alt: img.alt,
            width: img.width,
            height: img.height
          })),
          specs: machine.machine_specs.reduce((acc, spec) => {
            acc[spec.key] = spec.value;
            return acc;
          }, {} as Record<string, string>),
          features: sortedFeatures.map(f => f.feature),
          deploymentExamples: sortedExamples.map(ex => ({
            title: ex.title,
            description: ex.description,
            image: {
              url: ex.image_url,
              alt: ex.image_alt
            }
          }))
        } as unknown as T;
      });
    } else if (contentType === 'product-types') {
      // Similar approach for product types (stubbed for now)
      return [] as T[];
    } else if (contentType === 'testimonials') {
      // Testimonials implementation
      return [] as T[];
    } else if (contentType === 'business-goals') {
      // Business goals implementation
      return [] as T[];
    }
    
    return [] as T[];
  } catch (error) {
    console.error(`Error fetching from Supabase (${contentType}):`, error);
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
