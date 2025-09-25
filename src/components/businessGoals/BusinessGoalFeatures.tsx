import { ReactNode } from 'react';
import { CMSFeature } from '@/types/cms';
import { Check } from 'lucide-react';
import MachineTypeIcon from '@/components/common/MachineTypeIcon';
import Image from '@/components/common/Image';
import TranslatableText from '@/components/translation/TranslatableText';

interface BusinessGoalFeaturesProps {
  features: CMSFeature[];
  sectionTitle?: string;
  sectionDescription?: string; 
}

const BusinessGoalFeatures = ({ 
  features,
  sectionTitle = "Key Features",
  sectionDescription = "Our platform provides specialized features to help you achieve this business goal effectively."
}: BusinessGoalFeaturesProps) => {
  if (!features || features.length === 0) return null;

  // Render the icon based on its type
  const renderIcon = (feature: CMSFeature) => {
    if (!feature.icon) {
      return <Check className="h-6 w-6 text-vending-blue" />;
    }
    
    // If icon is a string, use MachineTypeIcon
    if (typeof feature.icon === 'string') {
      return (
        <MachineTypeIcon 
          icon={feature.icon}
          className="h-6 w-6 text-vending-blue"
        />
      );
    }
    
    // Otherwise render the ReactNode directly
    return (
      <div className="h-6 w-6 text-vending-blue">
        {feature.icon}
      </div>
    );
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <h2 className="text-3xl font-bold text-center text-vending-blue-dark mb-4">
          <TranslatableText context="business-goal-features">{sectionTitle}</TranslatableText>
        </h2>
        <p className="text-center text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
          <TranslatableText context="business-goal-features">{sectionDescription}</TranslatableText>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            // Process screenshot data to ensure type safety
            const hasScreenshot = feature.screenshot && feature.screenshot.url;
            const screenshotUrl = hasScreenshot ? feature.screenshot.url : '';
            const screenshotAlt = hasScreenshot && typeof feature.screenshot.alt === 'string' 
              ? feature.screenshot.alt 
              : `${feature.title || 'Feature'} image`;

            return (
              <div 
                key={feature.id || `feature-${index}`} 
                className="bg-vending-gray rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-transparent hover:border-vending-blue-light"
              >
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
                    <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center">
                      {renderIcon(feature)}
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalFeatures;
