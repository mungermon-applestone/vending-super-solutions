import React from 'react';
import { CMSMachine } from '@/types/cms';

interface MachineDetailFeaturesProps {
  features: string[];
}

const MachineDetailFeatures: React.FC<MachineDetailFeaturesProps> = ({ features }) => {
  // Split features into two columns for larger screens
  const midpoint = Math.ceil(features.length / 2);
  const leftColumnFeatures = features.slice(0, midpoint);
  const rightColumnFeatures = features.slice(midpoint);

  return (
    <section className="py-12 bg-vending-gray" id="features">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-vending-blue-dark">
          Features
        </h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div>
            {/* Features List - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {/* Left column */}
              <div className="space-y-2">
                {leftColumnFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-vending-teal mt-1 flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </div>
              
              {/* Right column - only show if there are items for it */}
              {rightColumnFeatures.length > 0 && (
                <div className="space-y-2">
                  {rightColumnFeatures.map((feature, index) => (
                    <li key={index + midpoint} className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal mt-1 flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </div>
              )}
            </div>
            
            {/* Customization cards below - unchanged */}
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
  );
};

export default MachineDetailFeatures;
