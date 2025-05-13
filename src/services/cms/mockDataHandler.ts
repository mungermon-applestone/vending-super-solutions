import { IS_DEVELOPMENT } from '@/config/cms';
import { v4 as uuidv4 } from 'uuid';
import { LandingPage } from '@/types/landingPage';

export const useMockData = IS_DEVELOPMENT;

// Mock landing pages data with multiple predefined pages
const mockLandingPages: LandingPage[] = [
  {
    id: "landing-home-123",
    page_key: "home",
    page_name: "Home Page",
    hero_content_id: "hero-home-123",
    hero_content: {
      id: "hero-home-123",
      title: "Vend Anything You Sell",
      subtitle: "Seamlessly integrate multiple vending machines with our advanced software solution. Sell any product, track inventory in real-time, and boost your revenue.",
      image_url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      image_alt: "Vending Machine Software Interface",
      cta_primary_text: "Request a Demo",
      cta_primary_url: "/contact",
      cta_secondary_text: "Explore Solutions", 
      cta_secondary_url: "/products",
      background_class: "bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "landing-products-456",
    page_key: "products",
    page_name: "Products Page",
    hero_content_id: "hero-products-456",
    hero_content: {
      id: "hero-products-456",
      title: "Our Vending Solutions",
      subtitle: "Explore our range of cutting-edge vending machines and software designed to maximize your revenue and customer satisfaction.",
      image_url: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4",
      image_alt: "Vending Machine Products",
      cta_primary_text: "View Machines",
      cta_primary_url: "/machines",
      cta_secondary_text: "Contact Sales",
      cta_secondary_url: "/contact",
      background_class: "bg-gradient-to-r from-slate-50 to-slate-100",
      created_at: "2023-01-02T00:00:00Z",
      updated_at: "2023-01-02T00:00:00Z"
    },
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z"
  },
  {
    id: "landing-machines-789",
    page_key: "machines",
    page_name: "Machines Page",
    hero_content_id: "hero-machines-789",
    hero_content: {
      id: "hero-machines-789",
      title: "Advanced Vending Machines",
      subtitle: "Our state-of-the-art machines are designed for reliability, security, and maximum customer engagement.",
      image_url: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4",
      image_alt: "Vending Machine Hardware",
      cta_primary_text: "Request Quote",
      cta_primary_url: "/contact",
      cta_secondary_text: "Learn More",
      cta_secondary_url: "/about",
      background_class: "bg-vending-blue-dark text-white",
      created_at: "2023-01-03T00:00:00Z",
      updated_at: "2023-01-03T00:00:00Z"
    },
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z"
  },
  {
    id: "landing-business-goals-101112",
    page_key: "business-goals",
    page_name: "Business Goals Page",
    hero_content_id: "hero-business-goals-101112",
    hero_content: {
      id: "hero-business-goals-101112",
      title: "Achieve Your Business Goals",
      subtitle: "Our vending solutions help you meet and exceed your business objectives through innovative technology and strategic placement.",
      image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
      image_alt: "Business Growth Chart",
      cta_primary_text: "Explore Solutions",
      cta_primary_url: "/products",
      cta_secondary_text: "Schedule Consultation",
      cta_secondary_url: "/contact",
      background_class: "bg-vending-teal text-white",
      created_at: "2023-01-04T00:00:00Z",
      updated_at: "2023-01-04T00:00:00Z"
    },
    created_at: "2023-01-04T00:00:00Z",
    updated_at: "2023-01-04T00:00:00Z"
  }
];

// Mock data store
let mockData: { [key: string]: any[] } = {
  'product-types': [
    {
      id: 'pt-1',
      name: 'Robotic Vending Machines',
      slug: 'robotic-vending-machines',
      description: 'Cutting-edge vending solutions with robotic precision.',
      image_url: 'https://placehold.co/600x400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pt-2',
      name: 'Smart Vending Machines',
      slug: 'smart-vending-machines',
      description: 'Intelligent vending machines with advanced analytics.',
      image_url: 'https://placehold.co/600x400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'machines': [
    {
      id: 'm-1',
      name: 'RoboVend 2000',
      slug: 'robovend-2000',
      type: 'robotic-vending-machines',
      description: 'Advanced robotic vending for complex products.',
      image_url: 'https://placehold.co/600x400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'm-2',
      name: 'SmartVend 3000',
      slug: 'smartvend-3000',
      type: 'smart-vending-machines',
      description: 'Smart vending with real-time inventory tracking.',
      image_url: 'https://placehold.co/600x400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'testimonials': [
    {
      id: 't-1',
      author: 'John Doe',
      role: 'CEO, Tech Solutions Inc.',
      text: 'Vending Super Solutions transformed our business!',
      image_url: 'https://placehold.co/100x100',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'business-goals': [
    {
      id: 'bg-1',
      name: 'Increase Revenue',
      slug: 'increase-revenue',
      description: 'Boost your revenue with our vending solutions.',
      image_url: 'https://placehold.co/600x400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'technologies': [
    {
      id: 'tech-1',
      name: 'AI-Powered Inventory',
      slug: 'ai-powered-inventory',
      description: 'AI tech for smart inventory management.',
      image_url: 'https://placehold.co/600x400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'case-studies': [
    {
      id: 'cs-1',
      title: 'Tech Solutions Success',
      slug: 'tech-solutions-success',
      description: 'How Tech Solutions increased revenue by 40%.',
      image_url: 'https://placehold.co/600x400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'blog-posts': [
    {
      id: 'bp-1',
      title: 'The Future of Vending',
      slug: 'future-of-vending',
      content: 'Explore the future trends in vending technology.',
      image_url: 'https://placehold.co/600x400',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'landing-pages': mockLandingPages
};

// Function to seed initial mock data
export const seedMockData = () => {
  // Check if mock data is already seeded
  if (Object.keys(mockData).length > 0) {
    console.log('Mock data already seeded.');
    return;
  }

  mockData = {
    'product-types': [
      {
        id: 'pt-1',
        name: 'Robotic Vending Machines',
        slug: 'robotic-vending-machines',
        description: 'Cutting-edge vending solutions with robotic precision.',
        image_url: 'https://placehold.co/600x400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'pt-2',
        name: 'Smart Vending Machines',
        slug: 'smart-vending-machines',
        description: 'Intelligent vending machines with advanced analytics.',
        image_url: 'https://placehold.co/600x400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    'machines': [
      {
        id: 'm-1',
        name: 'RoboVend 2000',
        slug: 'robovend-2000',
        type: 'robotic-vending-machines',
        description: 'Advanced robotic vending for complex products.',
        image_url: 'https://placehold.co/600x400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'm-2',
        name: 'SmartVend 3000',
        slug: 'smartvend-3000',
        type: 'smart-vending-machines',
        description: 'Smart vending with real-time inventory tracking.',
        image_url: 'https://placehold.co/600x400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    'testimonials': [
      {
        id: 't-1',
        author: 'John Doe',
        role: 'CEO, Tech Solutions Inc.',
        text: 'Vending Super Solutions transformed our business!',
        image_url: 'https://placehold.co/100x100',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    'business-goals': [
      {
        id: 'bg-1',
        name: 'Increase Revenue',
        slug: 'increase-revenue',
        description: 'Boost your revenue with our vending solutions.',
        image_url: 'https://placehold.co/600x400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    'technologies': [
      {
        id: 'tech-1',
        name: 'AI-Powered Inventory',
        slug: 'ai-powered-inventory',
        description: 'AI tech for smart inventory management.',
        image_url: 'https://placehold.co/600x400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    'case-studies': [
      {
        id: 'cs-1',
        title: 'Tech Solutions Success',
        slug: 'tech-solutions-success',
        description: 'How Tech Solutions increased revenue by 40%.',
        image_url: 'https://placehold.co/600x400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    'blog-posts': [
      {
        id: 'bp-1',
        title: 'The Future of Vending',
        slug: 'future-of-vending',
        content: 'Explore the future trends in vending technology.',
        image_url: 'https://placehold.co/600x400',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    'landing-pages': mockLandingPages
  };
  
  console.log('Mock data seeded.');
};

// Call seedMockData when the module is imported
if (useMockData) {
  seedMockData();
}

// Generic function to fetch mock data
export async function getMockData<T>(contentType: string, params: Record<string, any> = {}): Promise<T[]> {
  console.log(`[getMockData] Fetching mock data for ${contentType} with params:`, params);

  if (!mockData[contentType]) {
    console.warn(`[getMockData] No mock data found for content type: ${contentType}`);
    
    // Initialize landing pages if this is the first time we're trying to access it
    if (contentType === 'landing-pages' && useMockData) {
      console.log('[getMockData] Initializing landing pages mock data');
      mockData['landing-pages'] = mockLandingPages;
    }
    
    // If still no data, return empty array
    if (!mockData[contentType]) {
      return [];
    }
  }

  let results = [...mockData[contentType]] as T[];

  // Apply filters from params
  Object.keys(params).forEach(key => {
    results = results.filter((item: any) => {
      if (typeof item[key] === 'string') {
        return item[key].toLowerCase().includes(params[key].toLowerCase());
      } else {
        return item[key] === params[key];
      }
    });
  });

  console.log(`[getMockData] Returning ${results.length} mock items for ${contentType}`);
  return results;
}

// Export function to get mock landing pages (keep this for compatibility)
export function _getMockLandingPages() {
  return mockLandingPages;
}

// Define window.__MOCK_DATA type to avoid TypeScript errors
declare global {
  interface Window {
    __MOCK_DATA: {
      [key: string]: any[];
    };
  }
}
