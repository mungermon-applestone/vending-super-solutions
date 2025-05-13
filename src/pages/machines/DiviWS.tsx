
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const DiviWS = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '6',
    slug: 'divi-ws',
    title: "DIVI-WS",
    type: 'vending' as const,
    temperature: "ambient",
    description: "Wall-mounted slim profile vending machine for tight spaces with a focus on sleek design. Ideal for narrow corridors and small waiting areas.",
    images: [
      { url: "https://images.unsplash.com/photo-1627395637580-988089c61818", alt: "DIVI-WS - Front View" },
      { url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2", alt: "DIVI-WS - Side View" }
    ],
    specs: {
      dimensions: "60\"H x 32\"W x 15\"D",
      weight: "320 lbs (empty)",
      capacity: "Up to 150 items depending on configuration",
      powerRequirements: "110V, 3 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet",
      paymentOptions: "Credit card, mobile payment, NFC",
      screen: "12\" Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$6,500 - $9,500 (purchase) or leasing options available"
    },
    features: [
      "Ultra-slim wall-mounted design",
      "Only extends 15\" from wall",
      "Sleek, modern appearance",
      "Customizable facing options",
      "Remote monitoring and diagnostics",
      "Quiet operation for noise-sensitive environments",
      "Energy-efficient LED lighting",
      "ADA compliant interface"
    ],
    deploymentExamples: [
      {
        title: "Medical Office Hallway",
        description: "Providing refreshments in narrow medical facility corridors",
        image: { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d", alt: "Medical office deployment" }
      },
      {
        title: "Hotel Room Floors",
        description: "Slim profile solution for guest convenience without obstructing hallways",
        image: { url: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4", alt: "Hotel hallway deployment" }
      },
      {
        title: "Office Waiting Area",
        description: "Space-saving refreshment solution for compact reception areas",
        image: { url: "https://images.unsplash.com/photo-1549637642-90187f64f420", alt: "Office waiting area deployment" }
      }
    ]
  };

  // Fetch machine data from the database using the updated hook signature
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('divi-ws');

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default DiviWS;
