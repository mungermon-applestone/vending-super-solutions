
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const DiviWP = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '5',
    slug: 'divi-wp',
    title: "DIVI-WP",
    type: 'vending' as const,
    temperature: "ambient",
    description: "Weather-protected vending system for outdoor installations with sealed compartments and climate resistance. Perfect for parks, transit stations, and other exposed locations.",
    images: [
      { url: "https://images.unsplash.com/photo-1557034362-4ec717153f8f", alt: "DIVI-WP - Front View" },
      { url: "https://images.unsplash.com/photo-1542653389-9c252b378429", alt: "DIVI-WP - Outdoor Installation" }
    ],
    specs: {
      dimensions: "76\"H x 42\"W x 36\"D",
      weight: "750 lbs (empty)",
      capacity: "Up to 350 items depending on configuration",
      powerRequirements: "110V, 8 amps",
      temperature: "Operating range: -10°F to 110°F with internal climate control",
      connectivity: "WiFi, Ethernet, Cellular (included)",
      paymentOptions: "Credit card, mobile payment, NFC",
      screen: "15\" Sunlight-readable Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$12,000 - $18,000 (purchase) or leasing options available"
    },
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
    deploymentExamples: [
      {
        title: "Public Park",
        description: "Providing refreshments and essentials in outdoor recreational areas",
        image: { url: "https://images.unsplash.com/photo-1533124436425-a9c6a41dfbe5", alt: "Public park deployment" }
      },
      {
        title: "Transit Station",
        description: "All-weather vending solution for bus stops and train platforms",
        image: { url: "https://images.unsplash.com/photo-1568438350562-2cae6d394ad0", alt: "Transit station deployment" }
      },
      {
        title: "Sports Complex",
        description: "Outdoor refreshment stations for sports fields and stadium exteriors",
        image: { url: "https://images.unsplash.com/photo-1470232146202-5b10f5cdf9c5", alt: "Sports complex deployment" }
      }
    ]
  };

  // Fetch machine data from the database using the updated hook signature
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('divi-wp');

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default DiviWP;
