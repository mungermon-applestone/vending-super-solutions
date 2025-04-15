
import React from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySection from '@/components/technology/TechnologySection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import CTASection from '@/components/common/CTASection';
import useTechnologySections from '@/hooks/useTechnologySections';

const SimpleTechnologyPage = () => {
  // Use the custom hook to fetch technology data
  const { technologies = [], isLoading, error } = useTechnologySections();
  
  // Use the first technology entry for the page
  const mainTechnology = technologies[0];
  
  console.log('Technologies from hook:', technologies);
  console.log('Main technology:', mainTechnology);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-32 w-3/4 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load technology information'}
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!mainTechnology) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Alert>
            <AlertDescription>
              No technology information available.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  // Helper function to safely get image URL
  const getImageUrl = (image: any): string => {
    if (!image) return '';
    
    if (typeof image === 'string') {
      return image;
    }
    
    if (image.url) {
      return image.url;
    }
    
    return '';
  };

  console.log('Sections available:', mainTechnology.sections);
  
  return (
    <Layout>
      <TechnologyHeroSimple
        title={mainTechnology.title}
        description={mainTechnology.description}
        imageUrl={getImageUrl(mainTechnology.image)}
        imageAlt={mainTechnology.image?.alt || mainTechnology.title}
      />
      
      {mainTechnology.sections && mainTechnology.sections.length > 0 ? (
        <div className="pb-12">
          {mainTechnology.sections.map((section, index) => {
            console.log('Rendering section:', section);
            
            // Get section image URL safely
            const sectionImageUrl = getImageUrl(section.sectionImage);
            
            return (
              <TechnologySection
                key={section.id || `section-${index}`}
                id={section.id || `section-${index}`}
                title={section.title || ''}
                summary={section.summary || section.description || ''}
                bulletPoints={section.bulletPoints || []}
                image={sectionImageUrl}
                index={index}
              />
            );
          })}
        </div>
      ) : (
        <div className="container mx-auto py-12 text-center">
          <Alert>
            <AlertDescription>
              No technology sections available.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <CTASection />
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
