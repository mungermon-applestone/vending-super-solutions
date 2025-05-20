
import React from 'react';
import { useBusinessGoals } from '@/hooks/cms/useBusinessGoals';
import { useBusinessGoalsPageContent } from '@/hooks/cms/useBusinessGoalsPageContent';
import BusinessGoalsGrid from '@/components/businessGoals/BusinessGoalsGrid';
import { Spinner } from '@/components/ui/spinner';
import BusinessGoalsHero from '@/components/businessGoals/BusinessGoalsHero';
import BusinessGoalsPurposeStatement from '@/components/businessGoals/BusinessGoalsPurposeStatement';
import { ContactSection } from '@/components/common';
import BusinessGoalsPageSEO from '@/components/seo/BusinessGoalsPageSEO';

const BusinessGoals: React.FC = () => {
  const { data: businessGoals, isLoading, error } = useBusinessGoals();
  const { data: pageContent } = useBusinessGoalsPageContent();

  // SEO values
  const pageTitle = pageContent?.heroTitle || 'Business Goals | Applestone Solutions';
  const pageDescription = pageContent?.heroDescription || 
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
          <h2 className="text-red-800 font-medium text-lg">Error Loading Business Goals</h2>
          <p className="text-red-700 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  // Prepare hero content for BusinessGoalsHero
  const heroContent = {
    title: pageContent?.heroTitle || 'Achieve Your Business Goals',
    subtitle: pageContent?.heroDescription || 'Our vending solutions are designed to help you meet specific business objectives.',
    image: pageContent?.heroImage?.url ? {
      url: pageContent.heroImage.url,
      alt: 'Business Goals'
    } : undefined
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
        heading={pageContent?.introTitle || 'How We Help You Succeed'}
        content={pageContent?.introDescription || 'We understand the unique challenges of the vending industry and have tailored our solutions to address your specific business goals.'}
      />

      {/* Business Goals Grid */}
      <div className="container mx-auto py-12 px-4">
        <BusinessGoalsGrid 
          goals={businessGoals || []} 
          heading={pageContent?.sectionTitle || 'Select Your Business Goal'}
          description={pageContent?.sectionDescription || 'Click on any business goal to learn more about how we can help you achieve it.'}
        />
      </div>

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
