import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MachineTypeIcon from '@/components/common/MachineTypeIcon';
import Image from '@/components/common/Image';
import { CMSFeature } from '@/types/cms';

interface FeatureCardProps {
  feature: CMSFeature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  // Process screenshot data to ensure type safety
  const hasScreenshot = feature.screenshot && feature.screenshot.url;
  const screenshotUrl = hasScreenshot ? feature.screenshot.url : '';
  const screenshotAlt = hasScreenshot && typeof feature.screenshot.alt === 'string' 
    ? feature.screenshot.alt 
    : `${feature.title || 'Feature'} image`;
  
  // Render the icon based on its type
  const renderIcon = () => {
    if (!feature.icon) {
      return <Check className="h-12 w-12 text-vending-blue-dark opacity-40" />;
    }
    
    // If icon is a string, use MachineTypeIcon
    if (typeof feature.icon === 'string') {
      return (
        <MachineTypeIcon 
          icon={feature.icon}
          className="h-12 w-12 text-vending-blue-dark opacity-40"
        />
      );
    }
    
    // Otherwise render the ReactNode directly
    return (
      <div className="h-12 w-12 text-vending-blue-dark opacity-40">
        {feature.icon}
      </div>
    );
  };
  
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg overflow-hidden">
      {hasScreenshot ? (
        <div className="w-full h-48 overflow-hidden">
          <Image 
            src={screenshotUrl}
            alt={screenshotAlt}
            className="w-full h-full"
            objectFit="contain"
            aspectRatio="16/9"
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-blue-50 flex items-center justify-center">
          {renderIcon()}
        </div>
      )}
      
      <CardHeader className="pt-4">
        <CardTitle className="text-xl font-bold">
          {feature.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="text-gray-600">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
