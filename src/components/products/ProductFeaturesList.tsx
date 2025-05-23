
import React from 'react';
import { Check } from 'lucide-react';
import { CMSFeature } from '@/types/cms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MachineTypeIcon from '@/components/common/MachineTypeIcon';
import Image from '@/components/common/Image';

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
            className="h-full transition-all duration-300 hover:shadow-lg overflow-hidden"
          >
            {/* Prioritize screenshot if available */}
            {feature.screenshot && feature.screenshot.url ? (
              <div className="w-full h-48 overflow-hidden">
                <Image 
                  src={feature.screenshot.url}
                  alt={String(feature.screenshot.alt || feature.title || "Feature image")}
                  className="w-full h-full"
                  objectFit="cover"
                  aspectRatio="16/9"
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-blue-50 flex items-center justify-center">
                {feature.icon ? (
                  <MachineTypeIcon 
                    icon={feature.icon}
                    className="h-12 w-12 text-vending-blue-dark opacity-40"
                  />
                ) : (
                  <Check className="h-12 w-12 text-vending-blue-dark opacity-40" />
                )}
              </div>
            )}
            
            <CardHeader className="pt-4">
              <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
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
