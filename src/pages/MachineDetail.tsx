
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import CTASection from '@/components/common/CTASection';
import { Server, HardDrive, Ruler, Weight, Plug, ThermometerSnowflake, DollarSign } from 'lucide-react';
import Wifi from '@/components/ui/Wifi';
import { getMachineBySlug } from '@/services/cms';
import { CMSMachine } from '@/types/cms';

const MachineDetail = () => {
  const { machineId, machineType } = useParams<{ machineType: string, machineId: string }>();

  const { data: machine, isLoading, error } = useQuery({
    queryKey: ['machine', machineType, machineId],
    queryFn: () => getMachineBySlug(machineType || '', machineId || ''),
    enabled: !!machineType && !!machineId,
  });

  const machineData: CMSMachine = machine || {
    id: '1',
    slug: machineId || 'default',
    title: "Smart Vending Machine",
    type: (machineType || "vending") as "vending" | "locker", // Cast to the union type
    temperature: "ambient",
    description: "Advanced touchscreen vending solution for ambient products with real-time inventory tracking and multiple payment options.",
    images: [
      { url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2", alt: "Smart Vending Machine - Front View" },
      { url: "https://images.unsplash.com/photo-1623039405147-547794f92e9e", alt: "Smart Vending Machine - Side View" },
      { url: "https://images.unsplash.com/photo-1627843240167-b1f9440fc173", alt: "Smart Vending Machine - Interior" }
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
        image: { url: "https://images.unsplash.com/photo-1577412647305-991150c7d163", alt: "Corporate office deployment" }
      },
      {
        title: "University Campus",
        description: "Network of machines across campus providing 24/7 access to convenience items for students",
        image: { url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", alt: "University campus deployment" }
      },
      {
        title: "Transit Hub",
        description: "High-traffic location offering on-the-go refreshments and necessities to travelers",
        image: { url: "https://images.unsplash.com/photo-1568438350562-2cae6d394ad0", alt: "Transit hub deployment" }
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
      <section className="py-12 md:py-16 bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-vending-blue p-2 rounded-full mr-3">
                  {machineData.type === 'vending' ? (
                    <Server className="h-5 w-5 text-white" />
                  ) : (
                    <HardDrive className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className="text-vending-blue font-medium">
                  {machineData.type.charAt(0).toUpperCase()}{machineData.type.slice(1)} | {machineData.temperature.charAt(0).toUpperCase()}{machineData.temperature.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-vending-blue-dark">
                {machineData.title}
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                {machineData.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-primary">
                  Request Pricing
                </Button>
                <Button variant="outline">
                  Download Spec Sheet
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src={machineData.images[0]?.url} 
                  alt={machineData.images[0]?.alt || machineData.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Specifications Section */}
      <section className="py-12 bg-white" id="specifications">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
            Specifications
          </h2>
          <div className="bg-vending-gray rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {machineData.specs.dimensions && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Ruler className="mr-2 h-5 w-5 text-vending-blue" />
                      Dimensions
                    </h3>
                    <p className="text-gray-700">{machineData.specs.dimensions}</p>
                  </div>
                )}
                {machineData.specs.weight && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Weight className="mr-2 h-5 w-5 text-vending-blue" />
                      Weight
                    </h3>
                    <p className="text-gray-700">{machineData.specs.weight}</p>
                  </div>
                )}
                {machineData.specs.powerRequirements && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Plug className="mr-2 h-5 w-5 text-vending-blue" />
                      Power Requirements
                    </h3>
                    <p className="text-gray-700">{machineData.specs.powerRequirements}</p>
                  </div>
                )}
                {machineData.specs.temperature && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <ThermometerSnowflake className="mr-2 h-5 w-5 text-vending-blue" />
                      Temperature
                    </h3>
                    <p className="text-gray-700">{machineData.specs.temperature}</p>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                {machineData.specs.capacity && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Server className="mr-2 h-5 w-5 text-vending-blue" />
                      Capacity
                    </h3>
                    <p className="text-gray-700">{machineData.specs.capacity}</p>
                  </div>
                )}
                {machineData.specs.connectivity && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Wifi className="mr-2 h-5 w-5 text-vending-blue" />
                      Connectivity
                    </h3>
                    <p className="text-gray-700">{machineData.specs.connectivity}</p>
                  </div>
                )}
                {machineData.specs.priceRange && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-vending-blue" />
                      Cost
                    </h3>
                    <p className="text-gray-700">{machineData.specs.priceRange}</p>
                  </div>
                )}
                {machineData.specs.paymentOptions && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <HardDrive className="mr-2 h-5 w-5 text-vending-blue" />
                      Payment Options
                    </h3>
                    <p className="text-gray-700">{machineData.specs.paymentOptions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-vending-gray" id="features">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
            Features
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div>
              <ul className="space-y-4">
                {machineData.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-vending-teal mt-1 flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-vending-gray p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Customization Options</h3>
                  <p className="text-gray-700">
                    This machine can be customized with your branding, specific product configurations, and optional features like cashless payment systems.
                  </p>
                </div>
                <div className="bg-vending-gray p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Software Compatibility</h3>
                  <p className="text-gray-700">
                    Fully compatible with our vending management software, providing real-time inventory tracking, sales analytics, and remote management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Deployment Examples Section */}
      <section className="py-12 bg-white" id="deployment-examples">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
            Deployment Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {machineData.deploymentExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src={example.image.url} 
                  alt={example.image.alt || example.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                  <p className="text-gray-600">{example.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Additional Views Section */}
      <section className="py-12 bg-vending-gray">
        <div className="container-wide">
          <h2 className="text-2xl font-bold mb-8 text-center text-vending-blue-dark">Additional Views</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {machineData.images.slice(0, 3).map((image, index) => (
              <img 
                key={index}
                src={image.url}
                alt={image.alt || `${machineData.title} - View ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="container-wide max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2 text-vending-blue-dark">
                Interested in this machine?
              </h2>
              <p className="text-gray-600 mb-6">
                Complete the form below and one of our specialists will contact you with pricing and availability.
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                    placeholder="Tell us about your needs, deployment location, and any questions you have."
                  ></textarea>
                </div>
                <div>
                  <Button className="w-full">Submit Inquiry</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default MachineDetail;
