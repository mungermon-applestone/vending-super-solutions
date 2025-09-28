
import React from 'react';
import { useContentfulTechnologyPageContent, TechnologyPageContent } from '@/hooks/cms/useContentfulTechnologyPageContent';
import ContentfulHero from '@/components/contentful/ContentfulHero';
import TranslatableText from '@/components/translation/TranslatableText';
import { useTranslatedCMSContent } from '@/hooks/useTranslatedCMSContent';

interface TechnologyPageHeroProps {
  entryId?: string;
}

const TechnologyPageHero: React.FC<TechnologyPageHeroProps> = ({ entryId }) => {
  const { data: pageContent, isLoading, error } = useContentfulTechnologyPageContent();

  // Fallback hero content
  const fallbackHero = {
    title: "Our Technology Platform",
    description: "Powerful, reliable, and secure technology solutions designed specifically for the vending industry",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    altText: "Technology Platform",
    primaryButtonText: "Request a Demo",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Explore Features",
    secondaryButtonUrl: "#features"
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
    console.log('[TechnologyPageHero] Using fallback hero content', { error, hasPageContent: !!pageContent });
    
    return (
      <ContentfulHero
        title={<TranslatableText context="technology-hero">{fallbackHero.title}</TranslatableText>}
        description={<TranslatableText context="technology-hero">{fallbackHero.description}</TranslatableText>}
        image={fallbackHero.image}
        altText={<TranslatableText context="technology-hero">{fallbackHero.altText}</TranslatableText>}
        primaryButtonText={<TranslatableText context="technology-hero">{fallbackHero.primaryButtonText}</TranslatableText>}
        primaryButtonUrl={fallbackHero.primaryButtonUrl}
        secondaryButtonText={<TranslatableText context="technology-hero">{fallbackHero.secondaryButtonText}</TranslatableText>}
        secondaryButtonUrl={fallbackHero.secondaryButtonUrl}
      />
    );
  }

  // Translate the Contentful content
  const { translatedContent } = useTranslatedCMSContent(pageContent, 'technology-hero');

  return (
    <ContentfulHero
      title={translatedContent?.heroTitle || pageContent.heroTitle}
      description={translatedContent?.heroDescription || pageContent.heroDescription}
      image={pageContent.heroImage?.fields?.file?.url}
      altText={translatedContent?.heroImage?.fields?.title || pageContent.heroImage?.fields?.title || "Technology"}
      primaryButtonText={translatedContent?.heroPrimaryButtonText || pageContent.heroPrimaryButtonText}
      primaryButtonUrl={pageContent.heroPrimaryButtonUrl}
      secondaryButtonText={translatedContent?.heroSecondaryButtonText || pageContent.heroSecondaryButtonText}
      secondaryButtonUrl={pageContent.heroSecondaryButtonUrl}
    />
  );
};

export default TechnologyPageHero;
