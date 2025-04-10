
import React from 'react';
import { cn } from '@/lib/utils';
import TechnologyFeatureItem from './TechnologyFeatureItem';
import { TechFeature } from '@/types/technology';

export interface TechnologySectionProps {
  id: string;
  title: string;
  description: string;
  features: TechFeature[];
  image: string;
  index: number;
}

const TechnologySection: React.FC<TechnologySectionProps> = ({
  id,
  title,
  description,
  features,
  image,
  index
}) => {
  const isEven = index % 2 === 1;
  
  return (
    <section 
      id={id}
      className={cn(
        "py-16 md:py-24",
        isEven ? "bg-slate-50" : "bg-white"
      )}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        )}>
          <div className={isEven ? "lg:order-2" : ""}>
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {description}
            </p>

            <div className="space-y-6 mb-8">
              {features.map((feature, i) => (
                <TechnologyFeatureItem
                  key={i}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          <div className={cn(
            "relative rounded-lg overflow-hidden shadow-lg h-80 lg:h-96",
            isEven ? "lg:order-1" : ""
          )}>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
