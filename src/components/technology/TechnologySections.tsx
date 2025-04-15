
import React from 'react';
import { CMSTechnologySection } from '@/types/cms';
import TechnologySection from './TechnologySection';

interface TechnologySectionsProps {
  sections: CMSTechnologySection[];
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ sections }) => {
  // Sort sections by display order
  const sortedSections = [...sections].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <div>
      {sortedSections.map((section, index) => (
        <TechnologySection 
          key={section.id} 
          id={section.id}
          title={section.title}
          summary={section.description}
          bulletPoints={section.bullet_points}
          image={section.image?.url || ''}
          index={index}
          className={index === 0 ? 'pt-0' : ''}
        />
      ))}
    </div>
  );
};

export default TechnologySections;
