import { LandingPage, LandingPageFormData } from '@/types/landingPage';
import { useMockData } from '../../mockDataHandler';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// In a real app, this would be a Supabase query
export async function fetchLandingPages(): Promise<LandingPage[]> {
  if (useMockData) {
    try {
      console.log("Starting to fetch landing pages with mock data");
      // Check if we have any landing pages in mock storage
      let landingPages = await getLandingPagesFromMock();
      
      // If no landing pages exist, seed the database with default data
      if (!landingPages || landingPages.length === 0) {
        console.log("No landing pages found, seeding default data");
        await seedDefaultLandingPages();
        // Fetch the newly created landing pages
        landingPages = await getLandingPagesFromMock();
      }
      
      console.log(`Fetched ${landingPages.length} landing pages:`, landingPages);
      return landingPages;
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      return [];
    }
  }
  
  // In a real implementation, this would connect to Supabase
  return [];
}

// Function to retrieve landing pages from mock storage
async function getLandingPagesFromMock(): Promise<LandingPage[]> {
  // This simulates a database with mock data stored in memory
  // In a real app, this would be fetched from Supabase
  console.log("Getting landing pages from mock storage");
  
  // Force return the mock data directly for now
  return [
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
}

// Function to seed default landing page data
async function seedDefaultLandingPages(): Promise<void> {
  const defaultPages = [
    {
      page_key: 'home',
      page_name: 'Homepage',
      hero: {
        title: 'Vend Anything You Sell',
        subtitle: 'Seamlessly integrate multiple vending machines with our advanced software solution. Sell any product, track inventory in real-time, and boost your revenue.',
        image_url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
        image_alt: 'Vending Machine Software Interface',
        cta_primary_text: 'Request a Demo',
        cta_primary_url: '/contact',
        cta_secondary_text: 'Explore Solutions',
        cta_secondary_url: '/products',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      }
    },
    {
      page_key: 'products',
      page_name: 'Products Page',
      hero: {
        title: 'Types of Products You Can Sell',
        subtitle: 'Our versatile vending software enables you to sell virtually any product type. Whether you\'re a vending operator, enterprise, SMB, or brand, our solutions adapt to your specific needs.',
        image_url: 'https://images.unsplash.com/photo-1481495278953-0a688f58e194',
        image_alt: 'Various vending products',
        cta_primary_text: 'Request a Demo',
        cta_primary_url: '/contact',
        cta_secondary_text: 'Manage Products',
        cta_secondary_url: '/admin/products',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      }
    },
    {
      page_key: 'business-goals',
      page_name: 'Business Goals Page',
      hero: {
        title: 'Business Goals',
        subtitle: 'Our comprehensive vending solutions help you achieve your business goals with powerful technology and customizable options.',
        image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
        image_alt: 'Business Goals',
        cta_primary_text: 'Request a Demo',
        cta_primary_url: '/contact',
        cta_secondary_text: 'Explore Solutions',
        cta_secondary_url: '/products',
        background_class: 'bg-gradient-to-r from-slate-50 to-slate-100',
      }
    },
    {
      page_key: 'machines',
      page_name: 'Machines Page',
      hero: {
        title: 'Our Machines',
        subtitle: 'Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs.',
        image_url: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c',
        image_alt: 'Various vending machines',
        cta_primary_text: 'Vending Machines',
        cta_primary_url: '#vending-machines',
        cta_secondary_text: 'Smart Lockers',
        cta_secondary_url: '#smart-lockers',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      }
    }
  ];
  
  console.log("Creating default landing pages:", defaultPages.length);
  
  // Create each landing page
  for (const pageData of defaultPages) {
    await createLandingPage(pageData);
  }
}

export async function fetchLandingPageByKey(key: string): Promise<LandingPage | null> {
  try {
    console.log(`Fetching landing page with key: ${key}`);
    const pages = await fetchLandingPages();
    const page = pages.find(page => page.page_key === key);
    console.log(`Found page for key ${key}:`, page ? "Yes" : "No");
    return page || null;
  } catch (error) {
    console.error(`Error fetching landing page with key ${key}:`, error);
    return null;
  }
}

export async function createLandingPage(data: LandingPageFormData): Promise<LandingPage> {
  const heroId = uuidv4();
  const pageId = uuidv4();
  const timestamp = new Date().toISOString();
  
  const newPage: LandingPage = {
    id: pageId,
    page_key: data.page_key,
    page_name: data.page_name,
    hero_content_id: heroId,
    hero_content: {
      id: heroId,
      title: data.hero.title,
      subtitle: data.hero.subtitle,
      image_url: data.hero.image_url,
      image_alt: data.hero.image_alt,
      cta_primary_text: data.hero.cta_primary_text,
      cta_primary_url: data.hero.cta_primary_url,
      cta_secondary_text: data.hero.cta_secondary_text,
      cta_secondary_url: data.hero.cta_secondary_url,
      background_class: data.hero.background_class || 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
      created_at: timestamp,
      updated_at: timestamp,
    },
    created_at: timestamp,
    updated_at: timestamp,
  };
  
  console.log("Created new landing page:", newPage.page_key);
  
  // With Supabase, this would insert the new page and hero content
  return newPage;
}

export async function updateLandingPage(id: string, data: Partial<LandingPageFormData>): Promise<LandingPage> {
  // In a real app with Supabase, this would update the record
  const pages = await fetchLandingPages();
  const pageToUpdate = pages.find(page => page.id === id);
  
  if (!pageToUpdate) {
    throw new Error(`Landing page with ID ${id} not found`);
  }
  
  const updatedPage = {
    ...pageToUpdate,
    page_key: data.page_key || pageToUpdate.page_key,
    page_name: data.page_name || pageToUpdate.page_name,
    updated_at: new Date().toISOString(),
    hero_content: {
      ...pageToUpdate.hero_content,
      title: data.hero?.title || pageToUpdate.hero_content.title,
      subtitle: data.hero?.subtitle || pageToUpdate.hero_content.subtitle,
      image_url: data.hero?.image_url || pageToUpdate.hero_content.image_url,
      image_alt: data.hero?.image_alt || pageToUpdate.hero_content.image_alt,
      cta_primary_text: data.hero?.cta_primary_text || pageToUpdate.hero_content.cta_primary_text,
      cta_primary_url: data.hero?.cta_primary_url || pageToUpdate.hero_content.cta_primary_url,
      cta_secondary_text: data.hero?.cta_secondary_text || pageToUpdate.hero_content.cta_secondary_text,
      cta_secondary_url: data.hero?.cta_secondary_url || pageToUpdate.hero_content.cta_secondary_url,
      background_class: data.hero?.background_class || pageToUpdate.hero_content.background_class,
      updated_at: new Date().toISOString(),
    }
  };
  
  return updatedPage;
}

export async function deleteLandingPage(id: string): Promise<void> {
  // In a real app with Supabase, this would delete the record
  console.log(`Deleting landing page with ID: ${id}`);
  // Implementation would delete both the page and associated hero content
}
