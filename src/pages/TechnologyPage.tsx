import React from 'react';
import TechnologySections from '@/components/technology/TechnologySections';
import { useContentfulTechnologyPageContent } from '@/hooks/cms/useContentfulTechnologyPageContent';
import { useContentfulTechnologySections } from '@/hooks/cms/useContentfulTechnologySections';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Bug } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { ContactSection } from '@/components/common';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';
import SEO from '@/components/seo/SEO';
import TranslatableText from '@/components/translation/TranslatableText';

// Fallback content for when Contentful is not configured
const fallbackPageContent = {
  // Hero fields
  heroTitle: "Our Technology Platform",
  heroDescription: "Powerful, reliable, and secure technology solutions designed specifically for the vending industry",
  heroImage: undefined,
  heroPrimaryButtonText: "Request a Demo", 
  heroPrimaryButtonUrl: "/contact",
  heroSecondaryButtonText: "Explore Features",
  heroSecondaryButtonUrl: "#features",
  
  // Original content fields
  introTitle: "Vending Technology Platform",
  introDescription: "Our comprehensive technology platform enables vending operators to manage their operations efficiently and effectively."
};

const TechnologyPage = () => {
  const { data: pageContent, isLoading: isLoadingContent, error: contentError } = useContentfulTechnologyPageContent();
  const { data: sections = [], isLoading: isLoadingSections, error: sectionsError } = useContentfulTechnologySections();
  const { data: testimonialSection, isLoading: isLoadingTestimonials, error: testimonialError } = useTestimonialSection('technology');

  // Use either the fetched content or fallback content
  const displayContent = pageContent || fallbackPageContent;

  // Generate page title and description for SEO
  const pageTitle = displayContent?.introTitle 
    ? `${displayContent.introTitle} | Applestone Solutions` 
    : 'Vending Technology Platform | Applestone Solutions';
  const pageDescription = displayContent?.introDescription || 
    'Our comprehensive technology platform enables vending operators to manage their operations efficiently and effectively.';

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
            <AlertTitle>
              <TranslatableText context="technology-page">Error Loading Content</TranslatableText>
            </AlertTitle>
            <AlertDescription>
              <TranslatableText context="technology-page">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </TranslatableText>
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Add SEO component */}
      <SEO 
        title={pageTitle}
        description={pageDescription}
        canonicalUrl="https://applestonesolutions.com/technology"
        type="website"
        openGraph={{
          title: pageTitle,
          description: pageDescription,
          url: 'https://applestonesolutions.com/technology',
          type: 'website'
        }}
      />
      
      {/* Hero Section */}
      <TechnologyPageHero />
      
      <div className="container mx-auto px-4 py-8">
        {displayContent && (
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <TranslatableText context="technology-page">{displayContent.introTitle}</TranslatableText>
            </h1>
            {displayContent.introDescription && (
              <p className="text-lg text-muted-foreground">
                <TranslatableText context="technology-page">{displayContent.introDescription}</TranslatableText>
              </p>
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
        
        {/* Update ContactSection with standardized title and description */}
        <ContactSection
          title="Ready to Get Started?"
          description="Get in touch and we'll start you on your vending journey."
          formType="Technology Page Inquiry"
          formVariant="compact"
        />
      </div>
    </>
  );
};

export default TechnologyPage;
