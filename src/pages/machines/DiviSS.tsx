
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const DiviSS = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '4',
    slug: 'divi-ss',
    title: "DIVI-SS",
    type: 'vending' as const,
    temperature: "ambient",
    description: "Premium stainless steel vending solution with advanced touchscreen interface. The DIVI-SS is designed for upscale environments where aesthetics matter.",
    images: [
      { url: "https://images.unsplash.com/photo-1627998792088-f8016b438988", alt: "DIVI-SS - Front View" },
      { url: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55", alt: "DIVI-SS - Closeup of Interface" }
    ],
    thumbnail: {
      url: "https://images.unsplash.com/photo-1627998792088-f8016b438988", 
      alt: "DIVI-SS Thumbnail"
    },
    specs: {
      dimensions: "72\"H x 39\"W x 33\"D",
      weight: "600 lbs (empty)",
      capacity: "Up to 400 items depending on configuration",
      powerRequirements: "110V, 5 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash (optional), NFC",
      screen: "22\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$9,000 - $14,000 (purchase) or leasing options available"
    },
    features: [
      "Premium stainless steel finish",
      "High-resolution touchscreen interface",
      "Advanced product presentation capabilities",
      "Customizable digital signage options",
      "Remote monitoring and diagnostics",
      "Custom branding options",
      "Product showcase lighting",
      "High-security locking system"
    ],
    deploymentExamples: [
      {
        title: "Luxury Hotel Lobby",
        description: "Provides high-end retail items in upscale hotel environments",
        image: { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945", alt: "Luxury hotel deployment" }
      },
      {
        title: "Corporate Headquarters",
        description: "Premium vending solution for executive floors and visitor areas",
        image: { url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72", alt: "Corporate headquarters deployment" }
      },
      {
        title: "Upscale Retail Location",
        description: "Automated retail solution for high-end shopping centers",
        image: { url: "https://images.unsplash.com/photo-1555529771-7888783a18d3", alt: "Retail location deployment" }
      }
    ]
  };

  // Fetch machine data from the database
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('divi-ss');
  
  console.log('[DiviSS] Machine data from DB:', {
    isLoading,
    hasError: !!error,
    hasMachineData: !!dbMachineData,
    hasThumbnail: dbMachineData && !!dbMachineData.thumbnail
  });

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default DiviSS;
