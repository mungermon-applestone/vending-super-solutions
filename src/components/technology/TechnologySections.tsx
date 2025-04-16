
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
      {sortedSections.map((section, index) => {
        // Debug logging for each section
        console.log(`[TechnologySections] Rendering section "${section.title}"`, {
          id: section.id,
          summary: section.summary,
          description: section.description,
          usedText: section.summary || section.description || '',
          imageUrl: section.sectionImage?.url || section.image?.url || ''
        });
        
        return (
          <TechnologySection 
            key={section.id} 
            id={section.id}
            title={section.title}
            summary={section.summary || section.description || ''}
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
