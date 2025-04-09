
import React from 'react';
import { CMSTechnology } from '@/types/cms';
import TechnologyFeatureSection from './TechnologyFeatureSection';

interface TechnologySectionsProps {
  technology: CMSTechnology;
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ technology }) => {
  // Sort sections by display order
  const sortedSections = [...(technology.sections || [])].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <div className="py-16">
      {sortedSections.map((section) => (
        <TechnologyFeatureSection 
          key={section.id} 
          section={section}
          alternateLayout={section.display_order % 2 === 0}
        />
      ))}
    </div>
  );
};

export default TechnologySections;
