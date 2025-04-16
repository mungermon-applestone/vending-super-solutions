
import React from 'react';
import { CMSTechnologySection } from '@/types/cms';
import TechnologySection from './TechnologySection';

interface TechnologySectionsProps {
  sections: CMSTechnologySection[];
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ sections }) => {
  // Handle case when sections is undefined or empty
  if (!sections || sections.length === 0) {
    console.warn('[TechnologySections] No sections provided');
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No technology sections available.</p>
      </div>
    );
  }

  // Sort sections by display order
  const sortedSections = [...sections].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <div>
      {sortedSections.map((section, index) => {
        // Skip sections without a title as they're likely invalid
        if (!section.title) {
          console.warn(`[TechnologySections] Section at index ${index} has no title, skipping`);
          return null;
        }
        
        return (
          <TechnologySection 
            key={section.id || `section-${index}`} 
            id={section.id || `section-${index}`}
            title={section.title}
            summary={section.summary || ''}
            bulletPoints={section.bulletPoints || []}
            image={section.sectionImage?.url || section.image?.url || ''}
            index={index}
            className={index === 0 ? 'pt-0' : ''}
          />
        );
      })}
    </div>
  );
};

export default TechnologySections;
