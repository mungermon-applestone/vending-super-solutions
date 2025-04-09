
import { CMSMachine, CMSProductType, MockImage } from '@/types/cms';

/**
 * Mock CMS data for development and testing
 * This data emulates what would be returned from the CMS API
 */

// Helper function to ensure all images have IDs
const createImage = (url: string, alt: string): MockImage => ({
  id: `mock-${Math.random().toString(36).substr(2, 9)}`, // Ensure ID is always generated
  url,
  alt
});

export const mockMachines: CMSMachine[] = [
  {
    id: '1',
    slug: 'smart-vending',
    title: "Smart Vending Machine",
    description: "Interactive touchscreen vending for ambient products",
    images: [
      createImage("https://images.unsplash.com/photo-1525610553991-2bede1a236e2", "Smart Vending Machine"),
      createImage("https://images.unsplash.com/photo-1623039405147-547794f92e9e", "Smart Vending Machine - Side View"),
      createImage("https://images.unsplash.com/photo-1627843240167-b1f9440fc173", "Smart Vending Machine - Interior")
    ],
    type: "vending",
    temperature: "ambient",
    features: ["Touchscreen", "Cashless Payment", "Cloud Connectivity"],
    specs: {
      dimensions: "72\"H x 39\"W x 36\"D",
      weight: "650 lbs (empty)",
      capacity: "Up to 500 items",
      powerRequirements: "110V, 5 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash (optional)",
      priceRange: "$8,000 - $12,000"
    },
    deploymentExamples: [
      {
        title: "Corporate Office",
        description: "Deployed in Fortune 500 headquarters providing snacks and essentials to employees",
        image: createImage("https://images.unsplash.com/photo-1577412647305-991150c7d163", "Corporate office deployment")
      },
      {
        title: "University Campus",
        description: "Network of machines across campus providing 24/7 access to convenience items for students",
        image: createImage("https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", "University campus deployment")
      }
    ]
  },
  {
    id: '2',
    slug: 'refrigerated-beverage',
    title: "Refrigerated Beverage Machine",
    description: "Temperature-controlled vending for cold drinks and perishables",
    images: [createImage("https://images.unsplash.com/photo-1597393353415-b3730f3719fe", "Refrigerated Beverage Machine")],
    type: "vending",
    temperature: "refrigerated",
    features: ["Temperature Control", "Energy Efficient", "Digital Display"],
    specs: {
      dimensions: "72\"H x 41\"W x 38\"D",
      weight: "720 lbs (empty)",
      capacity: "Up to 400 items",
      powerRequirements: "110V, 8 amps",
      temperature: "34°F to 40°F",
      connectivity: "WiFi, Ethernet",
      paymentOptions: "Credit card, mobile payment, cash",
      priceRange: "$9,500 - $14,000"
    },
    deploymentExamples: []
  },
  {
    id: '3',
    slug: 'smart-locker-small',
    title: "Smart Locker System",
    description: "Compact smart lockers for secure item pickup",
    images: [createImage("https://images.unsplash.com/photo-1621964275191-ccc01ef2134c", "Smart Locker System")],
    type: "locker",
    temperature: "ambient",
    features: ["Secure Access", "Compact Design", "LED Indicators"],
    specs: {
      dimensions: "72\"H x 60\"W x 24\"D",
      weight: "450 lbs (empty)",
      capacity: "12-24 compartments",
      powerRequirements: "110V, 3 amps",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      priceRange: "$6,000 - $12,000"
    },
    deploymentExamples: []
  }
];

export const mockProductTypes: CMSProductType[] = [
  {
    id: '1',
    slug: 'grocery',
    title: "Grocery",
    description: "Automate grocery sales with temperature-controlled vending for snacks, drinks, and everyday essentials.",
    image: createImage("https://images.unsplash.com/photo-1604719312566-8912e9227c6a", "Grocery vending"),
    benefits: [
      "Real-time inventory tracking and automated reordering",
      "Temperature monitoring for refrigerated items",
      "Multi-payment options including contactless"
    ],
    features: [
      {
        id: '101',
        title: "Smart Inventory Management",
        description: "Track inventory levels in real-time, set automatic reorder points.",
        screenshot: createImage("https://images.unsplash.com/photo-1460925895917-afdab827c52f", "Inventory management")
      },
      {
        id: '102',
        title: "Temperature Monitoring",
        description: "Ensure food safety with continuous temperature monitoring.",
        screenshot: createImage("https://images.unsplash.com/photo-1606248897732-2c5ffe759c04", "Temperature monitoring")
      }
    ],
    examples: [
      {
        id: '201',
        title: "Campus Convenience",
        description: "University deployed grocery vending machines across campus.",
        image: createImage("https://images.unsplash.com/photo-1607492138996-7141257a4b67", "Campus vending")
      },
      {
        id: '202',
        title: "Workplace Pantry",
        description: "Tech company replaced break room with smart vending.",
        image: createImage("https://images.unsplash.com/photo-1567521464027-f35b1f9447e2", "Workplace vending")
      }
    ]
  },
  {
    id: '2',
    slug: 'vape',
    title: "Vape & Cannabis",
    description: "Secure solutions for age-restricted products with ID verification and compliance features.",
    image: createImage("https://images.unsplash.com/photo-1560913210-91e811632701", "Vape products"),
    benefits: [
      "Age verification with multiple methods",
      "Compliance reporting and audit trails",
      "Secure dispensing mechanisms"
    ],
    features: [
      {
        id: '103',
        title: "ID Verification",
        description: "Multiple verification methods including ID scanning and facial recognition.",
        screenshot: createImage("https://images.unsplash.com/photo-1610374792793-f016b77ca51a", "ID verification")
      }
    ],
    examples: []
  },
  {
    id: '3',
    slug: 'fresh-food',
    title: "Fresh Food",
    description: "Temperature-monitored vending for fresh meals, salads, and sandwiches with extended shelf life tracking.",
    image: createImage("https://images.unsplash.com/photo-1504674900247-0877df9cc836", "Fresh food"),
    benefits: [
      "Real-time temperature monitoring",
      "Shelf-life tracking and automated discounting",
      "FIFO inventory management"
    ],
    features: [],
    examples: []
  },
  {
    id: '4',
    slug: 'cosmetics',
    title: "Cosmetics",
    description: "Premium display options for beauty products with detailed product information access.",
    image: createImage("https://images.unsplash.com/photo-1596462502278-27bfdc403348", "Cosmetics"),
    benefits: [
      "High-end product displays",
      "Detailed product information and ingredient lists",
      "Tutorial videos and usage recommendations"
    ],
    features: [],
    examples: []
  }
];

// Update the CMS service to use mock data
export const updateCmsServiceWithMockData = () => {
  // In a real implementation, this would be replaced with actual API calls
  // This is just for development purposes
  return {
    getMachines: async () => mockMachines,
    getMachineBySlug: async (type: string, id: string) => 
      mockMachines.find(m => m.slug === id && m.type === type) || null,
    getProductTypes: async () => mockProductTypes,
    getProductTypeBySlug: async (slug: string) => 
      mockProductTypes.find(p => p.slug === slug) || null
  };
};
