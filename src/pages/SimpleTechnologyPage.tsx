
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySections from '@/components/technology/TechnologySections';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import { useIsFetching } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { CMSTechnology, CMSTechnologySection } from '@/types/cms';

const SimpleTechnologyPage = () => {
  const { technologies = [], isLoading, error } = useTechnologySections({
    enableToasts: true
  });
  const isFetching = useIsFetching({ queryKey: ['technologies'] }) > 0;

  // Extract all sections from all technologies
  const allSections: CMSTechnologySection[] = React.useMemo(() => {
    if (!technologies || technologies.length === 0) {
      console.log('[SimpleTechnologyPage] No technologies found for sections');
      return [];
    }
    
    // Collect all sections from all technologies
    const sections: CMSTechnologySection[] = [];
    
    technologies.forEach((tech, techIndex) => {
      console.log(`[SimpleTechnologyPage] Processing tech #${techIndex}: ${tech.title}`, {
        hasSections: Array.isArray(tech.sections),
        sectionsCount: tech.sections?.length || 0
      });
      
      if (tech.sections && Array.isArray(tech.sections)) {
        tech.sections.forEach(section => {
          // Ensure section has needed properties
          const processedSection: CMSTechnologySection = {
            id: section.id || `section-${techIndex}-${sections.length}`,
            title: section.title || 'Technology Section',
            description: section.description || '',
            summary: section.summary || section.description || '',
            bulletPoints: section.bulletPoints || [],
            image: section.image || (section.sectionImage ? {
              url: section.sectionImage.url,
              alt: section.title || 'Technology section'
            } : undefined),
            sectionImage: section.sectionImage,
            features: section.features || [],
            technology_id: tech.id,
            section_type: section.section_type || 'general',
            display_order: section.display_order || 0
          };
          
          sections.push(processedSection);
        });
      } else if (tech.description) {
        // Create a default section from the technology itself if no sections
        console.log(`[SimpleTechnologyPage] Creating default section for: ${tech.title}`);
        
        const imageObject = tech.image && typeof tech.image === 'object' ? 
          tech.image : { url: typeof tech.image === 'string' ? tech.image : '', alt: tech.title || 'Technology' };
        
        sections.push({
          id: `default-section-${tech.id}`,
          title: tech.title,
          description: tech.description,
          summary: tech.description,
          image: imageObject,
          technology_id: tech.id,
          section_type: 'default',
          display_order: 0,
          features: [],
          bulletPoints: []
        });
      }
    });
    
    console.log(`[SimpleTechnologyPage] Processed ${sections.length} total sections`);
    return sections;
  }, [technologies]);

  // Log detailed information about the sections we've extracted
  useEffect(() => {
    console.log('[SimpleTechnologyPage] Processed sections:', allSections);
  }, [allSections]);

  return (
    <Layout>
      {/* Hero Section */}
      <TechnologyHeroSimple 
        title="Our Technology Platform"
        description="Powerful, reliable, and secure technology solutions designed specifically for the vending industry"
        imageUrl="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789"
        imageAlt="Vending Technology Platform"
      />

      {/* Loading State */}
      {(isLoading || isFetching) && (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col md:flex-row gap-8">
                <Skeleton className="h-64 w-full md:w-1/2" />
                <div className="w-full md:w-1/2 space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <div className="grid grid-cols-1 gap-4">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isFetching && (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Technologies</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load technology information. Please try again later.'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isFetching && !error && technologies.length === 0 && (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Alert>
            <AlertDescription>
              No technology information is currently available.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Technology Sections */}
      {!isLoading && !error && allSections.length > 0 ? (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <TechnologySections sections={allSections} />
        </div>
      ) : !isLoading && !isFetching && !error && technologies.length > 0 ? (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Alert>
            <AlertDescription>
              Technologies were found but no sections were available to display.
            </AlertDescription>
          </Alert>
        </div>
      ) : null}

      {/* Contact Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
