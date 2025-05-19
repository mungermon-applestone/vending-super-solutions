
import React from 'react';
import { MachinesPageContent } from '@/hooks/cms/useMachinesPageContent';
import ContentfulHero from '@/components/contentful/ContentfulHero';

interface MachinesHeroProps {
  pageContent?: MachinesPageContent;
  isLoading?: boolean;
  error?: unknown;
}

const MachinesHero: React.FC<MachinesHeroProps> = ({ 
  pageContent,
  isLoading,
  error
}) => {
  // Fallback hero content
  const fallbackHero = {
    title: "Our Machines",
    description: "Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs.",
    image: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c",
    altText: "Various vending machines",
    primaryButtonText: "Vending Machines",
    primaryButtonUrl: "#vending-machines",
    secondaryButtonText: "Smart Lockers",
    secondaryButtonUrl: "#smart-lockers"
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 bg-slate-50">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-200 rounded w-3/4 max-w-lg mx-auto"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2 max-w-md mx-auto"></div>
          <div className="flex justify-center gap-4 mt-6">
            <div className="h-10 bg-slate-200 rounded w-32"></div>
            <div className="h-10 bg-slate-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pageContent || !pageContent.heroTitle) {
    console.log('[MachinesHero] Using fallback hero content', { error, hasPageContent: !!pageContent });
    
    return (
      <ContentfulHero
        title={fallbackHero.title}
        description={fallbackHero.description}
        image={fallbackHero.image}
        altText={fallbackHero.altText}
        primaryButtonText={fallbackHero.primaryButtonText}
        primaryButtonUrl={fallbackHero.primaryButtonUrl}
        secondaryButtonText={fallbackHero.secondaryButtonText}
        secondaryButtonUrl={fallbackHero.secondaryButtonUrl}
      />
    );
  }

  return (
    <ContentfulHero
      title={pageContent.heroTitle}
      description={pageContent.heroDescription}
      image={pageContent.heroImage?.fields?.file?.url}
      altText={pageContent.heroImage?.fields?.title || "Machines"}
      primaryButtonText={pageContent.heroPrimaryButtonText}
      primaryButtonUrl={pageContent.heroPrimaryButtonUrl}
      secondaryButtonText={pageContent.heroSecondaryButtonText}
      secondaryButtonUrl={pageContent.heroSecondaryButtonUrl}
    />
  );
};

export default MachinesHero;
