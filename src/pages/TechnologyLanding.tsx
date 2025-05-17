
import React from 'react';
import { useContentfulTechnologies } from '@/hooks/cms/useContentfulTechnologies';
import { useContentfulTechnologyPageContent } from '@/hooks/cms/useContentfulTechnologyPageContent';
import TechnologyGrid from '@/components/technology/TechnologyGrid';
import TechnologyHero from '@/components/technology/TechnologyHero';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const TechnologyLanding: React.FC = () => {
  const { data: pageContent, isLoading: isLoadingContent } = useContentfulTechnologyPageContent();
  const { data: technologies, isLoading: isLoadingTech, error } = useContentfulTechnologies();

  if (isLoadingContent || isLoadingTech) {
    return (
      <div className="container mx-auto flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load technology content. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <TechnologyHero 
        title={pageContent?.heroTitle || "Our Technology"}
        description={pageContent?.heroDescription || "Discover how our cutting-edge technology revolutionizes the vending industry"}
        imageUrl={pageContent?.heroImage?.url || "/images/technology-hero.jpg"}
      />
      
      <div className="container mx-auto py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            {pageContent?.introTitle || "Innovative Solutions for Modern Vending"}
          </h2>
          <p className="text-gray-600">
            {pageContent?.introDescription || "Explore our range of technologies that power the next generation of vending machines."}
          </p>
        </div>
        
        <TechnologyGrid technologies={technologies || []} />
      </div>
    </div>
  );
};

export default TechnologyLanding;
