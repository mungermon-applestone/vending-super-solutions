
// This file contains the machine data for migration
import { MachinePlaceholder } from './types';

// Sample machine data for migration
export const machinePlaceholderData: MachinePlaceholder[] = [
  // Refrigerated vending machine
  {
    id: '1',
    slug: 'option-4-refrigerated',
    title: "Option 4 Refrigerated",
    type: "vending",
    temperature: "refrigerated",
    description: "The Option 4 Refrigerated is our premium refrigerated vending solution, offering advanced temperature control for fresh food and beverages with real-time inventory management.",
    images: [
      { url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2", alt: "Option 4 Refrigerated Machine - Front View" },
      { url: "https://images.unsplash.com/photo-1623039405147-547794f92e9e", alt: "Option 4 Refrigerated - Side View" },
      { url: "https://images.unsplash.com/photo-1627843240167-b1f9440fc173", alt: "Option 4 Refrigerated - Interior" }
    ],
    specs: {
      dimensions: "72\"H x 39\"W x 36\"D",
      weight: "750 lbs (empty)",
      capacity: "Up to 400 items depending on configuration",
      powerRequirements: "120V, 10 amps",
      temperature: "Refrigerated (34°F - 41°F)",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash, loyalty integration",
      screen: "32\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$12,000 - $16,000 (purchase) or leasing options available"
    },
    features: [
      "Temperature monitoring and control system",
      "Insulated glass door with energy-efficient LED lighting",
      "Multi-zone temperature capability",
      "Health shutoff safety feature",
      "Interactive touchscreen interface",
      "Contactless payment options",
      "Cloud-based inventory management",
      "Anti-theft design",
      "Energy-saving mode during low traffic periods"
    ],
    deploymentExamples: [
      {
        title: "Hospital Cafeteria",
        description: "24/7 fresh food and beverage access for healthcare staff and visitors",
        image: { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d", alt: "Hospital cafeteria deployment" }
      },
      {
        title: "Corporate Office",
        description: "Fresh meal options for employees in office buildings",
        image: { url: "https://images.unsplash.com/photo-1577412647305-991150c7d163", alt: "Corporate office deployment" }
      },
      {
        title: "University Campus",
        description: "Healthy food options available around the clock for students",
        image: { url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", alt: "University campus deployment" }
      }
    ]
  },
  // Option 2 Wall Mount XL
  {
    id: '2',
    slug: 'option-2-wall-mount-xl',
    title: "Option 2 Wall Mount XL",
    type: "vending",
    temperature: "ambient",
    description: "The Option 2 Wall Mount XL is our space-saving wall-mounted vending solution with expanded capacity, perfect for locations with limited floor space but high demand.",
    images: [
      { url: "https://images.unsplash.com/photo-1586880244406-556ebe35f282", alt: "Option 2 Wall Mount XL - Front View" },
      { url: "https://images.unsplash.com/photo-1586880244548-5710b6eff44b", alt: "Option 2 Wall Mount XL - Side View" },
      { url: "https://images.unsplash.com/photo-1586880244439-ada9259e2766", alt: "Option 2 Wall Mount XL - Installation" }
    ],
    specs: {
      dimensions: "72\"H x 41\"W x 12\"D",
      weight: "350 lbs (empty)",
      capacity: "Up to 200 items depending on configuration",
      powerRequirements: "110V, 3 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet",
      paymentOptions: "Credit card, mobile payment, employee badge integration",
      screen: "15\" Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$7,500 - $9,500 (purchase) or leasing options available"
    },
    features: [
      "Space-saving wall-mounted design",
      "Expandable modular configuration",
      "Customizable planogram layout",
      "Remote inventory monitoring",
      "Advanced security features",
      "Custom branding options",
      "Energy-efficient LED lighting",
      "Silent vending operation",
      "ADA compliant installation option"
    ],
    deploymentExamples: [
      {
        title: "Hotel Corridors",
        description: "Convenient access to snacks and necessities for hotel guests",
        image: { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945", alt: "Hotel corridor deployment" }
      },
      {
        title: "Office Breakroom",
        description: "Compact refreshment solution for office spaces",
        image: { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2", alt: "Office breakroom deployment" }
      },
      {
        title: "Fitness Center",
        description: "Healthy snacks and drinks for gym members",
        image: { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48", alt: "Fitness center deployment" }
      }
    ]
  },
  // Option 2 Wall Mount
  {
    id: '3',
    slug: 'option-2-wall-mount',
    title: "Option 2 Wall Mount",
    type: "vending",
    temperature: "ambient",
    description: "The Option 2 Wall Mount is our compact, space-efficient vending solution designed to be mounted on walls, perfect for locations with limited floor space.",
    images: [
      { url: "https://images.unsplash.com/photo-1586880244406-556ebe35f282", alt: "Option 2 Wall Mount - Front View" },
      { url: "https://images.unsplash.com/photo-1586880244548-5710b6eff44b", alt: "Option 2 Wall Mount - Side View" },
      { url: "https://images.unsplash.com/photo-1586880244439-ada9259e2766", alt: "Option 2 Wall Mount - Installation" }
    ],
    specs: {
      dimensions: "48\"H x 35\"W x 12\"D",
      weight: "250 lbs (empty)",
      capacity: "Up to 120 items depending on configuration",
      powerRequirements: "110V, 2 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi",
      paymentOptions: "Credit card, mobile payment",
      screen: "10\" Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$5,500 - $7,000 (purchase) or leasing options available"
    },
    features: [
      "Compact wall-mounted design",
      "No floor space required",
      "Lightweight construction",
      "Easy installation",
      "Remote monitoring capabilities",
      "Custom branding options",
      "Energy-efficient operation",
      "Flexible product configuration",
      "Low maintenance requirements"
    ],
    deploymentExamples: [
      {
        title: "Small Office",
        description: "Space-efficient refreshment solution for small businesses",
        image: { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", alt: "Small office deployment" }
      },
      {
        title: "Apartment Building",
        description: "Convenient access to snacks and necessities for residents",
        image: { url: "https://images.unsplash.com/photo-1460317442991-0ec209397118", alt: "Apartment building deployment" }
      },
      {
        title: "Student Lounge",
        description: "Compact refreshment solution for educational facilities",
        image: { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1", alt: "Student lounge deployment" }
      }
    ]
  },
  // Divi SS
  {
    id: '4',
    slug: 'divi-ss',
    title: "Divi SS",
    type: "vending",
    temperature: "ambient",
    description: "The Divi SS (Smart Snack) is our intelligent snack vending solution with a sleek stainless steel finish, offering premium aesthetics and advanced features.",
    images: [
      { url: "https://images.unsplash.com/photo-1598302936625-6075fbd98313", alt: "Divi SS - Front View" },
      { url: "https://images.unsplash.com/photo-1598303080030-232923827c7d", alt: "Divi SS - Side View" },
      { url: "https://images.unsplash.com/photo-1598302936843-11c3c4e5db8c", alt: "Divi SS - Detail" }
    ],
    specs: {
      dimensions: "72\"H x 41\"W x 36\"D",
      weight: "675 lbs (empty)",
      capacity: "Up to 450 items depending on configuration",
      powerRequirements: "120V, 5 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet, Bluetooth",
      paymentOptions: "Credit card, mobile payment, cash, custom payment integration",
      screen: "21.5\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$9,000 - $12,500 (purchase) or leasing options available"
    },
    features: [
      "Premium stainless steel finish",
      "Advanced product recognition technology",
      "Flexible shelf configuration",
      "Real-time inventory tracking",
      "Remote temperature monitoring",
      "Custom UI and branding options",
      "Energy-saving LED lighting",
      "Intelligent product recommendation system",
      "Analytics dashboard for sales and inventory"
    ],
    deploymentExamples: [
      {
        title: "Luxury Hotel Lobby",
        description: "Upscale refreshment options for hotel guests",
        image: { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945", alt: "Luxury hotel deployment" }
      },
      {
        title: "Corporate Headquarters",
        description: "Premium snack options for executive areas",
        image: { url: "https://images.unsplash.com/photo-1577412647305-991150c7d163", alt: "Corporate headquarters deployment" }
      },
      {
        title: "High-End Retail",
        description: "Designer refreshment experience for shoppers",
        image: { url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a", alt: "Retail deployment" }
      }
    ]
  },
  // Temperature Controlled Locker
  {
    id: '5',
    slug: 'locker-10-cell-temperature-controlled',
    title: "10-Cell Temperature Controlled Locker",
    type: "locker",
    temperature: "controlled",
    description: "Our 10-Cell Temperature Controlled Locker offers versatile storage with individually controlled temperature cells, perfect for food pickup, pharmaceuticals, or temperature-sensitive retail.",
    images: [
      { url: "https://images.unsplash.com/photo-1618090584176-7132b9911544", alt: "10-Cell Temperature Controlled Locker - Front View" },
      { url: "https://images.unsplash.com/photo-1618090584286-5d71b98c0071", alt: "10-Cell Temperature Controlled Locker - Open Cell" },
      { url: "https://images.unsplash.com/photo-1618090584240-9d109f0a1341", alt: "10-Cell Temperature Controlled Locker - Control Panel" }
    ],
    specs: {
      dimensions: "72\"H x 60\"W x 36\"D",
      weight: "850 lbs (empty)",
      capacity: "10 compartments with adjustable shelving",
      powerRequirements: "220V, 15 amps",
      temperature: "Adjustable per cell (33°F - 150°F)",
      connectivity: "WiFi, Ethernet, Cellular backup",
      paymentOptions: "Mobile app integration, QR code, PIN access",
      screen: "15\" Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$15,000 - $22,000 (purchase) or leasing options available"
    },
    features: [
      "Individual temperature control per cell",
      "Modular expansion capability",
      "Contactless pickup and delivery",
      "SMS and email notifications",
      "Integrated security camera",
      "Climate control monitoring and alerts",
      "Remote management through cloud platform",
      "Multiple access authentication options",
      "Integration with third-party delivery services"
    ],
    deploymentExamples: [
      {
        title: "Restaurant Takeout",
        description: "Secure temperature-maintained food pickup solution",
        image: { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", alt: "Restaurant deployment" }
      },
      {
        title: "Pharmacy Pickup",
        description: "Temperature-controlled medication pickup for pharmacies",
        image: { url: "https://images.unsplash.com/photo-1583792678495-b97b260fe41d", alt: "Pharmacy deployment" }
      },
      {
        title: "Grocery Order Pickup",
        description: "Mixed temperature zones for various grocery items",
        image: { url: "https://images.unsplash.com/photo-1542838132-92c53300491e", alt: "Grocery store deployment" }
      }
    ]
  },
  // DIVI-WP
  {
    id: '6',
    slug: 'divi-wp',
    title: "DIVI-WP",
    type: "vending",
    temperature: "ambient",
    description: "Weather-protected vending system for outdoor installations.",
    images: [
      { url: "https://images.unsplash.com/photo-1557034362-4ec717153f8f", alt: "DIVI-WP" }
    ],
    specs: {
      dimensions: "72\"H x 45\"W x 36\"D",
      weight: "680 lbs (empty)",
      capacity: "Up to 350 items depending on configuration",
      powerRequirements: "120V, 6 amps",
      temperature: "Ambient with weather protection",
      connectivity: "WiFi, Cellular",
      paymentOptions: "Credit card, mobile payment, cash",
      screen: "15\" Weatherproof Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$10,500 - $14,000 (purchase) or leasing options available"
    },
    features: [
      "Weather-resistant housing",
      "Anti-vandalism reinforcement",
      "Temperature-regulated interior",
      "Solar power option available",
      "Remote monitoring system",
      "High-visibility LED lighting",
      "Rust-proof components",
      "All-season operation capability",
      "External digital advertising display option"
    ],
    deploymentExamples: [
      {
        title: "Public Park",
        description: "All-weather refreshment access for park visitors",
        image: { url: "https://images.unsplash.com/photo-1500964757637-c85e8a162699", alt: "Park deployment" }
      },
      {
        title: "Transit Station",
        description: "Convenient refreshments for commuters in all weather conditions",
        image: { url: "https://images.unsplash.com/photo-1529179307417-ca83d482a186", alt: "Transit station deployment" }
      },
      {
        title: "Beach Promenade",
        description: "Seaside refreshments resistant to salt air and sun exposure",
        image: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", alt: "Beach deployment" }
      }
    ]
  },
  // DIVI-WS
  {
    id: '7',
    slug: 'divi-ws',
    title: "DIVI-WS",
    type: "vending",
    temperature: "ambient",
    description: "Wall-mounted slim profile vending machine for tight spaces.",
    images: [
      { url: "https://images.unsplash.com/photo-1627395637580-988089c61818", alt: "DIVI-WS" }
    ],
    specs: {
      dimensions: "60\"H x 30\"W x 10\"D",
      weight: "280 lbs (empty)",
      capacity: "Up to 150 items depending on configuration",
      powerRequirements: "110V, 2 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi",
      paymentOptions: "Credit card, mobile payment",
      screen: "10\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$6,000 - $8,500 (purchase) or leasing options available"
    },
    features: [
      "Ultra-slim wall-mounted profile",
      "Tool-less product loading",
      "Flexible planogram configuration",
      "Energy-efficient operation",
      "Whisper-quiet dispensing mechanism",
      "Customizable front panel design",
      "Low power consumption mode",
      "Simple installation requirements",
      "Remote inventory management"
    ],
    deploymentExamples: [
      {
        title: "Hospital Hallways",
        description: "Space-efficient refreshments in medical facilities",
        image: { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d", alt: "Hospital hallway deployment" }
      },
      {
        title: "Office Kitchen",
        description: "Compact snack options in corporate environments",
        image: { url: "https://images.unsplash.com/photo-1577412647305-991150c7d163", alt: "Office kitchen deployment" }
      },
      {
        title: "Hotel Room Floors",
        description: "Convenient guest access without dedicated vending rooms",
        image: { url: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4", alt: "Hotel hallway deployment" }
      }
    ]
  },
  // DIVI-SP
  {
    id: '8',
    slug: 'divi-sp',
    title: "DIVI-SP",
    type: "vending",
    temperature: "ambient",
    description: "Space-saving profile vending machine with flexible configuration options.",
    images: [
      { url: "https://images.unsplash.com/photo-1621964275191-ccc01ef2134c", alt: "DIVI-SP" }
    ],
    specs: {
      dimensions: "68\"H x 28\"W x 30\"D",
      weight: "450 lbs (empty)",
      capacity: "Up to 250 items depending on configuration",
      powerRequirements: "110V, 3 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet",
      paymentOptions: "Credit card, mobile payment, employee badge",
      screen: "12\" Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$7,800 - $10,200 (purchase) or leasing options available"
    },
    features: [
      "Compact footprint design",
      "Modular shelf configuration",
      "Digital product display",
      "Advanced anti-jam system",
      "Cloud-based inventory tracking",
      "Programmable promotional pricing",
      "Multi-payment options",
      "Energy-efficient cooling",
      "Remote diagnostics"
    ],
    deploymentExamples: [
      {
        title: "Small Retail",
        description: "Space-efficient retail automation solution",
        image: { url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a", alt: "Small retail deployment" }
      },
      {
        title: "School Cafeteria",
        description: "Compact refreshment options for educational facilities",
        image: { url: "https://images.unsplash.com/photo-1562564055-71e051d33c19", alt: "School cafeteria deployment" }
      },
      {
        title: "Apartment Complex",
        description: "Resident convenience center in multi-unit housing",
        image: { url: "https://images.unsplash.com/photo-1460317442991-0ec209397118", alt: "Apartment complex deployment" }
      }
    ]
  },
  // Combi 3000
  {
    id: '9',
    slug: 'combi-3000',
    title: "Combi 3000",
    type: "vending",
    temperature: "multi",
    description: "Combination vending system with multiple product categories.",
    images: [
      { url: "https://images.unsplash.com/photo-1527256351016-8ad33ff833fc", alt: "Combi 3000" }
    ],
    specs: {
      dimensions: "72\"H x 41\"W x 38\"D",
      weight: "800 lbs (empty)",
      capacity: "Up to 500 items with mixed temperature zones",
      powerRequirements: "120V, 12 amps",
      temperature: "Multi-zone (refrigerated, frozen, and ambient)",
      connectivity: "WiFi, Ethernet, Cellular backup",
      paymentOptions: "Credit card, mobile payment, cash, loyalty programs",
      screen: "21.5\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$14,500 - $18,000 (purchase) or leasing options available"
    },
    features: [
      "Multiple temperature zones",
      "Dual delivery system",
      "Category management software",
      "Smart energy management",
      "Elevator delivery system",
      "Contactless interface option",
      "Intelligent restocking alerts",
      "Flexible planogram design",
      "Integrated marketing display system"
    ],
    deploymentExamples: [
      {
        title: "Corporate Campus",
        description: "Complete food and beverage solution for large offices",
        image: { url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72", alt: "Corporate campus deployment" }
      },
      {
        title: "Healthcare Facility",
        description: "24/7 food and essential items for healthcare workers and visitors",
        image: { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d", alt: "Healthcare facility deployment" }
      },
      {
        title: "Transportation Hub",
        description: "Diverse refreshment options for travelers",
        image: { url: "https://images.unsplash.com/photo-1597492892964-4391c5a76204", alt: "Transportation hub deployment" }
      }
    ]
  },
  // 21-cell Temperature Controlled Locker
  {
    id: '10',
    slug: '21-cell-temperature-controlled',
    title: "21-cell temperature controlled locker",
    type: "locker",
    temperature: "controlled",
    description: "Large capacity temperature-controlled locker system with 21 compartments.",
    images: [
      { url: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f", alt: "21-cell Temperature Controlled Locker" }
    ],
    specs: {
      dimensions: "78\"H x 72\"W x 36\"D",
      weight: "950 lbs (empty)",
      capacity: "21 compartments with adjustable temperatures",
      powerRequirements: "220V, 18 amps",
      temperature: "Adjustable per cell (33°F - 150°F)",
      connectivity: "WiFi, Ethernet, Cellular backup",
      paymentOptions: "Mobile app integration, QR code, PIN access, RFID",
      screen: "15\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$18,000 - $25,000 (purchase) or leasing options available"
    },
    features: [
      "Independent temperature control per cell",
      "Variable cell sizes configuration",
      "Advanced access control system",
      "Real-time temperature monitoring",
      "Automated alerts and notifications",
      "Multi-user management platform",
      "Delivery service integration",
      "Touchless operation option",
      "Emergency power backup system"
    ],
    deploymentExamples: [
      {
        title: "Large Restaurant Chain",
        description: "High-volume food pickup system for takeout orders",
        image: { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", alt: "Restaurant chain deployment" }
      },
      {
        title: "University Campus",
        description: "Centralized food delivery system for students",
        image: { url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", alt: "University campus deployment" }
      },
      {
        title: "Grocery Store",
        description: "Click-and-collect service with temperature-controlled storage",
        image: { url: "https://images.unsplash.com/photo-1534723452862-4c874018d66d", alt: "Grocery store deployment" }
      }
    ]
  }
];
