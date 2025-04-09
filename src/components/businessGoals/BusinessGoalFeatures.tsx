
import { ReactNode } from 'react';

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

interface BusinessGoalFeaturesProps {
  features: Feature[];
  sectionTitle?: string;
  sectionDescription?: string; 
}

const BusinessGoalFeatures = ({ 
  features,
  sectionTitle = "Key Features",
  sectionDescription = "Our platform provides specialized features to help you achieve this business goal effectively."
}: BusinessGoalFeaturesProps) => {
  if (!features || features.length === 0) return null;
  
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
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-vending-gray rounded-lg p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-vending-blue-light"
            >
              <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalFeatures;
