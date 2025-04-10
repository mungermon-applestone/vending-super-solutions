
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import TechnologyHero from '@/components/technology/TechnologyHero';
import TechnologySections from '@/components/technology/TechnologySections';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getTechnologies } from '@/services/cms';
import { CMSTechnology } from '@/types/cms';
import InquiryForm from '@/components/machines/contact/InquiryForm';

const TechnologyLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // If slug is provided, fetch the specific technology
  const { 
    technology, 
    isLoading: isSingleLoading, 
    isError: isSingleError,
    error: singleError 
  } = useTechnologyData(slug || '');

  // If no slug is provided, fetch all technologies
  const {
    data: allTechnologies,
    isLoading: isAllLoading,
    isError: isAllError,
    error: allError
  } = useQuery<CMSTechnology[]>({
    queryKey: ['technologies'],
    queryFn: getTechnologies,
    enabled: !slug // Only run this query when no slug is provided
  });

  // Show loading state
  if ((slug && isSingleLoading) || (!slug && isAllLoading)) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  // Show error state
  if ((slug && isSingleError) || (!slug && isAllError)) {
    return (
      <Layout>
        <div className="container max-w-7xl py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load technology data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  // If a specific technology is requested and found, show that technology
  if (slug && technology) {
    return (
      <Layout>
        <TechnologyHero technology={technology} />
        <TechnologySections technology={technology} />
        {/* Inquiry Form */}
        <InquiryForm title={`${technology.title} Technology`} />
      </Layout>
    );
  }

  // If no specific technology is requested, show a list of all technologies
  return (
    <Layout>
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="container max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Technology Platform</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
            Explore our suite of enterprise-grade technologies designed to streamline operations and enhance your business.
          </p>
        </div>
      </div>
      
      <div className="container max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTechnologies && allTechnologies.length > 0 ? (
            allTechnologies.map(tech => (
              <Card key={tech.id} className="overflow-hidden">
                <div className="h-40 bg-slate-100 relative">
                  {tech.image_url ? (
                    <img 
                      src={tech.image_url} 
                      alt={tech.image_alt || tech.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-r from-slate-200 to-slate-300">
                      <span className="text-slate-500 text-xl font-medium">{tech.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{tech.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{tech.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/technology/${tech.slug}`}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">No technologies found</h3>
              <p className="text-muted-foreground mt-2">Please check back later for updates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default TechnologyLanding;
