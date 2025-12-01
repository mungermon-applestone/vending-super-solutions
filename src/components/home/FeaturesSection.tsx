
import React from 'react';
import { 
  ShoppingCart, 
  Award, 
  Cpu,
  CreditCard,
  Wifi,
  UserCheck,
  Package,
  Truck
} from 'lucide-react';
import { useHomePageContent } from '@/hooks/useHomePageContent';
import { useTranslatedFeatures, useTranslatedCMSContent } from '@/hooks/useTranslatedCMSContent';
import TranslatableText from '@/components/translation/TranslatableText';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, url }) => {
  const content = (
    <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100 h-full">
      <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );

  if (url) {
    return (
      <a 
        href={url} 
        className="block transition-transform duration-300 hover:scale-105 hover:shadow-lg"
      >
        {content}
      </a>
    );
  }

  return content;
};

/**
 * Features Section Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component displays 8 feature cards showcasing integration capabilities
 * - Each feature card maintains consistent styling and structure:
 *   - Icon with circular blue background at top
 *   - Heading below icon
 *   - Description text at bottom
 * 
 * Layout specifications:
 * - Uses grid layout with 4 columns on extra-large screens (xl:grid-cols-4)
 * - 3 columns on large screens (lg:grid-cols-3)
 * - 2 columns on medium screens (md:grid-cols-2)
 * - Single column on mobile (grid-cols-1)
 * - Cards have consistent shadow and hover effects
 * - Maintains specific spacing between cards (gap-8)
 * 
 * @returns React component
 */
const FeaturesSection = () => {
  const { data: homeContent } = useHomePageContent();
  const { translatedContent: translatedHomeContent } = useTranslatedCMSContent(homeContent, 'features-section');

  // Function to get the appropriate icon component based on the icon name from Contentful
  const getIconComponent = (iconName: string | undefined) => {
    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart className="h-8 w-8 text-vending-blue" />;
      case 'Award':
        return <Award className="h-8 w-8 text-vending-blue" />;
      case 'Cpu':
        return <Cpu className="h-8 w-8 text-vending-blue" />;
      case 'CreditCard':
        return <CreditCard className="h-8 w-8 text-vending-blue" />;
      case 'Wifi':
        return <Wifi className="h-8 w-8 text-vending-blue" />;
      case 'UserCheck':
        return <UserCheck className="h-8 w-8 text-vending-blue" />;
      case 'Package':
        return <Package className="h-8 w-8 text-vending-blue" />;
      case 'Truck':
        return <Truck className="h-8 w-8 text-vending-blue" />;
      default:
        return <ShoppingCart className="h-8 w-8 text-vending-blue" />;
    }
  };
  
  // Feature data from Contentful
  const rawFeaturesData = [
    {
      title: homeContent?.feature1Title || '',
      description: homeContent?.feature1Description || '',
      icon: getIconComponent(homeContent?.feature1Icon),
      url: homeContent?.feature1url
    },
    {
      title: homeContent?.feature2Title || '',
      description: homeContent?.feature2Description || '',
      icon: getIconComponent(homeContent?.feature2Icon),
      url: homeContent?.feature2url
    },
    {
      title: homeContent?.feature3Title || '',
      description: homeContent?.feature3Description || '',
      icon: getIconComponent(homeContent?.feature3Icon),
      url: homeContent?.feature3url
    },
    {
      title: homeContent?.feature4Title || '',
      description: homeContent?.feature4Description || '',
      icon: getIconComponent(homeContent?.feature4Icon),
      url: homeContent?.feature4url
    },
    {
      title: homeContent?.feature5Title || '',
      description: homeContent?.feature5Description || '',
      icon: getIconComponent(homeContent?.feature5Icon),
      url: homeContent?.feature5url
    },
    {
      title: homeContent?.feature6Title || '',
      description: homeContent?.feature6Description || '',
      icon: getIconComponent(homeContent?.feature6Icon),
      url: homeContent?.feature6url
    },
    {
      title: homeContent?.feature7Title || '',
      description: homeContent?.feature7Description || '',
      icon: getIconComponent(homeContent?.feature7Icon),
      url: homeContent?.feature7url
    },
    {
      title: homeContent?.feature8Title || '',
      description: homeContent?.feature8Description || '',
      icon: getIconComponent(homeContent?.feature8Icon),
      url: homeContent?.feature8url
    }
  ];

  // Translate the features data
  const { translatedFeatures } = useTranslatedFeatures(rawFeaturesData);
  
  // Combine translated data with original icons and URLs
  const featuresData = translatedFeatures.map((feature, index) => ({
    ...feature,
    icon: rawFeaturesData[index].icon,
    url: rawFeaturesData[index].url
  }));

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {translatedHomeContent?.featuresSectionTitle || (
              <TranslatableText context="features-section">Versatile, Flexible, Integration-Ready</TranslatableText>
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {translatedHomeContent?.featuresSectionDescription || (
              <TranslatableText context="features-section">Our solution adapts to your business requirements, whether you're an operator, enterprise, or brand looking to expand your vending presence.</TranslatableText>
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              url={feature.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
