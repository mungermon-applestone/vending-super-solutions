
import React from 'react';
import { Check } from 'lucide-react';
import { CMSFeature } from '@/types/cms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MachineTypeIcon from '@/components/common/MachineTypeIcon';

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
          <Card 
            key={feature.id || index} 
            className="h-full transition-all duration-300 hover:shadow-lg"
          >
            {/* If there's a screenshot, show it at the top of the card */}
            {feature.screenshot && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={feature.screenshot.url} 
                  alt={feature.screenshot.alt || feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <CardHeader className={feature.screenshot ? 'pt-4' : 'pt-6'}>
              <div className="flex items-center gap-2">
                {feature.icon ? (
                  <div className="bg-blue-50 p-2 rounded-full">
                    <MachineTypeIcon 
                      icon={feature.icon}
                      className="h-5 w-5 text-vending-blue"
                    />
                  </div>
                ) : (
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Check className="h-5 w-5 text-vending-blue" />
                  </div>
                )}
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="text-gray-700 text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductFeaturesList;
