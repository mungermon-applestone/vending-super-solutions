
import React from 'react';
import { 
  ShoppingCart, 
  Award, 
  Globe, 
  BarChart3, 
  Shield, 
  Zap 
} from 'lucide-react';
import { useHomePageContent } from '@/hooks/useHomePageContent';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
      <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

/**
 * Features Section Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component MUST display exactly 6 feature cards in a specific 3x2 grid layout
 * - DO NOT reduce to fewer cards or change the layout without explicit instructions
 * - This design has been explicitly approved and confirmed by the client
 * - Each feature card maintains consistent styling and structure:
 *   - Icon with circular blue background at top
 *   - Heading below icon
 *   - Description text at bottom
 * 
 * Layout specifications:
 * - Uses grid layout with 3 columns on large screens (lg:grid-cols-3)
 * - 2 columns on medium screens (md:grid-cols-2)
 * - Single column on mobile (grid-cols-1)
 * - Cards have consistent shadow and hover effects
 * - Maintains specific spacing between cards (gap-8)
 * 
 * @returns React component
 */
const FeaturesSection = () => {
  const { data: homeContent } = useHomePageContent();

  // Function to get the appropriate icon component based on the icon name from Contentful
  const getIconComponent = (iconName: string | undefined) => {
    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart className="h-8 w-8 text-vending-blue" />;
      case 'Award':
        return <Award className="h-8 w-8 text-vending-blue" />;
      case 'Globe':
        return <Globe className="h-8 w-8 text-vending-blue" />;
      case 'BarChart3':
        return <BarChart3 className="h-8 w-8 text-vending-blue" />;
      case 'Shield':
        return <Shield className="h-8 w-8 text-vending-blue" />;
      case 'Zap':
        return <Zap className="h-8 w-8 text-vending-blue" />;
      default:
        return <ShoppingCart className="h-8 w-8 text-vending-blue" />;
    }
  };
  
  // Feature data from Contentful
  const featuresData = [
    {
      title: homeContent?.feature1Title || '',
      description: homeContent?.feature1Description || '',
      icon: getIconComponent(homeContent?.feature1icon)
    },
    {
      title: homeContent?.feature2Title || '',
      description: homeContent?.feature2Description || '',
      icon: getIconComponent(homeContent?.feature2Icon)
    },
    {
      title: homeContent?.feature3Title || '',
      description: homeContent?.feature3Description || '',
      icon: getIconComponent(homeContent?.feature3Icon)
    },
    {
      title: homeContent?.feature4Title || '',
      description: homeContent?.feature4Description || '',
      icon: getIconComponent(homeContent?.feature4Icon)
    },
    {
      title: homeContent?.feature5Title || '',
      description: homeContent?.feature5Description || '',
      icon: getIconComponent(homeContent?.feature5Icon)
    },
    {
      title: homeContent?.feature6Title || '',
      description: homeContent?.feature6Description || '',
      icon: getIconComponent(homeContent?.feature6Icon)
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {homeContent?.featuresSectionTitle || "Versatile Software for Every Vending Need"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {homeContent?.featuresSectionDescription || "Our solution adapts to your business requirements, whether you're an operator, enterprise, or brand looking to expand your vending presence."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* IMPORTANT: Do not remove or modify these 6 cards without explicit client approval */}
          {featuresData.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
