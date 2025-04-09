
import React from 'react';

interface FeaturesListProps {
  features: string[];
}

const FeaturesList: React.FC<FeaturesListProps> = ({ features }) => {
  return (
    <div>
      <ul className="space-y-4">
        {features.map((feature, index) => (
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
            {features.length > 0 && features[0].includes("vending")
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
  );
};

export default FeaturesList;
