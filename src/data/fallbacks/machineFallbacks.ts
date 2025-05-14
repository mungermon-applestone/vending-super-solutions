
import { CMSMachine } from '@/types/cms';

/**
 * Machine fallbacks for when Contentful fails to load machine data
 */
export const MACHINE_FALLBACKS: CMSMachine[] = [
  {
    id: 'fallback-vending-machine-1',
    title: 'Smart Vending Machine',
    slug: 'smart-vending-machine',
    description: 'Our flagship smart vending machine for retail environments with touchless payment and real-time inventory tracking.',
    type: 'vending',
    mainImage: {
      id: 'fallback-image-1',
      url: '/images/machines/vending-machine-1.jpg',
      alt: 'Smart Vending Machine'
    },
    thumbnail: {
      id: 'fallback-thumb-1',
      url: '/images/machines/vending-machine-1-thumb.jpg',
      alt: 'Smart Vending Machine Thumbnail'
    },
    images: [
      {
        id: 'fallback-image-1',
        url: '/images/machines/vending-machine-1.jpg',
        alt: 'Smart Vending Machine'
      }
    ],
    features: [
      'Touchless payments',
      'Real-time inventory tracking',
      'Remote management',
      'Temperature control'
    ],
    specs: {
      'Dimensions': '72" x 39" x 35"',
      'Weight': '650 lbs',
      'Power': '110-240V',
      'Capacity': 'Up to 500 items'
    },
    temperature: 'ambient',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-vending-machine-2',
    title: 'Refrigerated Vending System',
    slug: 'refrigerated-vending-system',
    description: 'Keep products fresh with our refrigerated vending solution featuring adjustable temperature zones and energy-efficient operation.',
    type: 'vending',
    mainImage: {
      id: 'fallback-image-2',
      url: '/images/machines/vending-machine-2.jpg',
      alt: 'Refrigerated Vending Machine'
    },
    thumbnail: {
      id: 'fallback-thumb-2',
      url: '/images/machines/vending-machine-2-thumb.jpg',
      alt: 'Refrigerated Vending Machine Thumbnail'
    },
    images: [
      {
        id: 'fallback-image-2',
        url: '/images/machines/vending-machine-2.jpg',
        alt: 'Refrigerated Vending Machine'
      }
    ],
    features: [
      'Multi-zone temperature control',
      'Energy-efficient cooling',
      'Health lock monitors',
      'Automated inventory reports'
    ],
    specs: {
      'Dimensions': '72" x 41" x 38"',
      'Weight': '780 lbs',
      'Power': '110-240V',
      'Temperature Range': '33°F - 41°F'
    },
    temperature: 'refrigerated',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Get a fallback machine by slug
 */
export function getFallbackMachine(slug?: string): CMSMachine | null {
  if (!slug) return null;
  return MACHINE_FALLBACKS.find(machine => machine.slug === slug) || null;
}
