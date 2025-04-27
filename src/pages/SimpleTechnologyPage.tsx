import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySection from '@/components/technology/TechnologySection';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import { useIsFetching } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { CMSTechnology } from '@/types/cms';

const SimpleTechnologyPage = () => {
  const { technologies = [], isLoading, error } = useTechnologySections({
    enableToasts: true
  });
  const isFetching = useIsFetching({ queryKey: ['technologies'] }) > 0;

  // Transform technology data for rendering
  const transformedTechnologies = technologies.map(tech => {
    console.log(`[SimpleTechnologyPage] Transforming tech '${tech.title}'`, {
      techData: tech,
      sections: tech.sections,
      hasImage: !!tech.image
    });

    let summary = '';
    let bulletPoints: string[] = [];
    
    // Get summary from first section if available, otherwise use tech description
    if (tech.sections && tech.sections.length > 0) {
      summary = tech.sections[0].summary || tech.sections[0].description || '';
      bulletPoints = tech.sections[0].bulletPoints || [];
    }
    
    // Fallback to technology description if no section summary
    if (!summary && tech.description) {
      summary = tech.description;
    }

    return {
      id: tech.id,
      title: tech.title,
      summary,
      bulletPoints,
      image: {
        url: tech.sections?.[0]?.image?.url || 
             tech.sections?.[0]?.sectionImage?.url || 
             (tech.image && typeof tech.image === 'object' ? tech.image.url : '') || 
             '',
        alt: tech.title || 'Technology section'
      }
    };
  });

  // Log the transformed technologies to help debug the summary issue
  useEffect(() => {
    if (transformedTechnologies.length > 0) {
      console.log("[SimpleTechnologyPage] Transformed Technologies:", transformedTechnologies);
      transformedTechnologies.forEach(tech => {
        console.log(`[SimpleTechnologyPage] Tech '${tech.title}' summary:`, {
          summary: tech.summary,
          summaryType: typeof tech.summary,
          summaryLength: tech.summary?.length || 0,
          hasSummaryContent: !!tech.summary && tech.summary.trim() !== ''
        });
      });
    } else {
      console.log("[SimpleTechnologyPage] No technologies to transform");
    }
  }, [transformedTechnologies]);

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
      {!isLoading && !isFetching && !error && transformedTechnologies.length === 0 && (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Alert>
            <AlertDescription>
              No technology information is currently available.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Technology Sections */}
      {!isLoading && !error && transformedTechnologies.length > 0 && (
        <>
          {transformedTechnologies.map((tech, index) => {
            console.log(`[SimpleTechnologyPage] Rendering TechnologySection for '${tech.title}'`, {
              id: tech.id,
              summary: tech.summary,
              summaryLength: tech.summary?.length || 0,
              hasSummary: Boolean(tech.summary),
              image: tech.image
            });
            
            return (
              <TechnologySection
                key={tech.id}
                id={tech.id}
                title={tech.title}
                summary={tech.summary}
                bulletPoints={tech.bulletPoints}
                image={tech.image}
                index={index}
                className={index === 0 ? 'pt-0' : ''}
              />
            );
          })}
        </>
      )}

      {/* Contact Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
