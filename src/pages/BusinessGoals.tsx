
import React from 'react';
import { useBusinessGoals } from '@/hooks/cms/useBusinessGoals';
import { useBusinessGoalsPageContent } from '@/hooks/cms/useBusinessGoalsPageContent';
import BusinessGoalsGrid from '@/components/businessGoals/BusinessGoalsGrid';
import { Spinner } from '@/components/ui/spinner';
import BusinessGoalsHero from '@/components/businessGoals/BusinessGoalsHero';
import BusinessGoalsPurposeStatement from '@/components/businessGoals/BusinessGoalsPurposeStatement';
import { ContactSection } from '@/components/common';
import BusinessGoalsPageSEO from '@/components/seo/BusinessGoalsPageSEO';
import { useTranslatedCMSContent } from '@/hooks/useTranslatedCMSContent';
import TranslatableText from '@/components/translation/TranslatableText';

const BusinessGoals: React.FC = () => {
  const { data: businessGoals, isLoading, error } = useBusinessGoals();
  const { data: pageContent } = useBusinessGoalsPageContent();
  const { translatedContent: translatedPageContent } = useTranslatedCMSContent(pageContent, 'business-goals-page');

  // SEO values with fallbacks
  const pageTitle = translatedPageContent?.heroTitle || pageContent?.heroTitle || 'Business Goals | Applestone Solutions';
  const pageDescription = translatedPageContent?.heroDescription || pageContent?.heroDescription || 
    'Discover how our vending solutions can help you achieve your business goals.';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96 py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h2 className="text-red-800 font-medium text-lg">
            <TranslatableText context="business-goals">Error Loading Business Goals</TranslatableText>
          </h2>
          <p className="text-red-700 mt-2">
            <TranslatableText context="business-goals">{error.message}</TranslatableText>
          </p>
        </div>
      </div>
    );
  }

  // Prepare hero content for BusinessGoalsHero with safe property access
  const displayContent = translatedPageContent || pageContent;
  const heroContent = {
    title: displayContent?.heroTitle || "Achieve Your Business Goals",
    subtitle: displayContent?.heroDescription || "Our vending solutions are designed to help you meet specific business objectives.",
    imageUrl: displayContent?.heroImage ? `https:${displayContent.heroImage.fields?.file?.url}` : undefined,
    imageAlt: 'Business Goals'
  };

  return (
    <>
      {/* Add SEO component */}
      <BusinessGoalsPageSEO 
        businessGoals={businessGoals}
        title={pageTitle}
        description={pageDescription}
      />
      
      {/* Hero Section */}
      <BusinessGoalsHero heroContent={heroContent} />
      
      {/* Purpose Statement */}
      <BusinessGoalsPurposeStatement 
        heading={displayContent?.introTitle || "How We Help You Succeed"}
        content={displayContent?.introDescription || "We understand the unique challenges of the vending industry and have tailored our solutions to address your specific business goals."}
      />

      {/* Business Goals Grid - no header displayed */}
      <BusinessGoalsGrid 
        goals={businessGoals || []} 
        title={displayContent?.goalsSectionTitle || "Select Your Business Goal"}
        description={displayContent?.goalsSectionDescription || "Click on any business goal to learn more about how we can help you achieve it."}
        compactView={true}
        columnCount={3}
      />

      {/* Contact Section */}
      <ContactSection 
        title="Ready to Get Started?"
        description="Get in touch and we'll start you on your vending journey."
        formType="Business Goals Page Inquiry"
      />
    </>
  );
};

export default BusinessGoals;
