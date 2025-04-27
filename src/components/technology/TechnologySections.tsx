
import React, { useEffect } from 'react';
import { CMSTechnologySection } from '@/types/cms';
import TechnologySection from './TechnologySection';

interface TechnologySectionsProps {
  sections: CMSTechnologySection[];
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ sections }) => {
  useEffect(() => {
    // Add more detailed logging to help debug the sections data
    console.log('[TechnologySections] Received sections data:', {
      sectionsProvided: !!sections,
      sectionsLength: sections?.length || 0,
      sectionsData: sections
    });
  }, [sections]);

  if (!sections || sections.length === 0) {
    console.warn('[TechnologySections] No sections provided');
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No technology sections available.</p>
      </div>
    );
  }

  const sortedSections = [...sections].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <div>
      {sortedSections.map((section, index) => {
        if (!section.title) {
          console.warn(`[TechnologySections] Section at index ${index} has no title, skipping`);
          return null;
        }
        
        // Enhanced logging for each section to debug image issues
        console.log(`[TechnologySections] Processing section: "${section.title}"`, {
          sectionId: section.id,
          hasImage: !!section.image?.url || !!section.sectionImage?.url,
          imageUrl: section.image?.url || section.sectionImage?.url || '',
          summary: section.summary || section.description || ''
        });
        
        const imageUrl = section.image?.url || 
                        section.sectionImage?.url || 
                        '';
        
        return (
          <TechnologySection 
            key={section.id || `section-${index}`} 
            id={section.id || `section-${index}`}
            title={section.title}
            summary={section.summary || section.description || ''}
            bulletPoints={section.bulletPoints || []}
            image={{
              url: imageUrl,
              alt: section.title || 'Technology section'
            }}
            index={index}
            className={index === 0 ? 'pt-0' : ''}
          />
        );
      })}
    </div>
  );
};

export default TechnologySections;
