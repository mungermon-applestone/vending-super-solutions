import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const Locker21Cell = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '10',
    slug: '21-cell-temperature-controlled',
    title: "21-cell temperature controlled locker",
    type: 'locker' as const,
    temperature: "controlled",
    description: "Large capacity temperature-controlled locker system with 21 individual compartments of varying sizes, perfect for high-volume delivery operations and retail pickup solutions.",
    images: [
      { url: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f", alt: "21-cell Temperature Controlled Locker - Front View" },
      { url: "https://images.unsplash.com/photo-1606836591695-4d58a73fba38", alt: "21-cell Temperature Controlled Locker - Side View" }
    ],
    specs: {
      dimensions: "78\"H x 72\"W x 30\"D",
      weight: "950 lbs (empty)",
      capacity: "21 individually controlled compartments in 3 size options",
      powerRequirements: "110V, 15 amps",
      temperature: "Adjustable from 0°F to 70°F with three temperature zones",
      connectivity: "WiFi, Ethernet, Cellular (included)",
      paymentOptions: "Mobile app integration, PIN code access, RFID, Barcode scanning",
      screen: "22\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$18,000 - $25,000 (purchase) or leasing options available"
    },
    features: [
      "High capacity with 21 separate compartments",
      "Three temperature zones (frozen, refrigerated, ambient)",
      "Multiple compartment sizes for different package types",
      "Secure pickup with unique access codes",
      "Real-time temperature monitoring with alerts",
      "Mobile app integration for customer pickup",
      "API integrations with delivery services and retailers",
      "Customizable branding options",
      "Advanced analytics and reporting",
      "Remote diagnostics and monitoring"
    ],
    deploymentExamples: [
      {
        title: "Grocery Chain",
        description: "High-volume order pickup solution for online grocery orders",
        image: { url: "https://images.unsplash.com/photo-1579113800032-c38bd7635818", alt: "Grocery chain deployment" }
      },
      {
        title: "Apartment Complex",
        description: "Centralized package and food delivery solution for residents",
        image: { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", alt: "Apartment complex deployment" }
      },
      {
        title: "University Campus",
        description: "Multi-purpose delivery system for campus food service and package delivery",
        image: { url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", alt: "University campus deployment" }
      },
      {
        title: "Hospital",
        description: "Secure medication and sample storage with controlled access",
        image: { url: "https://images.unsplash.com/photo-1516549655103-982afbfce8f5", alt: "Hospital deployment" }
      }
    ]
  };

  // Fetch machine data from the database
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('21-cell-temperature-controlled');

  // Use database data if available, otherwise fall back to static data
  const machineData = dbMachineData || fallbackMachineData;

  return <MachinePageTemplate machine={machineData} />;
};

export default Locker21Cell;
