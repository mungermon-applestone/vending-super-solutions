
import React from 'react';
import { CMSBusinessGoal } from '@/types/cms';
import { Link } from 'react-router-dom';

interface BusinessGoalDetailProps {
  businessGoal: CMSBusinessGoal;
}

const BusinessGoalDetail: React.FC<BusinessGoalDetailProps> = ({ businessGoal }) => {
  if (!businessGoal) {
    return <div>No business goal data available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/business-goals" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Business Goals
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">{businessGoal.title}</h1>
          <p className="mt-2 text-lg text-gray-600">{businessGoal.description}</p>
        </div>
        
        {businessGoal.image && (
          <div className="border-t border-gray-200">
            <img 
              src={businessGoal.image} 
              alt={businessGoal.imageAlt || businessGoal.title}
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        )}

        {businessGoal.benefits && businessGoal.benefits.length > 0 && (
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
            <ul className="space-y-2 list-disc pl-5">
              {businessGoal.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Add more sections as needed based on the CMSBusinessGoal type */}
      </div>
    </div>
  );
};

export default BusinessGoalDetail;
