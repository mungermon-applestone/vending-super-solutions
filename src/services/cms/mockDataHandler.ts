import { IS_DEVELOPMENT } from '@/config/cms';
import { v4 as uuidv4 } from 'uuid';
import { LandingPage } from '@/types/landingPage';

export const useMockData = IS_DEVELOPMENT;

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
  'landing-pages': [
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
    }
  ]
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
    'landing-pages': [
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
      }
    ]
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
      mockData['landing-pages'] = [
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
        }
      ];
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
  const homeHeroId = "hero-home-123";
  const homeId = "landing-home-123";
  
  return [
    {
      id: homeId,
      page_key: "home",
      page_name: "Home Page",
      hero_content_id: homeHeroId,
      hero_content: {
        id: homeHeroId,
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
    }
  ];
}
