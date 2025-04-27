
import React from 'react';
import { CMSTechnologySection } from '@/types/cms';
import TechnologySection from './TechnologySection';

interface TechnologySectionsProps {
  sections: CMSTechnologySection[];
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ sections }) => {
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
        
        return (
          <TechnologySection 
            key={section.id || `section-${index}`} 
            id={section.id || `section-${index}`}
            title={section.title}
            summary={section.description || ''}
            bulletPoints={section.bulletPoints || []}
            image={{
              url: section.image?.url || '',
              alt: section.image?.alt || section.title
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
