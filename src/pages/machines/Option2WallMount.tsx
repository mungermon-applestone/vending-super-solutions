
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const Option2WallMount = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '3',
    slug: 'option-2-wall-mount',
    title: "Option-2, Wall Mount",
    type: 'vending' as const,
    temperature: "ambient",
    description: "Space-efficient wall-mounted vending machine for standard applications where floor space is limited. Perfect for hallways, waiting areas, and other tight spaces.",
    images: [
      { url: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394", alt: "Option-2 Wall Mount - Front View" },
      { url: "https://images.unsplash.com/photo-1627395637580-988089c61818", alt: "Option-2 Wall Mount - Side View" }
    ],
    specs: {
      dimensions: "48\"H x 36\"W x 18\"D",
      weight: "350 lbs (empty)",
      capacity: "Up to 180 items depending on configuration",
      powerRequirements: "110V, 3 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash (optional)",
      screen: "10\" Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$5,500 - $8,500 (purchase) or leasing options available"
    },
    features: [
      "Compact wall-mounted design",
      "Saves valuable floor space",
      "Remote monitoring and diagnostics",
      "Custom branding options",
      "Adjustable shelving for different product sizes",
      "Energy-efficient LED lighting",
      "High-security locking system"
    ],
    deploymentExamples: [
      {
        title: "Hotel Hallway",
        description: "Providing guest conveniences without taking up valuable floor space",
        image: { url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e", alt: "Hotel hallway deployment" }
      },
      {
        title: "Office Break Room",
        description: "Mounted in smaller break areas where floor space is at a premium",
        image: { url: "https://images.unsplash.com/photo-1497215842964-222b430dc094", alt: "Office break room deployment" }
      }
    ]
  };

  // Fetch machine data from the database
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('vending', 'option-2-wall-mount');

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default Option2WallMount;
