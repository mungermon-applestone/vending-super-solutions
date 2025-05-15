
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BusinessGoalDetail from '@/components/business-goals/BusinessGoalDetail';
import { useContentfulBusinessGoalBySlug } from '@/hooks/cms/useContentfulBusinessGoals';
import { Loader } from '@/components/ui/loader';

const BusinessGoalDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return (
      <Layout>
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold">Error: Missing Business Goal ID</h1>
          <p className="mt-4">No business goal slug was provided.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <BusinessGoalDetail slug={slug} />
      </div>
    </Layout>
  );
};

export default BusinessGoalDetailPage;
