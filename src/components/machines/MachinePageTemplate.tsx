
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import CTASection from '@/components/common/CTASection';
import { Server, HardDrive, Ruler, Weight, Plug, ThermometerSnowflake, DollarSign } from 'lucide-react';
import Wifi from '@/components/ui/Wifi';

export interface MachineTemplateProps {
  machine: {
    id: string;
    slug: string;
    title: string;
    type: 'vending' | 'locker';
    temperature: string;
    description: string;
    images: Array<{
      url: string;
      alt: string;
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
  };
}

const MachinePageTemplate: React.FC<MachineTemplateProps> = ({ machine }) => {
  return (
    <Layout>
      <section className="py-12 md:py-16 bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-vending-blue p-2 rounded-full mr-3">
                  {machine.type === 'vending' ? (
                    <Server className="h-5 w-5 text-white" />
                  ) : (
                    <HardDrive className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className="text-vending-blue font-medium">
                  {machine.type.charAt(0).toUpperCase() + machine.type.slice(1)} | {machine.temperature.charAt(0).toUpperCase() + machine.temperature.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-vending-blue-dark">
                {machine.title}
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                {machine.description}
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
                  src={machine.images[0]?.url} 
                  alt={machine.images[0]?.alt || machine.title} 
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
                {machine.specs.dimensions && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Ruler className="mr-2 h-5 w-5 text-vending-blue" />
                      Dimensions
                    </h3>
                    <p className="text-gray-700">{machine.specs.dimensions}</p>
                  </div>
                )}
                {machine.specs.weight && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Weight className="mr-2 h-5 w-5 text-vending-blue" />
                      Weight
                    </h3>
                    <p className="text-gray-700">{machine.specs.weight}</p>
                  </div>
                )}
                {machine.specs.powerRequirements && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Plug className="mr-2 h-5 w-5 text-vending-blue" />
                      Power Requirements
                    </h3>
                    <p className="text-gray-700">{machine.specs.powerRequirements}</p>
                  </div>
                )}
                {machine.specs.temperature && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <ThermometerSnowflake className="mr-2 h-5 w-5 text-vending-blue" />
                      Temperature
                    </h3>
                    <p className="text-gray-700">{machine.specs.temperature}</p>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                {machine.specs.capacity && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Server className="mr-2 h-5 w-5 text-vending-blue" />
                      Capacity
                    </h3>
                    <p className="text-gray-700">{machine.specs.capacity}</p>
                  </div>
                )}
                {machine.specs.connectivity && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Wifi className="mr-2 h-5 w-5 text-vending-blue" />
                      Connectivity
                    </h3>
                    <p className="text-gray-700">{machine.specs.connectivity}</p>
                  </div>
                )}
                {machine.specs.priceRange && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-vending-blue" />
                      Cost
                    </h3>
                    <p className="text-gray-700">{machine.specs.priceRange}</p>
                  </div>
                )}
                {machine.specs.paymentOptions && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Server className="mr-2 h-5 w-5 text-vending-blue" />
                      Payment Options
                    </h3>
                    <p className="text-gray-700">{machine.specs.paymentOptions}</p>
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
                {machine.features.map((feature, index) => (
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
                  <h3 className="text-lg font-medium mb-3">Ideal For</h3>
                  <p className="text-gray-700">
                    {machine.type === 'vending' 
                      ? "Retail environments, offices, schools, and public spaces requiring automated sales of various products." 
                      : "Secure storage and distribution of items in retail, office, and transit environments."}
                  </p>
                </div>
                <div className="bg-vending-gray p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Software Compatibility</h3>
                  <p className="text-gray-700">
                    Fully compatible with our management software, providing real-time inventory tracking, sales analytics, and remote management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Deployment Examples Section */}
      {machine.deploymentExamples.length > 0 && (
        <section className="py-12 bg-white" id="deployment-examples">
          <div className="container-wide">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
              Deployment Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {machine.deploymentExamples.map((example, index) => (
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
      )}
      
      {/* Additional Views Section */}
      {machine.images.length > 1 && (
        <section className="py-12 bg-vending-gray">
          <div className="container-wide">
            <h2 className="text-2xl font-bold mb-8 text-center text-vending-blue-dark">Additional Views</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {machine.images.slice(0, 3).map((image, index) => (
                <img 
                  key={index}
                  src={image.url}
                  alt={image.alt || `${machine.title} - View ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="container-wide max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2 text-vending-blue-dark">
                Interested in {machine.title}?
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

export default MachinePageTemplate;
