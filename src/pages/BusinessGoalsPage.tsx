import React from 'react';
import Layout from '@/components/layout/Layout';
import { useContentfulBusinessGoals } from '@/hooks/cms/useContentfulBusinessGoals';
import { useBusinessGoalsPageContent } from '@/hooks/cms/useBusinessGoalsPageContent';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import PageHero from '@/components/common/PageHero';
import BusinessGoalsPurposeStatement from '@/components/businessGoals/BusinessGoalsPurposeStatement';
import BusinessGoalsGrid from '@/components/businessGoals/BusinessGoalsGrid';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import BusinessGoalInquiry from '@/components/businessGoals/BusinessGoalInquiry';
import BusinessGoalsDebugSection from '@/components/businessGoals/BusinessGoalsDebugSection';
import { Loader2 } from 'lucide-react';

const BUSINESS_GOALS_CONTENT_ID = "3z7Q1mcHEnk6S4YVCyaklz";

const BusinessGoalsPage: React.FC = () => {
  const { data: businessGoals, isLoading: goalsLoading, error: goalsError } = useContentfulBusinessGoals();
  const { data: pageContent, isLoading: contentLoading, error: contentError } = useBusinessGoalsPageContent(BUSINESS_GOALS_CONTENT_ID);
  const { data: testimonialSection } = useTestimonialSection('business-goals');
  
  const isLoading = goalsLoading || contentLoading;
  const error = goalsError || contentError;
  
  console.log('[BusinessGoalsPage] pageContent:', pageContent);
  
  if (isLoading && !pageContent && !businessGoals) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-vending-blue" />
          <span className="ml-3 text-xl">Loading page content...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero 
        pageKey="business-goals"
        fallbackTitle="Business Goals"
        fallbackSubtitle="Our comprehensive vending solutions help you achieve your business goals with powerful technology and customizable options."
        fallbackImage="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        fallbackImageAlt="Business Goals"
        fallbackPrimaryButtonText="Request a Demo"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="Explore Solutions"
        fallbackSecondaryButtonUrl="/products"
      />

      {pageContent && pageContent.introTitle && (
        <BusinessGoalsPurposeStatement 
          title={pageContent.introTitle} 
          description={pageContent.introDescription} 
        />
      )}

      <BusinessGoalsGrid 
        title={pageContent?.goalsSectionTitle || "Achieve Your Business Objectives"}
        description={pageContent?.goalsSectionDescription || "Transform your vending operations with solutions designed to meet specific business needs."}
        goals={businessGoals || []}
        isLoading={goalsLoading}
        error={goalsError || null}
      />

      {pageContent && pageContent.keyBenefitsTitle && pageContent.keyBenefits && pageContent.keyBenefits.length > 0 && (
        <BusinessGoalKeyBenefits 
          title={pageContent.keyBenefitsTitle}
          description={pageContent.keyBenefitsDescription}
          benefits={pageContent.keyBenefits}
        />
      )}

      {testimonialSection && (
        <TestimonialsSection data={testimonialSection} />
      )}

      <BusinessGoalInquiry 
        title={pageContent?.customSolutionTitle}
        description={pageContent?.customSolutionDescription}
        bulletPoints={pageContent?.inquiryBulletPoints}
        buttonText={pageContent?.customSolutionButtonText}
        buttonUrl={pageContent?.customSolutionButtonUrl}
      />

      <BusinessGoalsDebugSection 
        content={pageContent}
        isLoading={contentLoading}
        error={contentError}
      />
    </Layout>
  );
};

export default BusinessGoalsPage;
