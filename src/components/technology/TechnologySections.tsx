
import React from 'react';
import { CMSTechnology, CMSTechnologySection } from '@/types/cms';
import TechnologyFeatureSection from './TechnologyFeatureSection';

interface TechnologySectionsProps {
  sections: CMSTechnologySection[];
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ sections }) => {
  // Sort sections by display order
  const sortedSections = [...sections].sort(
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
