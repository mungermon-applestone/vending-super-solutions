
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const Option4Refrigerated = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '1',
    slug: 'option-4-refrigerated',
    title: "Option-4 - Refrigerated",
    type: 'vending' as const,
    temperature: "refrigerated",
    description: "Full-size refrigerated vending machine with multiple temperature zones, perfect for selling fresh food, beverages, and perishable items with extended shelf life.",
    images: [
      { url: "https://images.unsplash.com/photo-1597393353415-b3730f3719fe", alt: "Option-4 Refrigerated - Front View" },
      { url: "https://images.unsplash.com/photo-1623039405147-547794f92e9e", alt: "Option-4 Refrigerated - Side View" },
      { url: "https://images.unsplash.com/photo-1627843240167-b1f9440fc173", alt: "Option-4 Refrigerated - Interior" }
    ],
    specs: {
      dimensions: "72\"H x 41\"W x 38\"D",
      weight: "720 lbs (empty)",
      capacity: "Up to 400 items depending on configuration",
      powerRequirements: "110V, 8 amps",
      temperature: "34°F to 40°F, adjustable by zone",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash (optional), loyalty integration",
      screen: "15\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$9,500 - $14,000 (purchase) or leasing options available"
    },
    features: [
      "Multiple temperature zones for different product types",
      "Energy-efficient cooling system",
      "Real-time temperature monitoring and alerts",
      "Remote monitoring and diagnostics",
      "Custom branding options",
      "Adjustable shelving for different product sizes",
      "Energy-efficient LED lighting",
      "High-security locking system"
    ],
    deploymentExamples: [
      {
        title: "Corporate Office",
        description: "Deployed in Fortune 500 headquarters providing fresh meals and beverages to employees",
        image: { url: "https://images.unsplash.com/photo-1577412647305-991150c7d163", alt: "Corporate office deployment" }
      },
      {
        title: "Healthcare Facility",
        description: "24/7 access to fresh food and beverages for healthcare workers and visitors",
        image: { url: "https://images.unsplash.com/photo-1504439468489-c8920d796a29", alt: "Healthcare facility deployment" }
      },
      {
        title: "University Campus",
        description: "Providing healthy food options to students across campus buildings",
        image: { url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", alt: "University campus deployment" }
      }
    ]
  };

  // Fetch machine data from the database
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('vending', 'option-4-refrigerated');

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default Option4Refrigerated;
