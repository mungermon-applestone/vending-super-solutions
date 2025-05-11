
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';
import { useParams } from 'react-router-dom';

const DiviSP = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '7',
    slug: 'divi-sp',
    title: "DIVI-SP",
    type: 'vending' as const,
    temperature: "ambient",
    description: "Space-saving profile vending machine with flexible configuration options designed for medium-capacity locations with limited floor space.",
    images: [
      { url: "https://images.unsplash.com/photo-1621964275191-ccc01ef2134c", alt: "DIVI-SP - Front View" },
      { url: "https://images.unsplash.com/photo-1626282874430-c11ae32d2898", alt: "DIVI-SP - Side View" }
    ],
    specs: {
      dimensions: "68\"H x 30\"W x 28\"D",
      weight: "450 lbs (empty)",
      capacity: "Up to 250 items depending on configuration",
      powerRequirements: "110V, 4 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash (optional), NFC",
      screen: "15\" Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$7,000 - $11,000 (purchase) or leasing options available"
    },
    features: [
      "Compact footprint design",
      "Configurable product deployment system",
      "Multiple dispensing mechanism options",
      "Remote monitoring and diagnostics",
      "Custom branding options",
      "Adjustable shelving for different product sizes",
      "Energy-efficient LED lighting",
      "High-security locking system"
    ],
    deploymentExamples: [
      {
        title: "University Dormitory",
        description: "Providing essentials to students in residence hall common areas",
        image: { url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", alt: "University dormitory deployment" }
      },
      {
        title: "Boutique Hotel",
        description: "Compact vending solution for smaller hotel properties",
        image: { url: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa", alt: "Boutique hotel deployment" }
      },
      {
        title: "Corporate Break Room",
        description: "Space-efficient refreshment solution for smaller employee areas",
        image: { url: "https://images.unsplash.com/photo-1517502884422-41eaead166d4", alt: "Corporate break room deployment" }
      }
    ]
  };

  // Fetch machine data from the database
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('vending', 'divi-sp');

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default DiviSP;
