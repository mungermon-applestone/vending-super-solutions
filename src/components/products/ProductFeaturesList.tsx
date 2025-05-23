
import React from 'react';
import { CMSFeature } from '@/types/cms';
import FeatureCard from './FeatureCard';

interface ProductFeaturesListProps {
  features: CMSFeature[];
}

const ProductFeaturesList = ({ features }: ProductFeaturesListProps) => {
  // If no features are provided, don't render anything
  if (!features || features.length === 0) return null;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-10 text-vending-blue-dark">
        Key Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={feature.id || index}
            feature={feature}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductFeaturesList;
