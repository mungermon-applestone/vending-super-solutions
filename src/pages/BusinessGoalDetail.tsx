import React from "react";
import { useParams } from "react-router-dom";
import { useBusinessGoal } from "@/hooks/cms/useBusinessGoal";
import { Button } from "@/components/ui/button";
import ContentfulErrorBoundary from "@/components/common/ContentfulErrorBoundary";
import ContentfulFallbackMessage from "@/components/common/ContentfulFallbackMessage";
import { Link } from "react-router-dom";

const BusinessGoalDetail: React.FC = () => {
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
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">{businessGoal.title}</h1>
        <p className="text-gray-600 mb-6">{businessGoal.description}</p>
        {businessGoal.image && (
          <img
            src={businessGoal.image}
            alt={businessGoal.imageAlt || businessGoal.title}
            className="w-full rounded-md mb-6"
          />
        )}
        {businessGoal.benefits && businessGoal.benefits.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Key Benefits</h2>
            <ul className="list-disc list-inside">
              {businessGoal.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        <Button asChild>
          <Link to="/business-goals">Back to Business Goals</Link>
        </Button>
      </div>
    </ContentfulErrorBoundary>
  );
};

export default BusinessGoalDetail;
