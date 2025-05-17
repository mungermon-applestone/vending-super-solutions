
import React from "react";
import { useContentfulTechnologies } from "@/hooks/cms/useContentfulTechnologies";
import TechnologyGrid from "@/components/technology/TechnologyGrid";
import { useContentfulPageByKey } from "@/hooks/cms/useContentfulPageByKey";
import ContentfulErrorBoundary from "@/components/common/ContentfulErrorBoundary";
import ContentfulHero from "@/components/contentful/ContentfulHero";
import ContentfulFallbackMessage from "@/components/common/ContentfulFallbackMessage";
import { CMSTechnology } from "@/types/cms";

/**
 * Technology landing page component
 * Fetches technologies from Contentful and displays them in a grid
 */
const TechnologyLanding: React.FC = () => {
  const { 
    data: technologies = [], 
    isLoading: isLoadingTech, 
    error: techError 
  } = useContentfulTechnologies();
  
  const { 
    data: pageContent, 
    isLoading: isLoadingContent, 
    error: contentError 
  } = useContentfulPageByKey("technology");

  const isLoading = isLoadingTech || isLoadingContent;
  const error = techError || contentError;

  // Ensure we have a valid array for technologies
  const technologiesArray: CMSTechnology[] = Array.isArray(technologies) ? technologies : [];

  return (
    <ContentfulErrorBoundary contentType="technology page">
      <div className="container mx-auto py-8">
        {error ? (
          <ContentfulFallbackMessage
            title="Error loading technology content"
            message={error.message}
            contentType="technology"
          />
        ) : (
          <>
            {pageContent && (
              <ContentfulHero 
                title={pageContent.introTitle}
                description={pageContent.introDescription}
                image={pageContent.heroImage?.url}
                altText={pageContent.heroImage?.alt}
              />
            )}

            <section className="py-12">
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-4">Our Technologies</h2>
                <p className="text-xl text-gray-600">
                  Explore our innovative technologies that power modern vending solutions.
                </p>
              </div>
              
              <TechnologyGrid 
                technologies={technologiesArray} 
                isLoading={isLoading} 
                error={error}
              />
            </section>
          </>
        )}
      </div>
    </ContentfulErrorBoundary>
  );
};

export default TechnologyLanding;
