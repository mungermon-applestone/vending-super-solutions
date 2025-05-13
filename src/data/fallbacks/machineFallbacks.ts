
import { CMSMachine } from '@/types/cms';

/**
 * Fallback machine data for development and preview environments
 * Used when Contentful is not configured or encounters an error
 */
export const fallbackMachineData: Record<string, CMSMachine> = {
  'divi-wp': {
    id: 'fallback-divi-wp',
    contentType: 'machine',
    title: 'DIVI-WP Vending Machine',
    name: 'DIVI-WP Vending Machine',
    slug: 'divi-wp',
    description: 'Advanced vending machine with touchscreen interface and refrigeration capabilities.',
    type: 'vending',
    temperature: 'refrigerated',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568291170859-dd8c6c1c4ece?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dmVuZGluZyUyMG1hY2hpbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60',
        alt: 'DIVI-WP Vending Machine'
      }
    ],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1568291170859-dd8c6c1c4ece?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dmVuZGluZyUyMG1hY2hpbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60',
      alt: 'DIVI-WP Vending Machine'
    },
    features: [
      'Touchscreen interface',
      'Refrigeration',
      'Payment processing',
      'Remote monitoring'
    ],
    specs: {
      dimensions: '72" H x 39" W x 35" D',
      weight: '650 lbs',
      powerRequirements: '120V, 60Hz',
      capacity: '500 items',
      paymentOptions: 'Credit card, mobile payment, cash',
      connectivity: 'Wi-Fi, Ethernet'
    },
    featured: true,
    displayOrder: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  'smart-locker': {
    id: 'fallback-smart-locker',
    contentType: 'machine',
    title: 'Smart Locker System',
    name: 'Smart Locker System',
    slug: 'smart-locker',
    description: 'Intelligent locker system for secure package delivery and storage.',
    type: 'locker',
    temperature: 'ambient',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512503638402-a29a4c2b6a8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGxvY2tlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60',
        alt: 'Smart Locker System'
      }
    ],
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1512503638402-a29a4c2b6a8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGxvY2tlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60',
      alt: 'Smart Locker System'
    },
    features: [
      'Secure delivery',
      'Digital access codes',
      'Notification system',
      'Multi-size compartments'
    ],
    specs: {
      dimensions: '80" H x 60" W x 24" D',
      weight: '800 lbs',
      powerRequirements: '120V, 60Hz',
      capacity: '24 compartments',
      connectivity: 'Wi-Fi, Cellular'
    },
    featured: true,
    displayOrder: 2,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  }
};
