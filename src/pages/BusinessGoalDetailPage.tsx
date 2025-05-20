
import React from "react";
import { useParams } from "react-router-dom";
import { useBusinessGoal } from "@/hooks/cms/useBusinessGoal";
import ContentfulErrorBoundary from "@/components/common/ContentfulErrorBoundary";
import ContentfulFallbackMessage from "@/components/common/ContentfulFallbackMessage";
import BusinessGoalDetail from "./BusinessGoalDetail";
import BusinessGoalSEO from "@/components/seo/BusinessGoalSEO";

const BusinessGoalDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: businessGoal, isLoading, error, refetch } = useBusinessGoal(slug || '');

  if (isLoading) {
    return <div>Loading business goal...</div>;
  }

  if (error) {
    return (
      <ContentfulFallbackMessage 
        title="Error loading business goal"
        message={`We encountered an error loading this business goal: ${error.message}`}
        onRetry={refetch}
        contentType="Business Goal"
      />
    );
  }

  if (!businessGoal) {
    return (
      <ContentfulFallbackMessage
        title="Business goal not found"
        message={`We couldn't find a business goal with the slug "${slug}".`}
        onRetry={refetch}
        contentType="Business Goal"
      />
    );
  }

  return (
    <ContentfulErrorBoundary contentType="Business Goal">
      {/* Add SEO component */}
      <BusinessGoalSEO businessGoal={businessGoal} />
      <BusinessGoalDetail businessGoal={businessGoal} />
    </ContentfulErrorBoundary>
  );
};

export default BusinessGoalDetailPage;
