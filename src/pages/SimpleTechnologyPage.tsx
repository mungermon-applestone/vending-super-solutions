import React, { useEffect } from 'react';
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
import { CMSTechnology } from '@/types/cms';

// Helper function to transform CMSTechnology data to the format expected by TechnologySection
const mapTechnologyData = (tech: CMSTechnology) => {
  // Extract features from technology sections if available
  const features: TechFeature[] = tech.sections?.[0]?.features?.map(feature => ({
    icon: feature.icon || 'server',
    title: feature.title || '',
    description: feature.description || '',
    items: feature.items?.map(item => item.text) || []
  })) || [];

  // Get the description/summary from the most reliable source
  let summary = '';
  
  // Try all possible sources for the summary text, in order of reliability
  if (typeof tech.description === 'string' && tech.description.trim() !== '') {
    summary = tech.description;
    console.log(`[mapTechnologyData] Using tech.description for ${tech.title}:`, tech.description);
  } 
  else if (tech.sections?.[0]?.description && typeof tech.sections[0].description === 'string' && tech.sections[0].description.trim() !== '') {
    summary = tech.sections[0].description;
    console.log(`[mapTechnologyData] Using tech.sections[0].description for ${tech.title}:`, tech.sections[0].description);
  }
  else if (tech.summary && typeof tech.summary === 'string' && tech.summary.trim() !== '') {
    summary = tech.summary;
    console.log(`[mapTechnologyData] Using tech.summary for ${tech.title}:`, tech.summary);
  }
  else {
    console.log(`[mapTechnologyData] No valid summary found for ${tech.title}. Checking all possible sources:`, {
      'tech.description': tech.description,
      'tech.sections[0]?.description': tech.sections?.[0]?.description,
      'tech.summary': tech.summary
    });
    
    // As a last resort, use a default message
    summary = `Learn more about our ${tech.title} technology solution.`;
  }
  
  console.log(`[mapTechnologyData] Final summary for '${tech.title}':`, {
    value: summary,
    length: summary.length,
    type: typeof summary
  });
  
  // Extract bullet points if available
  const bulletPoints = tech.sections?.[0]?.bulletPoints || [];

  // Extract image URL from the technology or its sections with proper fallbacks
  const imageUrl = 
    (tech.image_url) || 
    (tech.image && typeof tech.image === 'object' && tech.image.url) ||
    (tech.image && typeof tech.image === 'string' ? tech.image : '') ||
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

  // Log the transformed technologies to help debug the summary issue
  useEffect(() => {
    if (transformedTechnologies.length > 0) {
      console.log("[SimpleTechnologyPage] Transformed Technologies:", transformedTechnologies);
      transformedTechnologies.forEach(tech => {
        console.log(`[SimpleTechnologyPage] Tech '${tech.title}' summary:`, {
          summary: tech.summary,
          summaryType: typeof tech.summary,
          summaryLength: tech.summary?.length || 0,
          hasSummaryContent: !!tech.summary && tech.summary.trim() !== ''
        });
      });
    } else {
      console.log("[SimpleTechnologyPage] No technologies to transform");
    }
  }, [transformedTechnologies]);

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
          {transformedTechnologies.map((tech, index) => {
            console.log(`[SimpleTechnologyPage] Rendering TechnologySection for '${tech.title}'`, {
              id: tech.id,
              summary: tech.summary,
              summaryLength: tech.summary?.length || 0,
              hasSummary: Boolean(tech.summary),
              image: tech.image
            });
            
            return (
              <TechnologySection
                key={tech.id}
                id={tech.id}
                title={tech.title}
                summary={tech.summary || ""}
                bulletPoints={tech.bulletPoints}
                image={tech.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
                index={index}
                className={index === 0 ? 'pt-0' : ''}
              />
            );
          })}
        </>
      )}

      {/* Contact Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
