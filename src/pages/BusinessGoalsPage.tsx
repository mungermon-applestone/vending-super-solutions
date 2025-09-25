
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useBusinessGoalsPageContent } from '@/hooks/cms/useBusinessGoalsPageContent';
import { useContentfulBusinessGoals } from '@/hooks/cms/useContentfulBusinessGoals';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';
import BusinessGoalsPurposeStatement from '@/components/businessGoals/BusinessGoalsPurposeStatement';
import BusinessGoalsGrid from '@/components/businessGoals/BusinessGoalsGrid';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import BusinessGoalsDebugSection from '@/components/businessGoals/BusinessGoalsDebugSection';
import BusinessGoalsLoader from '@/components/businessGoals/BusinessGoalsLoader';
import BusinessGoalsFallbackNotice from '@/components/businessGoals/BusinessGoalsFallbackNotice';
import BusinessGoalsContactSection from '@/components/businessGoals/BusinessGoalsContactSection';
import BusinessGoalsHero from '@/components/businessGoals/BusinessGoalsHero';
import { CONTENTFUL_CONFIG, isContentfulConfigured, isPreviewEnvironment } from '@/config/cms';
import { useTranslatedCMSContent } from '@/hooks/useTranslatedCMSContent';
import TranslatableText from '@/components/translation/TranslatableText';
import { createTranslatableFallbackBusinessGoals, createTranslatableFallbackPageContent } from '@/utils/translationHelpers';

const BUSINESS_GOALS_CONTENT_ID = "3z7Q1mcHEnk6S4YVCyaklz";

// Use the helper functions to create fallback data
const fallbackBusinessGoals = createTranslatableFallbackBusinessGoals();
const fallbackPageContent = createTranslatableFallbackPageContent();

const BusinessGoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const isConfigured = isContentfulConfigured();
  const isPreview = isPreviewEnvironment();
  
  const { data: businessGoals, isLoading: goalsLoading, error: goalsError } = useContentfulBusinessGoals();
  const { data: pageContent, isLoading: contentLoading, error: contentError } = useBusinessGoalsPageContent(BUSINESS_GOALS_CONTENT_ID);
  const { data: testimonialSection, isLoading: isLoadingTestimonials, error: testimonialError } = useTestimonialSection('business-goals');
  
  // Apply translation to the page content
  const { translatedContent: translatedPageContent } = useTranslatedCMSContent(pageContent, 'business-goals-page');
  
  const isLoading = goalsLoading || contentLoading;
  const error = goalsError || contentError;

  // Check if contentful is configured
  useEffect(() => {
    // Log for debugging purposes
    console.log('[BusinessGoalsPage] Contentful configuration status:', {
      isConfigured, 
      isPreview,
      spaceId: CONTENTFUL_CONFIG.SPACE_ID?.length > 0,
      tokenConfigured: CONTENTFUL_CONFIG.DELIVERY_TOKEN?.length > 0
    });
    
    console.log('[BusinessGoalsPage] Business goals data:', {
      businessGoals,
      fallbackBusinessGoals,
      displayGoals: isConfigured ? businessGoals : fallbackBusinessGoals
    });

    // Log the hero content from the pageContent
    if (pageContent) {
      console.log('[BusinessGoalsPage] Hero content from pageContent:', {
        heroTitle: pageContent.heroTitle,
        heroDescription: pageContent.heroDescription,
        hasHeroImage: !!pageContent.heroImage,
      });
    }
  }, [isConfigured, isPreview, businessGoals, pageContent]);
  
  // Use fallback content if Contentful is not configured or no content available
  const displayContent = isConfigured ? (translatedPageContent || pageContent) : fallbackPageContent;
  
  // Always use fallbackBusinessGoals if Contentful is not configured or if businessGoals is empty
  const displayGoals = (isConfigured && businessGoals && businessGoals.length > 0) ? businessGoals : fallbackBusinessGoals;
  
  if (isLoading && !displayContent && !displayGoals) {
    return <BusinessGoalsLoader />;
  }

  // Extract hero content from pageContent
  const heroContent = displayContent ? {
    title: displayContent.heroTitle,
    subtitle: displayContent.heroDescription,
    image: displayContent.heroImage ? {
      url: displayContent.heroImage.fields?.file?.url,
      alt: displayContent.heroImage.fields?.title || "Business Goals"
    } : undefined,
    primaryButtonText: displayContent.heroPrimaryButtonText,
    primaryButtonUrl: displayContent.heroPrimaryButtonUrl,
    secondaryButtonText: displayContent.heroSecondaryButtonText,
    secondaryButtonUrl: displayContent.heroSecondaryButtonUrl
  } : null;

  return (
    <>
      {/* Pass hero content to BusinessGoalsHero */}
      <BusinessGoalsHero heroContent={heroContent} />
      
      {/* Show warning if using preview mode or fallback content */}
      <BusinessGoalsFallbackNotice isPreview={isPreview} isConfigured={isConfigured} />

      {displayContent && displayContent.introTitle && (
        <BusinessGoalsPurposeStatement 
          title={displayContent.introTitle} 
          description={displayContent.introDescription} 
        />
      )}

      <BusinessGoalsGrid 
        goals={displayGoals}
        isLoading={false}
        error={null}
        compactView={true}
        columnCount={4}
        ultraCompact={true}
      />

      {displayContent && displayContent.keyBenefitsTitle && displayContent.keyBenefits && displayContent.keyBenefits.length > 0 && (
        <BusinessGoalKeyBenefits 
          title={displayContent.keyBenefitsTitle}
          description={displayContent.keyBenefitsDescription}
          benefits={displayContent.keyBenefits}
        />
      )}

      {/* Use ContentfulTestimonialsCarousel for testimonials */}
      {testimonialSection && (
        <ContentfulTestimonialsCarousel 
          data={testimonialSection}
          isLoading={isLoadingTestimonials}
          error={testimonialError}
        />
      )}

      {/* Standard contact form section */}
      <BusinessGoalsContactSection />

      {process.env.NODE_ENV === 'development' && (
        <BusinessGoalsDebugSection 
          content={pageContent}
          isLoading={contentLoading}
          error={contentError}
        />
      )}
    </>
  );
};

export default BusinessGoalsPage;
