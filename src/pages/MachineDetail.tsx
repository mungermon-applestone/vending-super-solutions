
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { getMachineBySlug } from '@/services/cms';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from '@/components/machineDetail/MachineDetailHero';
import MachineDetailSpecifications from '@/components/machineDetail/MachineDetailSpecifications';
import MachineDetailFeatures from '@/components/machineDetail/MachineDetailFeatures';
import MachineDetailDeployments from '@/components/machineDetail/MachineDetailDeployments';
import MachineDetailGallery from '@/components/machineDetail/MachineDetailGallery';
import MachineDetailInquiry from '@/components/machineDetail/MachineDetailInquiry';

const MachineDetail = () => {
  const { machineId, machineType } = useParams<{ machineType: string, machineId: string }>();

  const { data: machine, isLoading, error } = useQuery({
    queryKey: ['machine', machineType, machineId],
    queryFn: () => getMachineBySlug(machineType || '', machineId || ''),
    enabled: !!machineType && !!machineId,
  });

  // Default fallback data if no machine is found
  const machineData: CMSMachine = machine || {
    id: '1',
    slug: machineId || 'default',
    title: "Smart Vending Machine",
    type: (machineType || "vending") as "vending" | "locker", // Cast to the union type
    temperature: "ambient",
    description: "Advanced touchscreen vending solution for ambient products with real-time inventory tracking and multiple payment options.",
    images: [
      { id: "default-img-1", url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2", alt: "Smart Vending Machine - Front View" },
      { id: "default-img-2", url: "https://images.unsplash.com/photo-1623039405147-547794f92e9e", alt: "Smart Vending Machine - Side View" },
      { id: "default-img-3", url: "https://images.unsplash.com/photo-1627843240167-b1f9440fc173", alt: "Smart Vending Machine - Interior" }
    ],
    specs: {
      dimensions: "72\"H x 39\"W x 36\"D",
      weight: "650 lbs (empty)",
      capacity: "Up to 500 items depending on configuration",
      powerRequirements: "110V, 5 amps",
      temperature: "Ambient (room temperature)",
      connectivity: "WiFi, Ethernet, Cellular (optional)",
      paymentOptions: "Credit card, mobile payment, cash (optional), loyalty integration",
      screen: "32\" HD Touchscreen Display",
      manufacturer: "VendTech Solutions",
      priceRange: "$8,000 - $12,000 (purchase) or leasing options available"
    },
    features: [
      "Interactive touchscreen interface",
      "Multiple payment options including contactless",
      "Real-time inventory management",
      "Remote monitoring and diagnostics",
      "Custom branding options",
      "Modular design for flexible product configurations",
      "Energy-efficient LED lighting",
      "High-security locking system"
    ],
    deploymentExamples: [
      {
        title: "Corporate Office",
        description: "Deployed in Fortune 500 headquarters providing snacks and essentials to employees",
        image: { id: "deploy-1", url: "https://images.unsplash.com/photo-1577412647305-991150c7d163", alt: "Corporate office deployment" }
      },
      {
        title: "University Campus",
        description: "Network of machines across campus providing 24/7 access to convenience items for students",
        image: { id: "deploy-2", url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", alt: "University campus deployment" }
      },
      {
        title: "Transit Hub",
        description: "High-traffic location offering on-the-go refreshments and necessities to travelers",
        image: { id: "deploy-3", url: "https://images.unsplash.com/photo-1568438350562-2cae6d394ad0", alt: "Transit hub deployment" }
      }
    ]
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <div className="animate-pulse rounded-md bg-gray-200 h-8 w-1/4 mx-auto mb-4"></div>
          <div className="animate-pulse rounded-md bg-gray-200 h-4 w-1/2 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-24 text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error Loading Machine Details</h2>
          <p>Unable to load machine information. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MachineDetailHero machine={machineData} />
      <MachineDetailSpecifications specs={machineData.specs} />
      <MachineDetailFeatures features={machineData.features} />
      <MachineDetailDeployments deploymentExamples={machineData.deploymentExamples} />
      <MachineDetailGallery title={machineData.title} images={machineData.images} />
      <MachineDetailInquiry machineTitle={machineData.title} />
      <CTASection />
    </Layout>
  );
};

export default MachineDetail;
