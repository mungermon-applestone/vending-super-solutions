
import { supabase } from "@/integrations/supabase/client";

interface MachinePlaceholder {
  id: string;
  slug: string;
  title: string;
  type: "vending" | "locker";
  temperature: string;
  description: string;
  images: Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  specs: {
    dimensions?: string;
    weight?: string;
    capacity?: string;
    powerRequirements?: string;
    temperature?: string;
    connectivity?: string;
    paymentOptions?: string;
    screen?: string;
    manufacturer?: string;
    priceRange?: string;
    [key: string]: string | undefined;
  };
  features: string[];
  deploymentExamples: Array<{
    title: string;
    description: string;
    image: {
      url: string;
      alt: string;
    };
  }>;
}

// Sample machine data from the existing pages
const machinePlaceholderData: MachinePlaceholder[] = [
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
  }
];

// Function to migrate the placeholder data to the database
export const migrateMachinesData = async () => {
  try {
    console.log("Starting machine data migration...");
    let successCount = 0;
    
    for (const machineData of machinePlaceholderData) {
      console.log(`Processing machine: ${machineData.title}`);
      
      try {
        // Create the machine record
        const { data: machine, error: machineError } = await supabase
          .from('machines')
          .insert({
            title: machineData.title,
            slug: machineData.slug,
            type: machineData.type,
            temperature: machineData.temperature,
            description: machineData.description,
            visible: true
          })
          .select('id')
          .single();
        
        if (machineError) {
          console.error(`Error creating machine ${machineData.title}:`, machineError);
          continue;
        }
        
        console.log(`Created machine with ID: ${machine.id}`);
        
        // Add machine images
        if (machineData.images.length > 0) {
          const imageInserts = machineData.images.map((image, index) => ({
            machine_id: machine.id,
            url: image.url,
            alt: image.alt || machineData.title,
            width: image.width || 800,
            height: image.height || 600,
            display_order: index
          }));
          
          const { error: imageError } = await supabase
            .from('machine_images')
            .insert(imageInserts);
          
          if (imageError) {
            console.error(`Error adding images for machine ${machineData.title}:`, imageError);
          } else {
            console.log(`Added ${imageInserts.length} images for machine ${machineData.title}`);
          }
        }
        
        // Add machine specs
        if (machineData.specs) {
          const specInserts = Object.entries(machineData.specs)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => ({
              machine_id: machine.id,
              key,
              value
            }));
          
          const { error: specError } = await supabase
            .from('machine_specs')
            .insert(specInserts);
          
          if (specError) {
            console.error(`Error adding specs for machine ${machineData.title}:`, specError);
          } else {
            console.log(`Added ${specInserts.length} specs for machine ${machineData.title}`);
          }
        }
        
        // Add machine features
        if (machineData.features.length > 0) {
          const featureInserts = machineData.features.map((feature, index) => ({
            machine_id: machine.id,
            feature,
            display_order: index
          }));
          
          const { error: featureError } = await supabase
            .from('machine_features')
            .insert(featureInserts);
          
          if (featureError) {
            console.error(`Error adding features for machine ${machineData.title}:`, featureError);
          } else {
            console.log(`Added ${featureInserts.length} features for machine ${machineData.title}`);
          }
        }
        
        // Add deployment examples
        if (machineData.deploymentExamples.length > 0) {
          const exampleInserts = machineData.deploymentExamples.map((example, index) => ({
            machine_id: machine.id,
            title: example.title,
            description: example.description,
            image_url: example.image.url,
            image_alt: example.image.alt,
            display_order: index
          }));
          
          const { error: exampleError } = await supabase
            .from('deployment_examples')
            .insert(exampleInserts);
          
          if (exampleError) {
            console.error(`Error adding deployment examples for machine ${machineData.title}:`, exampleError);
          } else {
            console.log(`Added ${exampleInserts.length} deployment examples for machine ${machineData.title}`);
          }
        }
        
        // Increment success counter
        successCount++;
      } catch (machineError) {
        console.error(`Error processing machine ${machineData.title}:`, machineError);
        // Continue with next machine despite error
      }
    }
    
    console.log(`Machine data migration completed. ${successCount} out of ${machinePlaceholderData.length} machines imported successfully`);
    return { 
      success: true, 
      message: `Migration completed successfully. ${successCount} out of ${machinePlaceholderData.length} machines were imported.`,
      count: successCount
    };
  } catch (error) {
    console.error("Error during machine data migration:", error);
    return { success: false, message: "Migration failed", error };
  }
};
