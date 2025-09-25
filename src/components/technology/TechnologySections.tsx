
import React, { useEffect } from 'react';
import { CMSTechnologySection } from '@/types/cms';
import TechnologySection from './TechnologySection';
import { useTranslatedCMSContent } from '@/hooks/useTranslatedCMSContent';

interface TechnologySectionsProps {
  sections: CMSTechnologySection[];
}

const TechnologySections: React.FC<TechnologySectionsProps> = ({ sections }) => {
  const { translatedContent: translatedSections, isLoading: isTranslating } = useTranslatedCMSContent(sections, 'technology-sections');
  
  // Use translated content if available, fallback to original
  const displaySections = translatedSections || sections;

  useEffect(() => {
    console.log('[TechnologySections] Rendering sections:', {
      sectionsCount: displaySections?.length || 0,
      sectionsData: displaySections?.map(s => ({
        id: s.id,
        title: s.title,
        hasImage: !!s.sectionImage || !!s.image
      }))
    });
  }, [displaySections]);

  if (!displaySections || displaySections.length === 0) {
    console.warn('[TechnologySections] No sections provided');
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No technology sections available.</p>
      </div>
    );
  }

  // Filter out invalid sections first
  const validSections = displaySections.filter(section => {
    const isValid = section && section.id && section.title;
    if (!isValid) {
      console.warn('[TechnologySections] Found invalid section, skipping:', section);
    }
    return isValid;
  });

  if (validSections.length === 0) {
    console.warn('[TechnologySections] No valid sections after filtering');
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No valid technology sections available.</p>
      </div>
    );
  }

  const sortedSections = [...validSections].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  return (
    <div>
      {sortedSections.map((section, index) => {
        console.log(`[TechnologySections] Processing section ${index}:`, {
          id: section.id,
          title: section.title,
          hasImage: !!section.sectionImage || !!section.image,
          imageUrl: section.sectionImage?.url || section.image?.url
        });

        const imageData = {
          url: section.sectionImage?.url || section.image?.url || '',
          alt: section.sectionImage?.alt || section.image?.alt || section.title || 'Technology section'
        };

        return (
          <TechnologySection
            key={section.id}
            id={section.id}
            title={section.title}
            summary={section.summary || section.description || ''}
            bulletPoints={section.bulletPoints || []}
            image={imageData}
            index={index}
            className={index === 0 ? 'pt-0' : ''}
          />
        );
      })}
    </div>
  );
};

export default TechnologySections;
