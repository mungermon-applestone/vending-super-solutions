
import React from 'react';
import Image from '@/components/common/Image';
import TechnologyFeatureItem from './TechnologyFeatureItem';
import { TechFeature } from '@/types/technology';

interface TechnologySectionProps {
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
  index,
}) => {
  const isEven = index % 2 === 0;

  return (
    <section id={id} className={`py-16 ${isEven ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
          <div className="w-full md:w-1/2">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <Image 
                src={image || 'https://images.unsplash.com/photo-1581091226033-c6e0b0cf8941'} 
                alt={title}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">{title}</h2>
            <p className="text-lg text-gray-600 mb-8">{description}</p>
            
            <div className="space-y-8">
              {features.map((feature, idx) => (
                <TechnologyFeatureItem
                  key={idx}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  items={feature.items} // Pass items to the component
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
