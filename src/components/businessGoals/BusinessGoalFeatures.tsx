
import { ReactNode } from 'react';
import { CMSFeature } from '@/types/cms';
import { CheckIcon, Star, Shield, Server, Settings, Bell, Battery, ClipboardCheck, RefreshCcw, TrendingUp, PieChart, Map, UserCheck } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon?: string | ReactNode;
  screenshot?: {
    url: string;
    alt?: string;
  };
}

interface BusinessGoalFeaturesProps {
  features: CMSFeature[] | Feature[];
  sectionTitle?: string;
  sectionDescription?: string; 
}

const getIconComponent = (iconName: string | undefined): ReactNode => {
  if (!iconName) return <Star className="h-6 w-6" />;
  
  switch (iconName.toLowerCase()) {
    case 'check':
      return <CheckIcon className="h-6 w-6" />;
    case 'shield':
      return <Shield className="h-6 w-6" />;
    case 'server':
      return <Server className="h-6 w-6" />;
    case 'settings':
      return <Settings className="h-6 w-6" />;
    case 'bell':
      return <Bell className="h-6 w-6" />;
    case 'battery':
      return <Battery className="h-6 w-6" />;
    case 'clipboard-check':
      return <ClipboardCheck className="h-6 w-6" />;
    case 'refresh-ccw':
      return <RefreshCcw className="h-6 w-6" />;
    case 'trending-up':
      return <TrendingUp className="h-6 w-6" />;
    case 'pie-chart':
      return <PieChart className="h-6 w-6" />;
    case 'map':
      return <Map className="h-6 w-6" />;
    case 'user-check':
      return <UserCheck className="h-6 w-6" />;
    default:
      return <Star className="h-6 w-6" />;
  }
};

const BusinessGoalFeatures = ({ 
  features,
  sectionTitle = "Key Features",
  sectionDescription = "Our platform provides specialized features to help you achieve this business goal effectively."
}: BusinessGoalFeaturesProps) => {
  if (!features || features.length === 0) {
    console.log('[BusinessGoalFeatures] No features provided');
    return null;
  }
  
  console.log('[BusinessGoalFeatures] Rendering features:', 
    features.map(f => ({
      title: f.title,
      hasIcon: !!f.icon,
      iconType: typeof f.icon,
      hasScreenshot: 'screenshot' in f && !!f.screenshot
    }))
  );
  
  // Additional debugging
  console.log('[BusinessGoalFeatures] Raw features data:', JSON.stringify(features, null, 2));
  
  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <h2 className="text-3xl font-bold text-center text-vending-blue-dark mb-4">
          {sectionTitle}
        </h2>
        <p className="text-center text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
          {sectionDescription}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            // Handle both string icons and ReactNode icons
            let iconElement: ReactNode;
            if (typeof feature.icon === 'string') {
              iconElement = getIconComponent(feature.icon);
            } else if (feature.icon) {
              iconElement = feature.icon;
            } else {
              iconElement = <Star className="h-6 w-6" />;
            }
            
            // Log individual feature for debugging
            console.log(`[BusinessGoalFeatures] Processing feature ${index}:`, {
              title: feature.title,
              hasIcon: !!feature.icon,
              iconType: typeof feature.icon,
              hasScreenshot: !!feature.screenshot
            });
            
            return (
              <div 
                key={('id' in feature && feature.id) || `feature-${index}`} 
                className="bg-vending-gray rounded-lg p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-vending-blue-light"
              >
                <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                  {iconElement}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                
                {/* Display screenshot if available */}
                {feature.screenshot && (
                  <div className="mt-4">
                    <img 
                      src={feature.screenshot.url} 
                      alt={feature.screenshot.alt || `${feature.title} screenshot`}
                      className="rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalFeatures;
