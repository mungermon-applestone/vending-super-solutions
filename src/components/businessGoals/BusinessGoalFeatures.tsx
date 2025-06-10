
import { ReactNode } from 'react';
import { CMSFeature } from '@/types/cms';

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
              key={feature.id || `feature-${index}`} 
              className="bg-vending-gray rounded-lg p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-vending-blue-light"
            >
              <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                {feature.icon ? (
                  typeof feature.icon === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: feature.icon }} />
                  ) : (
                    feature.icon
                  )
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
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
