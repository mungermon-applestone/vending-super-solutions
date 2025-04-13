
import React from 'react';
import TechnologyFeatureItem from './TechnologyFeatureItem';
import { TechFeature } from '@/types/technology';
import { cn } from "@/lib/utils";

interface TechnologySectionProps {
  id: string;
  title: string;
  description: string;
  features: TechFeature[];
  image: string;
  index: number;
  className?: string;
}

const TechnologySection = ({ 
  id, 
  title, 
  description, 
  features, 
  image, 
  index,
  className 
}: TechnologySectionProps) => {
  const isEven = index % 2 === 0;

  return (
    <section id={id} className={cn("py-16", className)}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            {image && (
              <img 
                src={image} 
                alt={title}
                className="rounded-lg shadow-lg w-full object-cover aspect-[4/3]"
              />
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-lg text-muted-foreground">{description}</p>
            
            {features && features.length > 0 && (
              <div className="grid gap-6 mt-8">
                {features.map((feature, i) => (
                  <TechnologyFeatureItem
                    key={i}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    items={feature.items}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
