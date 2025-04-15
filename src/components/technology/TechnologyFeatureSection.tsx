
import React from 'react';
import { CMSTechnologySection } from '@/types/cms';
import TechnologyFeatureCard from './TechnologyFeatureCard';

interface TechnologyFeatureSectionProps {
  section: CMSTechnologySection;
  alternateLayout?: boolean;
}

const TechnologyFeatureSection: React.FC<TechnologyFeatureSectionProps> = ({
  section,
  alternateLayout = false,
}) => {
  // Sort features by display order
  const sortedFeatures = [...(section.features || [])].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <div className={`py-16 ${alternateLayout ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="container max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full mb-4">
            {section.section_type?.charAt(0).toUpperCase() + section.section_type?.slice(1) || 'Technology'}
          </span>
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          {section.description && (
            <p className="text-lg text-muted-foreground">{section.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {sortedFeatures.map((feature) => (
            <TechnologyFeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnologyFeatureSection;
