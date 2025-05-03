import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Loader2, Star } from 'lucide-react';
import { useBusinessGoal } from '@/hooks/cms/useBusinessGoal';
import { Button } from '@/components/ui/button';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalFeatures from '@/components/businessGoals/BusinessGoalFeatures';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import BusinessGoalInquiry from '@/components/businessGoals/BusinessGoalInquiry';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { redirectToCanonicalBusinessGoalIfNeeded } from '@/services/cms/utils/routeRedirector';

const BusinessGoalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Perform redirection if needed and scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (slug) {
      redirectToCanonicalBusinessGoalIfNeeded(slug);
    }
  }, [slug]);
  
  console.log("[BusinessGoalDetail] Rendering with slug:", slug);
  
  return (
    <Layout>
      <ContentfulErrorBoundary contentType="Business Goal Details">
        <BusinessGoalContent slug={slug} />
      </ContentfulErrorBoundary>
    </Layout>
  );
};

const BusinessGoalContent = ({ slug }: { slug: string | undefined }) => {
  const { data: businessGoal, isLoading, error, refetch } = useBusinessGoal(slug);

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading business goal information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <ContentfulFallbackMessage
            title="Error Loading Business Goal"
            message={error instanceof Error ? error.message : 'Failed to load business goal details'}
            contentType="businessGoal"
            actionText="Retry Loading"
            actionHref="#"
            onAction={() => refetch()}
            showAdmin={false}
          />
        </div>
      </div>
    );
  }

  if (!businessGoal) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <ContentfulFallbackMessage
            title="Business Goal Not Found"
            message={`We couldn't find the business goal "${slug}" in our database.`}
            contentType="businessGoal"
            actionText="Browse Business Goals"
            actionHref="/business-goals"
            showAdmin={false}
          />
        </div>
      </div>
    );
  }

  // Create a default icon if none is provided
  const defaultIcon = <Star className="h-6 w-6 text-white" />;

  // Convert features to the expected format with required icon property
  const formattedFeatures = businessGoal.features?.map(feature => ({
    ...feature,
    icon: feature.icon || <Star className="h-6 w-6" /> // Provide default icon if missing
  })) || [];

  return (
    <>
      <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container mx-auto">
          <Link to="/business-goals" className="inline-flex items-center text-vending-blue-dark hover:text-vending-blue py-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Business Goals
          </Link>
        </div>
      </div>

      <BusinessGoalHero
        title={businessGoal.title}
        description={businessGoal.description}
        image={businessGoal.image?.url || '/placeholder.svg'}
        icon={businessGoal.icon ? <span className="text-white">{businessGoal.icon}</span> : defaultIcon}
      />

      {businessGoal.benefits && businessGoal.benefits.length > 0 && (
        <BusinessGoalKeyBenefits 
          benefits={businessGoal.benefits}
          title={`Key Benefits of ${businessGoal.title}`}
        />
      )}

      {formattedFeatures.length > 0 && (
        <BusinessGoalFeatures features={formattedFeatures} />
      )}

      <BusinessGoalInquiry title={`Ready to learn more about ${businessGoal.title}?`} />
    </>
  );
};

export default BusinessGoalDetail;
