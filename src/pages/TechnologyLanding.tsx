
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import TechnologyHero from '@/components/technology/TechnologyHero';
import TechnologySections from '@/components/technology/TechnologySections';

const TechnologyLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const techSlug = slug || 'enterprise-platform'; // Default to main technology page if no slug provided
  
  const { 
    technology, 
    isLoading, 
    isError,
    error 
  } = useTechnologyData(techSlug);

  return (
    <Layout>
      {isLoading ? (
        <div className="container max-w-7xl py-12">
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      ) : isError ? (
        <div className="container max-w-7xl py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load technology data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      ) : technology ? (
        <>
          <TechnologyHero technology={technology} />
          <TechnologySections technology={technology} />
        </>
      ) : (
        <div className="container max-w-7xl py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>
              The requested technology page could not be found.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Layout>
  );
};

export default TechnologyLanding;
