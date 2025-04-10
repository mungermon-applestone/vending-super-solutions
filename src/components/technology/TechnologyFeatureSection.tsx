
import React from 'react';
import { CMSTechnologySection } from '@/types/cms';
import TechnologyFeatureCard from './TechnologyFeatureCard';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface TechnologyFeatureSectionProps {
  section: CMSTechnologySection;
  alternateLayout?: boolean;
}

const TechnologyFeatureSection: React.FC<TechnologyFeatureSectionProps> = ({
  section,
  alternateLayout = false
}) => {
  // Sort features by display order
  const sortedFeatures = [...(section.features || [])].sort(
    (a, b) => a.display_order - b.display_order
  );

  // Format section type with capitalization (with null check)
  const formattedSectionType = section.section_type 
    ? section.section_type.charAt(0).toUpperCase() + section.section_type.slice(1) 
    : 'Feature';

  return (
    <div className={`py-16 ${alternateLayout ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="container max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="outline" className="mb-3 px-3 py-1">
            {formattedSectionType}
          </Badge>
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
