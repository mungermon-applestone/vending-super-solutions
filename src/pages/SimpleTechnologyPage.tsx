import React from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySection from '@/components/technology/TechnologySection';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import { useIsFetching } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { TechFeature } from '@/types/technology';
import { AlertTriangle } from 'lucide-react';

// Helper function to transform CMSTechnology data to the format expected by TechnologySection
const mapTechnologyData = (tech) => {
  // Extract features from technology sections if available
  const features: TechFeature[] = tech.sections?.[0]?.features?.map(feature => ({
    icon: feature.icon || 'server',
    title: feature.title || '',
    description: feature.description || '',
    items: feature.items?.map(item => item.text) || []
  })) || [];

  // According to the Contentful schema, the main description is stored in the "description" field
  // Make sure we extract this value and use it as the summary
  const summary = tech.description || '';
  
  console.log(`Processing tech '${tech.title}' with title: '${tech.title}'`);
  console.log(`Processing tech '${tech.title}' with description field: '${summary}'`);
  
  // Extract bullet points if available
  const bulletPoints = tech.sections?.[0]?.bulletPoints || [];

  // Extract image URL from the technology or its sections with proper fallbacks
  const imageUrl = 
    // Check for direct image_url
    (tech.image_url) || 
    // Check for image object with url property
    (tech.image && typeof tech.image === 'object' && tech.image.url) ||
    // Check for string image
    (tech.image && typeof tech.image === 'string' ? tech.image : '') ||
    // Check for section images
    (tech.sections?.[0]?.sectionImage?.url) ||
    (tech.sections?.[0]?.image?.url) ||
    (tech.sections?.[0]?.images?.[0]?.url) ||
    '';

  return {
    id: tech.id,
    title: tech.title,
    summary: summary,
    bulletPoints: bulletPoints,
    features: features,
    image: imageUrl
  };
};

const SimpleTechnologyPage = () => {
  const { technologies = [], isLoading, error } = useTechnologySections({
    enableToasts: true
  });
  const isFetching = useIsFetching({ queryKey: ['technologies'] }) > 0;

  // Transform technology data for rendering
  const transformedTechnologies = technologies.map(mapTechnologyData);

  console.log("Transformed Technologies:", transformedTechnologies);

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
          {transformedTechnologies.map((tech, index) => (
            <TechnologySection
              key={tech.id}
              id={tech.id}
              title={tech.title}
              summary={tech.summary}
              bulletPoints={tech.bulletPoints}
              image={tech.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
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
