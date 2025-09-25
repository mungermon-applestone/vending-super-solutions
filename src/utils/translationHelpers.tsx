import React from 'react';
import TranslatableText from '@/components/translation/TranslatableText';

/**
 * Helper function to create translatable fallback business goals
 */
export const createTranslatableFallbackBusinessGoals = () => [
  {
    id: "expand-footprint",
    slug: "expand-footprint",
    title: "Expand Footprint",
    description: "Grow your business with scalable vending solutions that adapt to various locations and needs.",
    visible: true,
    icon: "vending",
    benefits: [
      "Increase revenue streams", 
      "Access new markets", 
      "Scale without physical storefronts"
    ],
    features: []
  },
  {
    id: "bopis",
    slug: "bopis",
    title: "Buy Online, Pickup In Store (BOPIS)",
    description: "Enable customers to order ahead and collect purchases from your vending machines.",
    visible: true,
    icon: "vending",
    benefits: [
      "Boost conversion rates", 
      "Improve customer experience", 
      "Reduce abandonment"
    ],
    features: []
  },
  {
    id: "marketing",
    slug: "marketing",
    title: "Marketing & Promotions",
    description: "Drive sales with targeted promotions, digital advertising, and customer loyalty programs.",
    visible: true,
    icon: "vending",
    benefits: [
      "Increase customer engagement", 
      "Drive repeat business", 
      "Build brand loyalty"
    ],
    features: []
  },
  {
    id: "data",
    slug: "data",
    title: "Data & Analytics",
    description: "Leverage powerful insights to optimize your inventory, pricing, and machine placement.",
    visible: true,
    icon: "vending",
    benefits: [
      "Make data-driven decisions", 
      "Optimize inventory management", 
      "Increase operational efficiency"
    ],
    features: []
  },
  {
    id: "fleet-management",
    slug: "fleet-management",
    title: "Fleet Management",
    description: "Efficiently manage your entire network of machines with centralized controls and monitoring.",
    visible: true,
    icon: "vending",
    benefits: [
      "Reduce downtime", 
      "Streamline operations", 
      "Monitor machine health remotely"
    ],
    features: []
  },
  {
    id: "customer-satisfaction",
    slug: "customer-satisfaction",
    title: "Customer Satisfaction",
    description: "Enhance user experience with intuitive interfaces, reliable service, and modern payment options.",
    visible: true,
    icon: "vending",
    benefits: [
      "Improve customer loyalty", 
      "Increase customer retention", 
      "Build positive brand reputation"
    ],
    features: []
  }
];

/**
 * Helper function to create translatable fallback page content
 */
export const createTranslatableFallbackPageContent = () => ({
  // Hero section fields
  heroTitle: "Business Goals",
  heroDescription: "Transform your business operations with innovative vending solutions designed to meet your specific objectives.",
  heroImage: undefined,
  heroPrimaryButtonText: "Request a Demo",
  heroPrimaryButtonUrl: "/contact",
  heroSecondaryButtonText: "Explore Goals",
  heroSecondaryButtonUrl: "#goals-section",
  
  // Original content fields
  introTitle: "Business Goals",
  introDescription: "Transform your business operations with innovative vending solutions designed to meet your specific objectives. Our technology enables you to expand your footprint, improve customer experiences, and drive revenue growth.",
  goalsSectionTitle: "Business Goals We Help You Achieve",
  goalsSectionDescription: "Explore how our vending solutions can help you reach your business objectives.",
  keyBenefitsTitle: "Key Benefits",
  keyBenefitsDescription: "Our solutions provide tangible benefits that drive business growth and improve operational efficiency.",
  keyBenefits: [
    "Increase revenue through expanded footprint",
    "Improve customer satisfaction with modern interfaces",
    "Gain valuable insights through comprehensive data analytics",
    "Reduce operational costs with efficient fleet management",
    "Enable new business models like BOPIS",
    "Drive customer engagement through targeted promotions"
  ],
  customSolutionTitle: "Need a Custom Solution?",
  customSolutionDescription: "Our team can help design a tailored solution to address your specific business requirements.",
  customSolutionButtonText: "Contact Us",
  customSolutionButtonUrl: "/contact",
  inquiryBulletPoints: [
    "Discuss your specific business goals",
    "Explore customized vending solutions",
    "Learn about integration options",
    "Get pricing information"
  ]
});