
import React, { useEffect } from 'react';
import { CMSTechnologySection } from '@/types/cms';
import TechnologySection from './TechnologySection';

interface TechnologySectionsProps {
  sections: CMSTechnologySection[];
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ sections }) => {
  useEffect(() => {
    console.log('[TechnologySections] Rendering sections:', {
      sectionsCount: sections?.length || 0,
      sectionsData: sections?.map(s => ({
        id: s.id,
        title: s.title,
        hasImage: !!s.sectionImage || !!s.image
      }))
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
        console.log(`[TechnologySections] Processing section ${index}:`, {
          title: section.title,
          hasImage: !!section.sectionImage || !!section.image,
          imageUrl: section.sectionImage?.url || section.image?.url
        });

        return (
          <TechnologySection
            key={section.id}
            id={section.id}
            title={section.title}
            summary={section.summary || section.description || ''}
            bulletPoints={section.bulletPoints || []}
            image={{
              url: section.sectionImage?.url || section.image?.url || '',
              alt: section.title
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
