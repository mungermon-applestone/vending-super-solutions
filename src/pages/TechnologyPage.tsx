
import React from 'react';
import TechnologySections from '@/components/technology/TechnologySections';
import { useContentfulTechnologyPageContent } from '@/hooks/cms/useContentfulTechnologyPageContent';
import { useContentfulTechnologySections } from '@/hooks/cms/useContentfulTechnologySections';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { SimpleContactCTA } from '@/components/common';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';

// Content ID for the technology hero section
const TECHNOLOGY_HERO_ENTRY_ID = '66FG7FxpIy3YkSXj2mu846';

const TechnologyPage = () => {
  const { data: pageContent, isLoading: isLoadingContent, error: contentError } = useContentfulTechnologyPageContent();
  const { data: sections = [], isLoading: isLoadingSections, error: sectionsError } = useContentfulTechnologySections();
  const { data: testimonialSection, isLoading: isLoadingTestimonials, error: testimonialError } = useTestimonialSection('technology');

  if (isLoadingContent || isLoadingSections) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-24 w-full mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-8">
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (contentError || sectionsError) {
    const error = contentError || sectionsError;
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Content</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <TechnologyPageHero entryId={TECHNOLOGY_HERO_ENTRY_ID} />
      
      <div className="container mx-auto px-4 py-8">
        {pageContent && (
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{pageContent.introTitle}</h1>
            {pageContent.introDescription && (
              <p className="text-lg text-muted-foreground">{pageContent.introDescription}</p>
            )}
          </div>
        )}

        {process.env.NODE_ENV === 'development' && (
          <Alert className="mb-8">
            <Bug className="h-4 w-4" />
            <AlertTitle>Debug Information</AlertTitle>
            <AlertDescription>
              <pre className="mt-2 p-2 bg-slate-50 rounded text-sm">
                {JSON.stringify({ pageContent, sectionsCount: sections.length }, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        <TechnologySections sections={sections} />
        
        {/* Add ContentfulTestimonialsCarousel */}
        <ContentfulTestimonialsCarousel 
          data={testimonialSection} 
          isLoading={isLoadingTestimonials}
          error={testimonialError}
        />
        
        {/* Replace InquiryForm with SimpleContactCTA */}
        <SimpleContactCTA title="Ready to transform your vending operations?" />
      </div>
    </>
  );
};

export default TechnologyPage;
