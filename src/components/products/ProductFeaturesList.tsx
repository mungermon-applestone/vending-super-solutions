
import { Check } from 'lucide-react';

interface ProductFeature {
  title: string;
  description: string;
  icon?: React.ReactNode;
  screenshot?: string;
}

interface ProductFeaturesListProps {
  features: ProductFeature[];
}

const ProductFeaturesList = ({ features }: ProductFeaturesListProps) => {
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
                  {feature.icon || <Check className="h-6 w-6 text-vending-teal" />}
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-700 mb-6">{feature.description}</p>
                
                {/* Additional content could go here */}
              </div>
              
              {feature.screenshot && (
                <div className="relative">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                      src={feature.screenshot} 
                      alt={feature.title}
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
