
import React from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySection from '@/components/technology/TechnologySection';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import { useIsFetching } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const SimpleTechnologyPage = () => {
  const technologies = useTechnologySections();
  const isFetching = useIsFetching(['technologies']) > 0;

  return (
    <Layout>
      {/* Hero Section */}
      <TechnologyHeroSimple />

      {/* Loading State */}
      {isFetching && (
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
      {technologies.length === 0 && !isFetching && (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertDescription>
              We're having trouble loading technology information. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Technology Sections */}
      {!isFetching && technologies.length > 0 && (
        <>
          {technologies.map((tech, index) => (
            <TechnologySection
              key={tech.id}
              id={tech.id}
              title={tech.title}
              description={tech.description}
              features={tech.features}
              image={tech.image}
              index={index}
            />
          ))}
        </>
      )}

      {/* Contact Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
