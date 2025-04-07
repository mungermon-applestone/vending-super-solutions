import React from 'react';
import { CMSProductType } from '@/types/cms';
import { ShoppingBag, ShieldCheck, Utensils, Tags, Truck, Clock, Sparkles, ThumbsUp, Pill } from 'lucide-react';

// Create a mapping of fallback data for specific product types
export const productFallbacks: Record<string, CMSProductType> = {
  'grocery': {
    id: 'grocery',
    slug: 'grocery',
    title: "Grocery",
    description: "Our vending software helps you sell packaged foods, snacks, drinks, and everyday essentials with robust inventory management and temperature monitoring.",
    image: {
      url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a",
      alt: "Grocery vending"
    },
    benefits: [
      "Real-time inventory tracking and automated reordering",
      "Temperature monitoring and alerts for refrigerated items",
      "Multi-payment options including contactless and mobile payments",
      "Nutritional information display for health-conscious consumers",
      "Product expiration date tracking to reduce waste",
      "Analytics for optimizing product selection based on sales data"
    ],
    features: [
      {
        title: "Smart Inventory Management",
        description: "Track inventory levels in real-time, set automatic reorder points, and receive alerts when stock runs low. Our system uses predictive analytics to help you optimize your product mix and reduce waste.",
        icon: <ShoppingBag className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
          alt: "Inventory Management"
        }
      },
      {
        title: "Temperature Monitoring",
        description: "Ensure food safety with continuous temperature monitoring for refrigerated items. Receive immediate alerts if temperatures fall outside safe ranges to prevent product spoilage.",
        icon: <ShieldCheck className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1606248897732-2c5ffe759c04",
          alt: "Temperature Monitoring"
        }
      },
      {
        title: "Nutritional Information Display",
        description: "Help customers make informed choices with detailed nutritional information, ingredient lists, and allergen warnings displayed on the touchscreen interface.",
        icon: <Utensils className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
          alt: "Nutritional Information"
        }
      },
      {
        title: "Dynamic Pricing",
        description: "Implement flexible pricing strategies including time-based discounts, bundle offers, and loyalty rewards to increase sales and reduce waste of perishable items.",
        icon: <Tags className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1553729459-efe14ef6055d",
          alt: "Dynamic Pricing"
        }
      },
      {
        title: "Supply Chain Integration",
        description: "Seamlessly connect with your suppliers for automated ordering, delivery scheduling, and inventory reconciliation to streamline your operations.",
        icon: <Truck className="h-6 w-6 text-vending-teal" />
      },
      {
        title: "Expiration Date Tracking",
        description: "Track product expiration dates to ensure freshness, automate price reductions for items nearing expiration, and minimize waste through smart inventory rotation.",
        icon: <Clock className="h-6 w-6 text-vending-teal" />
      }
    ],
    examples: [
      {
        title: "Campus Convenience",
        description: "University deployed grocery vending machines across campus, providing 24/7 access to essentials for students.",
        image: {
          url: "https://images.unsplash.com/photo-1607492138996-7141257a4b67",
          alt: "Campus Convenience"
        }
      },
      {
        title: "Workplace Pantry",
        description: "Tech company replaced traditional break room with smart vending solution, offering healthy snacks and meal options.",
        image: {
          url: "https://images.unsplash.com/photo-1567521464027-f35b1f9447e2",
          alt: "Workplace Pantry"
        }
      },
      {
        title: "Apartment Complex Convenience",
        description: "Residential building installed grocery vending in the lobby, giving residents access to essentials without leaving the building.",
        image: {
          url: "https://images.unsplash.com/photo-1559553156-2e97137af16f",
          alt: "Apartment Complex"
        }
      }
    ],
    video: {
      title: "See Grocery Vending in Action",
      description: "Watch how our grocery vending solutions provide convenience and accessibility for consumers while offering robust management tools for operators.",
      thumbnailImage: {
        url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2",
        alt: "Grocery Vending Video"
      }
    }
  },
  'vape': {
    id: 'vape',
    slug: 'vape',
    title: "Vape",
    description: "Secure vending solutions for vape products with robust age verification and compliance tracking.",
    image: {
      url: "https://images.unsplash.com/photo-1560913210-91e811632701",
      alt: "Vape products"
    },
    benefits: [
      "Secure age verification with multiple authentication methods",
      "Compliance tracking and reporting for regulatory requirements",
      "Inventory management with serialization tracking",
      "Anti-theft features and security monitoring",
      "Integration with state tracking systems where required",
      "Product information display including warnings and ingredients"
    ],
    features: [
      {
        title: "Age Verification System",
        description: "Multi-factor age verification including ID scanning, facial recognition, and credit card verification to ensure legal compliance.",
        icon: <ShieldCheck className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1610374792793-f016b77ca51a",
          alt: "Age Verification"
        }
      }
    ],
    examples: [
      {
        title: "Vape Shop Automation",
        description: "Vape retailer expanded with unmanned satellite locations using secure vending machines.",
        image: {
          url: "https://images.unsplash.com/photo-1588731247530-4076fc99173e",
          alt: "Vape Shop Automation"
        }
      }
    ],
    video: {
      title: "Secure Vape Vending Solutions",
      description: "See how our vape vending technology ensures both convenience and regulatory compliance.",
      thumbnailImage: {
        url: "https://images.unsplash.com/photo-1595402507356-b7417a2e31f6",
        alt: "Vape Vending Video"
      }
    }
  },
  'cosmetics': {
    id: 'cosmetics',
    slug: 'cosmetics',
    title: "Cosmetics",
    description: "Premium vending solutions for beauty and skincare products with sophisticated product display options and detailed information kiosks.",
    image: {
      url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
      alt: "Cosmetics products"
    },
    benefits: [
      "Temperature-controlled storage for sensitive products",
      "High-resolution product displays with zoom capability",
      "Detailed ingredient and usage information",
      "Touchless dispensing options for hygiene",
      "Product recommendation system based on customer preferences",
      "Integrated product testing and sampling features"
    ],
    features: [
      {
        title: "Premium Product Display",
        description: "Showcase cosmetics with high-definition screens and 360° product views to highlight details and packaging.",
        icon: <Sparkles className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
          alt: "Premium cosmetics display"
        }
      },
      {
        title: "Product Information Kiosk",
        description: "Interactive touchscreen provides detailed information about ingredients, application methods, and benefits of each product.",
        icon: <ThumbsUp className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
          alt: "Product information kiosk"
        }
      }
    ],
    examples: [
      {
        title: "Mall Beauty Station",
        description: "Self-service beauty product vending machine offering premium cosmetics in high-traffic shopping areas.",
        image: {
          url: "https://images.unsplash.com/photo-1607602132700-068673eea729",
          alt: "Mall Beauty Station"
        }
      }
    ],
    video: {
      title: "Cosmetics Vending Innovation",
      description: "See how our cosmetics vending solutions are transforming the beauty retail landscape with interactive features and premium product displays.",
      thumbnailImage: {
        url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
        alt: "Cosmetics Vending Video"
      }
    }
  },
  'otc': {
    id: 'otc',
    slug: 'otc',
    title: "OTC Products",
    description: "Secure and compliant vending solutions for over-the-counter medications and health products with temperature control and expiration tracking.",
    image: {
      url: "https://images.unsplash.com/photo-1584362917165-526a968579e8",
      alt: "OTC products"
    },
    benefits: [
      "Compliant with pharmacy regulations",
      "Secure product dispensing with verification",
      "Temperature-controlled storage for sensitive medications",
      "Expiration date tracking and automatic removal",
      "Product information display for dosage and usage",
      "Integration with pharmacy management systems"
    ],
    features: [
      {
        title: "Medication Safety Features",
        description: "Built-in verification systems ensure proper handling and dispensing of OTC medications with appropriate usage guidelines displayed.",
        icon: <Pill className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
          alt: "Medication safety features"
        }
      },
      {
        title: "Compliance Management",
        description: "Automated tracking of medication regulations and sales restrictions to ensure full compliance with local and federal laws.",
        icon: <ShieldCheck className="h-6 w-6 text-vending-teal" />,
        screenshot: {
          url: "https://images.unsplash.com/photo-1576602976047-174e57a47881",
          alt: "Compliance management"
        }
      }
    ],
    examples: [
      {
        title: "24/7 Pharmacy Access",
        description: "Pharmacy chain extended hours of operation with OTC medication vending machines in accessible locations.",
        image: {
          url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
          alt: "24/7 Pharmacy Access"
        }
      }
    ],
    video: {
      title: "Next-Generation OTC Dispensing",
      description: "See how our OTC vending solutions are transforming medication accessibility while maintaining strict compliance standards.",
      thumbnailImage: {
        url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de",
        alt: "OTC Vending Video"
      }
    }
  }
  // Add more product fallbacks as needed
};
