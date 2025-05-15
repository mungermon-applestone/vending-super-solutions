
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BusinessGoalDetail from '@/components/business-goals/BusinessGoalDetail';
import { useContentfulBusinessGoalBySlug } from '@/hooks/cms/useContentfulBusinessGoals';
import { Loader } from '@/components/ui/loader';

const BusinessGoalDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: businessGoal, isLoading, error } = useContentfulBusinessGoalBySlug(slug);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <h2 className="text-2xl font-bold">Error Loading Business Goal</h2>
            <p>{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          </div>
        ) : !businessGoal ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Business Goal Not Found</h2>
            <p>The business goal you're looking for does not exist or has been removed.</p>
          </div>
        ) : (
          <BusinessGoalDetail businessGoal={businessGoal} />
        )}
      </div>
    </Layout>
  );
};

export default BusinessGoalDetailPage;
