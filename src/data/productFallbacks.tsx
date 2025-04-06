
import React from 'react';
import { CMSProductType } from '@/types/cms';
import { ShoppingBag, ShieldCheck, Utensils, Tags, Truck, Clock } from 'lucide-react';

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
  }
  // Add more product fallbacks as needed
};
