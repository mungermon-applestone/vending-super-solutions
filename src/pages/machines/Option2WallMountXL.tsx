
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const Option2WallMountXL = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '2',
    slug: 'option-2-wall-mount-xl',
    title: "Option-2, Wall Mount XL",
    type: 'vending' as const,
    temperature: "ambient",
    description: "Extra large wall-mounted vending solution for high capacity needs. This space-saving design attaches directly to walls while offering significant product capacity.",
    images: [
      { url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2", alt: "Option-2 Wall Mount XL - Front View" },
      { url: "https://images.unsplash.com/photo-1623039405147-547794f92e9e", alt: "Option-2 Wall Mount XL - Side View" }
    ],
    specs: {
      dimensions: "60\"H x 42\"W x 24\"D",
      weight: "450 lbs (empty)",
      capacity: "Up to 300 items depending on configuration",
      powerRequirements: "110V, 5 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash (optional), loyalty integration",
      screen: "15\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$7,500 - $11,000 (purchase) or leasing options available"
    },
    features: [
      "Wall-mounted design saves floor space",
      "Extra large capacity for high-volume locations",
      "Remote monitoring and diagnostics",
      "Custom branding options",
      "Modular shelving for different product sizes",
      "Energy-efficient LED lighting",
      "High-security locking system",
      "ADA compliant interface options"
    ],
    deploymentExamples: [
      {
        title: "Airport Terminal",
        description: "Deployed in high-traffic airport terminals providing convenience items to travelers",
        image: { url: "https://images.unsplash.com/photo-1468436385273-8abca6dfd8d3", alt: "Airport terminal deployment" }
      },
      {
        title: "Hotel Hallway",
        description: "Installed in hotel corridors providing 24/7 access to sundries and snacks",
        image: { url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e", alt: "Hotel hallway deployment" }
      },
      {
        title: "Office Building",
        description: "Space-efficient solution for corporate buildings with limited floor space",
        image: { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174", alt: "Office building deployment" }
      }
    ]
  };

  // Fetch machine data from the database using the updated hook signature
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('option-2-wall-mount-xl');

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default Option2WallMountXL;
