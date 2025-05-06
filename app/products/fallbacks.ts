
import { CMSProductType } from '@/types/cms';

// Default product data when Contentful isn't available
export const productFallbacks: Record<string, CMSProductType> = {
  'cosmetics-vending': {
    id: 'cosmetics-vending-fallback',
    title: 'Cosmetics Vending Solution',
    slug: 'cosmetics-vending',
    description: 'Our cosmetics vending machines provide a convenient way for customers to purchase beauty products 24/7. These machines feature temperature control to maintain product quality and touchscreen interfaces for an interactive shopping experience.',
    benefits: [
      'Extends sales beyond store hours with 24/7 availability',
      'Temperature-controlled environment preserves product quality',
      'Interactive touchscreen allows product exploration and recommendations',
      'Compact footprint perfect for high-traffic areas',
      'Built-in inventory management system alerts when restocking is needed'
    ],
    features: [],
    image: {
      url: 'https://picsum.photos/800/600?random=1',
      alt: 'Cosmetics Vending Machine'
    },
    visible: true
  },
  'food-vending': {
    id: 'food-vending-fallback',
    title: 'Food Vending Solution',
    slug: 'food-vending',
    description: 'Our food vending solutions provide fresh, high-quality meals and snacks around the clock. Featuring advanced temperature control and inventory management systems.',
    benefits: [
      'Fresh food available 24/7',
      'Temperature controls ensure food safety',
      'Contactless payment options',
      'Remote monitoring of inventory and sales',
      'Customizable menu options'
    ],
    features: [],
    image: {
      url: 'https://picsum.photos/800/600?random=2',
      alt: 'Food Vending Machine'
    },
    visible: true
  },
  'retail-vending': {
    id: 'retail-vending-fallback',
    title: 'Retail Vending Solution',
    slug: 'retail-vending',
    description: 'Transform any space into a retail point with our automated retail vending solutions. Perfect for electronics, clothing, and high-value merchandise.',
    benefits: [
      'Turn any location into a retail point',
      'Secure storage for high-value items',
      'Interactive product displays',
      'Integrated security features',
      'Real-time sales analytics'
    ],
    features: [],
    image: {
      url: 'https://picsum.photos/800/600?random=3',
      alt: 'Retail Vending Machine'
    },
    visible: true
  }
};
