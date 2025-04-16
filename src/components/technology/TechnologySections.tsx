
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

  // Debug logging for incoming sections
  console.log('[TechnologySections] Incoming sections:', sections);

  return (
    <div>
      {sortedSections.map((section, index) => {
        // Detailed logging for each section
        console.log(`[TechnologySections] Processing section ${index}:`, {
          id: section.id,
          title: section.title,
          summary: section.summary,
          hasSummary: !!section.summary,
          summaryLength: section.summary?.length,
          image: section.sectionImage?.url || section.image?.url || ''
        });
        
        return (
          <TechnologySection 
            key={section.id} 
            id={section.id}
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
