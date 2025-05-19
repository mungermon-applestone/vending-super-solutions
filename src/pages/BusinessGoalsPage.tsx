
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

const BUSINESS_GOALS_CONTENT_ID = "3z7Q1mcHEnk6S4YVCyaklz";

// Fallback data for when Contentful is not configured
const fallbackBusinessGoals = [
  {
    id: "expand-footprint",
    slug: "expand-footprint",
    title: "Expand Footprint",
    description: "Grow your business with scalable vending solutions that adapt to various locations and needs.",
    visible: true,
    icon: "vending",
    benefits: ["Increase revenue streams", "Access new markets", "Scale without physical storefronts"],
    features: []
  },
  {
    id: "bopis",
    slug: "bopis",
    title: "Buy Online, Pickup In Store (BOPIS)",
    description: "Enable customers to order ahead and collect purchases from your vending machines.",
    visible: true,
    icon: "vending",
    benefits: ["Boost conversion rates", "Improve customer experience", "Reduce abandonment"],
    features: []
  },
  {
    id: "marketing",
    slug: "marketing",
    title: "Marketing & Promotions",
    description: "Drive sales with targeted promotions, digital advertising, and customer loyalty programs.",
    visible: true,
    icon: "vending",
    benefits: ["Increase customer engagement", "Drive repeat business", "Build brand loyalty"],
    features: []
  },
  {
    id: "data",
    slug: "data",
    title: "Data & Analytics",
    description: "Leverage powerful insights to optimize your inventory, pricing, and machine placement.",
    visible: true,
    icon: "vending",
    benefits: ["Make data-driven decisions", "Optimize inventory management", "Increase operational efficiency"],
    features: []
  },
  {
    id: "fleet-management",
    slug: "fleet-management",
    title: "Fleet Management",
    description: "Efficiently manage your entire network of machines with centralized controls and monitoring.",
    visible: true,
    icon: "vending",
    benefits: ["Reduce downtime", "Streamline operations", "Monitor machine health remotely"],
    features: []
  },
  {
    id: "customer-satisfaction",
    slug: "customer-satisfaction",
    title: "Customer Satisfaction",
    description: "Enhance user experience with intuitive interfaces, reliable service, and modern payment options.",
    visible: true,
    icon: "vending",
    benefits: ["Improve customer loyalty", "Increase customer retention", "Build positive brand reputation"],
    features: []
  }
];

// Fallback page content
const fallbackPageContent = {
  introTitle: "Business Goals",
  introDescription: "Transform your business operations with innovative vending solutions designed to meet your specific objectives. Our technology enables you to expand your footprint, improve customer experiences, and drive revenue growth.",
  goalsSectionTitle: "Business Goals We Help You Achieve",
  goalsSectionDescription: "Explore how our vending solutions can help you reach your business objectives.",
  keyBenefitsTitle: "Key Benefits",
  keyBenefitsDescription: "Our solutions provide tangible benefits that drive business growth and improve operational efficiency.",
  keyBenefits: [
    "Increase revenue through expanded footprint",
    "Improve customer satisfaction with modern interfaces",
    "Gain valuable insights through comprehensive data analytics",
    "Reduce operational costs with efficient fleet management",
    "Enable new business models like BOPIS",
    "Drive customer engagement through targeted promotions"
  ],
  customSolutionTitle: "Need a Custom Solution?",
  customSolutionDescription: "Our team can help design a tailored solution to address your specific business requirements.",
  customSolutionButtonText: "Contact Us",
  customSolutionButtonUrl: "/contact",
  inquiryBulletPoints: [
    "Discuss your specific business goals",
    "Explore customized vending solutions",
    "Learn about integration options",
    "Get pricing information"
  ]
};

const BusinessGoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const isConfigured = isContentfulConfigured();
  const isPreview = isPreviewEnvironment();
  
  const { data: businessGoals, isLoading: goalsLoading, error: goalsError } = useContentfulBusinessGoals();
  const { data: pageContent, isLoading: contentLoading, error: contentError } = useBusinessGoalsPageContent(BUSINESS_GOALS_CONTENT_ID);
  const { data: testimonialSection, isLoading: isLoadingTestimonials, error: testimonialError } = useTestimonialSection('business-goals');
  
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
  
  // Use fallback content if Contentful is not configured
  const displayContent = isConfigured ? pageContent : fallbackPageContent;
  
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
