
import { Check, ShoppingBag, ShieldCheck, Utensils, Tags, Truck, Clock } from 'lucide-react';
import { CMSFeature } from '@/types/cms';

interface ProductFeaturesListProps {
  features: CMSFeature[];
}

const ProductFeaturesList = ({ features }: ProductFeaturesListProps) => {
  // Function to render the appropriate icon based on string name or use default
  const renderIcon = (iconName?: string | React.ReactNode) => {
    if (React.isValidElement(iconName)) {
      return iconName;
    }
    
    // If it's a string, map to the corresponding icon component
    if (typeof iconName === 'string') {
      switch (iconName.toLowerCase()) {
        case 'shoppingbag':
          return <ShoppingBag className="h-6 w-6 text-vending-teal" />;
        case 'shieldcheck':
          return <ShieldCheck className="h-6 w-6 text-vending-teal" />;
        case 'utensils':
          return <Utensils className="h-6 w-6 text-vending-teal" />;
        case 'tags':
          return <Tags className="h-6 w-6 text-vending-teal" />;
        case 'truck':
          return <Truck className="h-6 w-6 text-vending-teal" />;
        case 'clock':
          return <Clock className="h-6 w-6 text-vending-teal" />;
        default:
          return <Check className="h-6 w-6 text-vending-teal" />;
      }
    }
    
    // Default icon
    return <Check className="h-6 w-6 text-vending-teal" />;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <h2 className="text-3xl font-bold text-center mb-16 text-vending-blue-dark">
          Specialized Features
        </h2>
        
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`grid grid-cols-1 ${feature.screenshot ? 'lg:grid-cols-2' : ''} gap-8 items-center ${
                index % 2 === 1 && feature.screenshot ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {renderIcon(feature.icon)}
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-700 mb-6">{feature.description}</p>
                
                {/* Additional content could go here */}
              </div>
              
              {feature.screenshot && (
                <div className="relative">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                      src={feature.screenshot.url} 
                      alt={feature.screenshot.alt || feature.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFeaturesList;
