import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySections from '@/components/technology/TechnologySections';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import CTASection from '@/components/common/CTASection';
import { SimpleContactCTA } from '@/components/common';

const TechnologyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { technology, isLoading, error } = useTechnologyData(slug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <div className="animate-pulse rounded-md bg-gray-200 h-8 w-1/4 mx-auto mb-4"></div>
          <div className="animate-pulse rounded-md bg-gray-200 h-4 w-1/2 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (error || !technology) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Technology Not Found</h2>
          <p>We couldn't find the technology information you're looking for.</p>
          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TechnologyHeroSimple
        title={technology.title}
        description={technology.description}
        imageUrl={technology.image_url}
        imageAlt={technology.image_alt || technology.title}
      />
      
      {technology.sections && technology.sections.length > 0 && (
        <TechnologySections sections={technology.sections} />
      )}
      
      <SimpleContactCTA />
      <CTASection />
    </Layout>
  );
};

export default TechnologyDetail;
