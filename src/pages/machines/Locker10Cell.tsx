
import React from 'react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';
import { useMachineBySlug } from '@/hooks/useMachinesData';
import { adaptMachineData } from './MachineAdapter';

const Locker10Cell = () => {
  // Default fallback data
  const fallbackMachineData = {
    id: '9',
    slug: '10-cell-temperature-controlled',
    title: "10-cell temperature controlled locker",
    type: 'locker' as const,
    temperature: "controlled",
    description: "Compact temperature-controlled locker system with 10 individual compartments ideal for food delivery, pharmacy pickup, and other temperature-sensitive items.",
    images: [
      { url: "https://images.unsplash.com/photo-1604754742629-3e5728249d73", alt: "10-cell Temperature Controlled Locker - Front View" },
      { url: "https://images.unsplash.com/photo-1617474019494-585d69168617", alt: "10-cell Temperature Controlled Locker - In Use" }
    ],
    specs: {
      dimensions: "72\"H x 30\"W x 24\"D",
      weight: "450 lbs (empty)",
      capacity: "10 individually controlled compartments",
      powerRequirements: "110V, 8 amps",
      temperature: "Adjustable from 0°F to 70°F per compartment",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Mobile app integration, PIN code access, RFID",
      screen: "15\" Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$12,000 - $16,000 (purchase) or leasing options available"
    },
    features: [
      "Independent temperature control per compartment",
      "Secure pickup with unique access codes",
      "Real-time temperature monitoring with alerts",
      "Mobile app integration for customer pickup",
      "Delivery service integrations",
      "Customizable compartment sizes",
      "Energy-efficient cooling system",
      "ADA compliant interface"
    ],
    deploymentExamples: [
      {
        title: "Pharmacy",
        description: "Secure temperature-controlled medication pickup for patients",
        image: { url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de", alt: "Pharmacy deployment" }
      },
      {
        title: "Restaurant",
        description: "Food delivery and pickup solution maintaining proper food temperatures",
        image: { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", alt: "Restaurant deployment" }
      },
      {
        title: "Grocery Store",
        description: "Order pickup solution for temperature-sensitive items",
        image: { url: "https://images.unsplash.com/photo-1542838132-92c53300491e", alt: "Grocery store deployment" }
      }
    ]
  };

  // Fetch machine data from the database
  const { data: dbMachineData, isLoading, error } = useMachineBySlug('locker', '10-cell-temperature-controlled');

  // Use database data if available, otherwise fall back to static data
  const rawMachineData = dbMachineData || fallbackMachineData;
  
  // Convert the machine data to the proper CMSMachine format
  const machineData = adaptMachineData(rawMachineData);

  return <MachinePageTemplate machine={machineData} />;
};

export default Locker10Cell;
