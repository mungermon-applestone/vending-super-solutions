
import { LandingPage, HeroContent } from '@/types/landingPage';

/**
 * Get mock landing pages data
 * @returns Array of mock landing pages
 */
export const getMockLandingPages = (): LandingPage[] => {
  return [
    {
      id: 'lp-001',
      page_key: 'home',
      page_name: 'Home Page',
      hero_content_id: 'hc-001',
      hero_content: {
        id: 'hc-001',
        title: 'Modern Vending Solutions',
        subtitle: 'Transform your retail experience with cutting-edge vending technology',
        image_url: '/images/hero-home.jpg',
        image_alt: 'Modern vending machine in a bright retail space',
        cta_primary_text: 'Explore Solutions',
        cta_primary_url: '/solutions',
        cta_secondary_text: 'Contact Sales',
        cta_secondary_url: '/contact',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'lp-002',
      page_key: 'products',
      page_name: 'Products Page',
      hero_content_id: 'hc-002',
      hero_content: {
        id: 'hc-002',
        title: 'Our Product Range',
        subtitle: 'Discover our full range of vending solutions for every need',
        image_url: '/images/products-hero.jpg',
        image_alt: 'Array of vending machines showing product range',
        cta_primary_text: 'View Products',
        cta_primary_url: '/products',
        cta_secondary_text: 'Request Demo',
        cta_secondary_url: '/contact?demo=true',
        background_class: 'bg-gradient-to-br from-vending-blue-dark via-vending-blue to-vending-blue-light',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
