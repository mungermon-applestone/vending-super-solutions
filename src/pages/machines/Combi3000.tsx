
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const Combi3000 = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '8',
    slug: 'combi-3000',
    title: "Combi 3000",
    type: 'vending' as const,
    temperature: "multi",
    description: "Combination vending system with multiple product categories and temperature zones. The Combi 3000 can dispense refrigerated, frozen, and ambient products from a single machine.",
    images: [
      { url: "https://images.unsplash.com/photo-1527256351016-8ad33ff833fc", alt: "Combi 3000 - Front View" },
      { url: "https://images.unsplash.com/photo-1624453409772-e329a1a9f85c", alt: "Combi 3000 - Side View" },
      { url: "https://images.unsplash.com/photo-1627843240167-b1f9440fc173", alt: "Combi 3000 - Interior" }
    ],
    specs: {
      dimensions: "78\"H x 45\"W x 38\"D",
      weight: "820 lbs (empty)",
      capacity: "Up to 600 items depending on configuration",
      powerRequirements: "110V, 10 amps",
      temperature: "Multiple zones: Ambient, Refrigerated (34°F-40°F), Frozen (-10°F to 0°F)",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash, NFC, loyalty integration",
      screen: "27\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$14,000 - $20,000 (purchase) or leasing options available"
    },
    features: [
      "Multiple temperature zones in a single machine",
      "Dispense fresh, frozen, and ambient products",
      "Advanced product presentation capabilities",
      "Temperature monitoring and alert system",
      "Remote monitoring and diagnostics",
      "Custom branding options",
      "Modular design for flexible product mix",
      "Energy-efficient cooling and lighting systems",
      "High-security locking system with zone-specific access"
    ],
    deploymentExamples: [
      {
        title: "Corporate Headquarters",
        description: "All-in-one food and beverage solution for large office environments",
        image: { url: "https://images.unsplash.com/photo-1577412647305-991150c7d163", alt: "Corporate headquarters deployment" }
      },
      {
        title: "Hospital",
        description: "24/7 food service option offering varied menu for staff and visitors",
        image: { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d", alt: "Hospital deployment" }
      },
      {
        title: "College Student Center",
        description: "One-stop vending solution for campus with diverse product needs",
        image: { url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3", alt: "College student center deployment" }
      }
    ]
  };

  // Fetch machine data from the database using the updated hook signature
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('combi-3000');

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default Combi3000;
