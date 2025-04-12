
import { IS_DEVELOPMENT } from '@/config/cms';
import { mockMachines, mockProductTypes } from '@/data/mockCmsData';
import { LandingPage } from '@/types/landingPage';

// Use mock data in development mode if needed
export const useMockData = IS_DEVELOPMENT && true; // Set to true to use mock data instead of Supabase

// Shared mock landing pages data to maintain consistency across calls
let mockLandingPagesData: LandingPage[] = [
  {
    id: '1',
    page_key: 'home',
    page_name: 'Homepage',
    hero_content_id: '1',
    hero_content: {
      id: '1',
      title: 'Vend Anything You Sell',
      subtitle: 'Seamlessly integrate multiple vending machines with our advanced software solution. Sell any product, track inventory in real-time, and boost your revenue.',
      image_url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
      image_alt: 'Vending Machine Software Interface',
      cta_primary_text: 'Request a Demo',
      cta_primary_url: '/contact',
      cta_secondary_text: 'Explore Solutions',
      cta_secondary_url: '/products',
      background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    page_key: 'products',
    page_name: 'Products Page',
    hero_content_id: '2',
    hero_content: {
      id: '2',
      title: 'Types of Products You Can Sell',
      subtitle: 'Our versatile vending software enables you to sell virtually any product type. Whether you\'re a vending operator, enterprise, SMB, or brand, our solutions adapt to your specific needs.',
      image_url: 'https://images.unsplash.com/photo-1481495278953-0a688f58e194',
      image_alt: 'Various vending products',
      cta_primary_text: 'Request a Demo',
      cta_primary_url: '/contact',
      cta_secondary_text: 'Manage Products',
      cta_secondary_url: '/admin/products',
      background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    page_key: 'business-goals',
    page_name: 'Business Goals Page',
    hero_content_id: '3',
    hero_content: {
      id: '3',
      title: 'Business Goals',
      subtitle: 'Our comprehensive vending solutions help you achieve your business goals with powerful technology and customizable options.',
      image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
      image_alt: 'Business Goals',
      cta_primary_text: 'Request a Demo',
      cta_primary_url: '/contact',
      cta_secondary_text: 'Explore Solutions',
      cta_secondary_url: '/products',
      background_class: 'bg-gradient-to-r from-slate-50 to-slate-100',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    page_key: 'machines',
    page_name: 'Machines Page',
    hero_content_id: '4',
    hero_content: {
      id: '4',
      title: 'Our Machines',
      subtitle: 'Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs.',
      image_url: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c',
      image_alt: 'Various vending machines',
      cta_primary_text: 'Vending Machines',
      cta_primary_url: '#vending-machines',
      cta_secondary_text: 'Smart Lockers',
      cta_secondary_url: '#smart-lockers',
      background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

/**
 * Get mock data for a specific content type
 * @param contentType The type of content to fetch
 * @param params Query parameters to filter results
 * @returns Promise resolving to the requested mock data
 */
export async function getMockData<T>(contentType: string, params: Record<string, any> = {}): Promise<T[]> {
  console.log(`[getMockData] Getting mock data for ${contentType} with params:`, params);
  
  switch (contentType) {
    case 'machines':
      if (params.slug) {
        const machine = mockMachines.find(m => m.slug === params.slug);
        return machine ? [machine] as unknown as T[] : [] as T[];
      }
      return mockMachines as unknown as T[];
      
    case 'product-types':
      if (params.slug) {
        const productType = mockProductTypes.find(p => p.slug === params.slug);
        return productType ? [productType] as unknown as T[] : [] as T[];
      }
      return mockProductTypes as unknown as T[];
    
    case 'landing-pages':
      console.log(`[getMockData] Returning ${mockLandingPagesData.length} mock landing pages`);
      return mockLandingPagesData as unknown as T[];
      
    default:
      console.log(`[getMockData] Unknown content type: ${contentType}`);
      return [] as T[];
  }
}

// Export for testing purposes
export function _getMockLandingPages(): LandingPage[] {
  return mockLandingPagesData;
}
