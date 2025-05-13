
import { CMSMachine } from '@/types/cms';

export const fallbackMachineData: Record<string, CMSMachine> = {
  'divi-wp': {
    id: '1omUbnEhB6OeBFpwPFj1Ww',
    title: 'DIVI-WP',
    slug: 'divi-wp',
    type: 'vending',
    description: "Weather-protected vending system for outdoor installations with sealed compartments and climate resistance. Perfect for parks, transit stations, and other exposed locations.",
    temperature: 'ambient',
    features: [
      "Weather-resistant construction",
      "Anti-vandal reinforcements", 
      "Internal climate control system",
      "Sunlight-readable display",
      "Remote monitoring and diagnostics",
      "Solar power options available",
      "Ruggedized payment systems",
      "High-security locking system with tamper alerts"
    ],
    images: [{
      id: 'fallback-image-divi-wp',
      url: 'https://images.unsplash.com/photo-1557034362-4ec717153f8f',
      alt: 'DIVI-WP - Front View'
    }],
    specs: {
      dimensions: "76\"H x 42\"W x 36\"D",
      weight: "750 lbs (empty)",
      capacity: "Up to 350 items depending on configuration",
      powerRequirements: "110V, 8 amps",
      temperature: "Operating range: -10°F to 110°F with internal climate control",
      connectivity: "WiFi, Ethernet, Cellular (included)",
      paymentOptions: "Credit card, mobile payment, NFC",
      manufacturer: "VendTech Solutions",
      warranty: "3 years standard"
    }
  },
  'option-2-wall-mount': {
    id: 'option2wallmount',
    title: 'Option 2 Wall Mount',
    slug: 'option-2-wall-mount',
    type: 'vending',
    description: "Compact wall-mounted vending solution ideal for offices, break rooms, and small spaces.",
    temperature: 'ambient',
    features: [
      "Space-efficient design",
      "Easy wall mounting",
      "Digital touch interface",
      "Cashless payment system",
      "Remote inventory management"
    ],
    images: [{
      id: 'fallback-option2',
      url: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980',
      alt: 'Option 2 Wall Mount - Front View'
    }],
    specs: {
      dimensions: "32\"H x 28\"W x 18\"D",
      weight: "180 lbs (empty)",
      capacity: "Up to 120 items",
      powerRequirements: "110V, 5 amps",
      connectivity: "WiFi, Ethernet",
      paymentOptions: "Credit card, mobile payment, NFC",
      manufacturer: "VendTech Solutions",
      warranty: "2 years standard"
    }
  },
  'locker-10-cell': {
    id: 'locker10cell',
    title: 'Locker 10-Cell',
    slug: 'locker-10-cell',
    type: 'locker',
    description: "Modular smart locker system with 10 compartments for secure package delivery and pickup.",
    temperature: 'ambient',
    features: [
      "10 secure compartments",
      "Digital access control",
      "Notification system",
      "Administrative dashboard",
      "Expandable design"
    ],
    images: [{
      id: 'fallback-locker10',
      url: 'https://images.unsplash.com/photo-1606161290795-aa2093b87798',
      alt: 'Locker 10-Cell'
    }],
    specs: {
      dimensions: "72\"H x 36\"W x 24\"D",
      weight: "350 lbs (empty)",
      capacity: "10 compartments of varying sizes",
      powerRequirements: "110V, 3 amps",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      manufacturer: "VendTech Solutions",
      warranty: "3 years standard"
    }
  }
};
