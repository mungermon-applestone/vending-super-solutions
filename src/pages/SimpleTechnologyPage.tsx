
import React from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySection from '@/components/technology/TechnologySection';
import { useContentfulTechnology } from '@/hooks/cms/useContentfulTechnology';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import CTASection from '@/components/common/CTASection';

const SimpleTechnologyPage = () => {
  const { data: technologies = [], isLoading, error } = useContentfulTechnology();
  
  // Use the first technology entry for the hero section
  const mainTechnology = technologies[0];
  
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

  return (
    <Layout>
      <TechnologyHeroSimple
        title={mainTechnology.title}
        description={mainTechnology.description}
        imageUrl={mainTechnology.image?.url}
        imageAlt={mainTechnology.image?.alt || mainTechnology.title}
      />
      
      {mainTechnology.sections?.map((section, index) => (
        <TechnologySection
          key={section.id}
          id={section.id}
          title={section.title}
          summary={section.description || ''}
          bulletPoints={section.bulletPoints || []}
          image={section.sectionImage?.fields?.file?.url || ''}
          index={index}
        />
      ))}
      
      <CTASection />
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
