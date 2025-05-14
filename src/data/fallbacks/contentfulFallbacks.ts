
import { CMSMachine, CMSProductType, CMSImage, CMSFeature } from '@/types/cms';

// Fallback image for when no image is available
export const fallbackImage: CMSImage = {
  id: 'fallback-image',
  url: '/images/fallback-image.png',
  alt: 'No image available',
  width: 800,
  height: 600
};

// Fallback product type data
export const fallbackProducts: CMSProductType[] = [
  {
    id: 'fallback-product-1',
    title: 'Food Vending',
    slug: 'food-vending',
    description: 'Customizable food vending solutions for various environments.',
    image: fallbackImage,
    benefits: [
      'Increased accessibility',
      '24/7 availability',
      'Contactless options'
    ],
    features: [
      {
        id: 'fallback-feature-1',
        title: 'Temperature Control',
        description: 'Maintains optimal food temperature for safety and quality.',
        icon: 'thermometer'
      },
      {
        id: 'fallback-feature-2',
        title: 'Inventory Management',
        description: 'Real-time tracking of product inventory and sales.',
        icon: 'clipboard-list'
      }
    ]
  },
  {
    id: 'fallback-product-2',
    title: 'Retail Vending',
    slug: 'retail-vending',
    description: 'Automated retail solutions for non-food products.',
    image: fallbackImage,
    benefits: [
      'Reduced staffing needs',
      'Expanded retail footprint',
      'Custom branding options'
    ],
    features: [
      {
        id: 'fallback-feature-3',
        title: 'Flexible Configuration',
        description: 'Adjustable shelving and product sizing options.',
        icon: 'settings'
      },
      {
        id: 'fallback-feature-4',
        title: 'Secure Transactions',
        description: 'Multiple payment options with encryption and security features.',
        icon: 'shield'
      }
    ]
  }
];

// Fallback machine data
export const fallbackMachines: CMSMachine[] = [
  {
    id: 'fallback-machine-1',
    title: 'AutoVend 5000',
    slug: 'autovend-5000',
    type: 'vending',
    description: 'High-capacity vending machine with customizable shelving.',
    temperature: 'ambient',
    mainImage: fallbackImage,
    images: [fallbackImage],
    features: ['Touch Screen', 'Contactless Payment', 'Remote Monitoring'],
    specs: {
      dimensions: '72" x 39" x 35"',
      weight: '800 lbs',
      capacity: '500+ items',
      powerRequirements: '120V, 15A',
      connectivity: 'Ethernet, 4G LTE'
    },
    visible: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-machine-2',
    title: 'FridgeMax Pro',
    slug: 'fridgemax-pro',
    type: 'vending',
    description: 'Refrigerated vending solution for fresh food and beverages.',
    temperature: 'refrigerated',
    mainImage: fallbackImage,
    images: [fallbackImage],
    features: ['Temperature Monitoring', 'Glass Front Display', 'Energy Efficient'],
    specs: {
      dimensions: '72" x 41" x 36"',
      weight: '900 lbs',
      capacity: '350+ items',
      temperature: '33-41°F',
      powerRequirements: '120V, 20A'
    },
    visible: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Fallback product page content
export const fallbackProductPageContent = {
  purposeStatementTitle: 'Our Vending Products',
  purposeStatementDescription: 'Explore our range of vending solutions designed to meet your specific needs.',
  categoriesSectionTitle: 'Product Categories',
  categoriesSectionDescription: 'Browse our product categories to find the perfect solution for your business.',
  keyFeaturesTitle: 'Key Features',
  keyFeaturesDescription: 'All our products come with these powerful features to enhance your vending operations.',
  keyFeatures: [
    {
      title: 'Remote Monitoring',
      description: 'Track inventory, sales, and machine status in real-time from anywhere.',
      icon: 'wifi'
    },
    {
      title: 'Customizable Branding',
      description: 'Personalize your machines with your brand colors, logos, and messaging.',
      icon: 'palette'
    },
    {
      title: 'Contactless Payments',
      description: 'Accept all major payment methods including contactless cards and mobile payments.',
      icon: 'credit-card'
    }
  ]
};
