
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useBusinessGoalsPageContent } from '@/hooks/cms/useBusinessGoalsPageContent';
import { useContentfulBusinessGoals } from '@/hooks/cms/useContentfulBusinessGoals';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import BusinessGoalsPurposeStatement from '@/components/businessGoals/BusinessGoalsPurposeStatement';
import BusinessGoalsGrid from '@/components/businessGoals/BusinessGoalsGrid';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import ContactForm from '@/components/contact/ContactForm';
import BusinessGoalsDebugSection from '@/components/businessGoals/BusinessGoalsDebugSection';
import { Loader2 } from 'lucide-react';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { CONTENTFUL_CONFIG, isContentfulConfigured, isPreviewEnvironment } from '@/config/cms';
import ContentfulConfigWarning from '@/components/machines/ContentfulConfigWarning';
import PreviewEnvironmentDetector from '@/components/contentful/PreviewEnvironmentDetector';

const BUSINESS_GOALS_CONTENT_ID = "3z7Q1mcHEnk6S4YVCyaklz";
const HERO_CONTENT_ID = "4b40Npa9Hgp8jO0jDX98F6";

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
  const { data: heroContent, isLoading: heroLoading } = useHeroContent(HERO_CONTENT_ID);
  const { data: testimonialSection } = useTestimonialSection('business-goals');
  
  const isLoading = goalsLoading || contentLoading || heroLoading;
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
  }, [isConfigured, isPreview]);
  
  // Use fallback content if Contentful is not configured
  const displayContent = isConfigured ? pageContent : fallbackPageContent;
  const displayGoals = isConfigured ? businessGoals : fallbackBusinessGoals;
  
  if (isLoading && !displayContent && !displayGoals) {
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
      {/* Show preview environment warning when applicable */}
      <PreviewEnvironmentDetector />
      
      {!isConfigured && !isPreview && (
        <div className="container py-6">
          <ContentfulConfigWarning />
        </div>
      )}
      
      <TechnologyPageHero entryId={HERO_CONTENT_ID} />

      {displayContent && displayContent.introTitle && (
        <BusinessGoalsPurposeStatement 
          title={displayContent.introTitle} 
          description={displayContent.introDescription} 
        />
      )}

      {/* Add an indicator that we're using fallback data in preview mode */}
      {isPreview && !isConfigured && (
        <div className="container py-2">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md text-sm">
            Using fallback business goals data. Configure Contentful to see real content.
          </div>
        </div>
      )}

      <BusinessGoalsGrid 
        goals={displayGoals || []}
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

      {testimonialSection && (
        <TestimonialsSection data={testimonialSection} />
      )}

      {/* Standard contact form section */}
      <section className="py-16 bg-vending-blue-light bg-opacity-10">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-vending-blue-dark">Need Help With Your Business Goals?</h2>
                <p className="text-gray-700">
                  Our team is ready to assist you with achieving your specific business goals using our vending solutions.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {process.env.NODE_ENV === 'development' && (
        <BusinessGoalsDebugSection 
          content={pageContent}
          isLoading={contentLoading}
          error={contentError}
        />
      )}
    </Layout>
  );
};

export default BusinessGoalsPage;
