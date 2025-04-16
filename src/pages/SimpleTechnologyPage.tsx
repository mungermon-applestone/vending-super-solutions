
import React from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySection from '@/components/technology/TechnologySection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import CTASection from '@/components/common/CTASection';
import useTechnologySections from '@/hooks/useTechnologySections';
import { CMSImage } from '@/types/cms';

const SimpleTechnologyPage = () => {
  // Use the custom hook to fetch technology data
  const { technologies = [], isLoading, error } = useTechnologySections();
  
  // Use the first technology entry for the page
  const mainTechnology = technologies[0];
  
  console.log('Technologies from hook:', technologies);
  console.log('Main technology:', mainTechnology);
  
  // Helper function to safely get image URL and alt
  const getImageProps = (image: string | CMSImage | undefined): { url: string; alt: string } => {
    if (!image) return { url: '', alt: '' };
    
    if (typeof image === 'string') {
      return { 
        url: image, 
        alt: 'Technology image' 
      };
    }
    
    // If it's a CMSImage object
    return {
      url: image.url || '',
      alt: image.alt || 'Technology image'
    };
  };

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

  console.log('Sections available:', mainTechnology.sections);
  
  // Get hero image props
  const heroImageProps = getImageProps(mainTechnology.image);
  
  return (
    <Layout>
      <TechnologyHeroSimple
        title={mainTechnology.title}
        description={mainTechnology.description}
        imageUrl={heroImageProps.url}
        imageAlt={heroImageProps.alt}
      />
      
      {mainTechnology.sections && mainTechnology.sections.length > 0 ? (
        <div className="pb-12">
          {mainTechnology.sections.map((section, index) => {
            console.log('Rendering section:', section);
            
            // Get section image properly
            const sectionImage = section.sectionImage || section.image;
            const imageProps = getImageProps(sectionImage);
            
            return (
              <TechnologySection
                key={section.id || `section-${index}`}
                id={section.id || `section-${index}`}
                title={section.title || ''}
                summary={section.summary || section.description || ''}
                bulletPoints={section.bulletPoints || []}
                image={imageProps.url} // Just pass the URL string, not the object
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
