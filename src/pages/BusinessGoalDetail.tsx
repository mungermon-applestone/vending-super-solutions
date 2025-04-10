
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const BusinessGoalDetail = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Business Goal: {goalSlug}</h1>
        <p>Details about this business goal will appear here.</p>
      </div>
    </Layout>
  );
};

export default BusinessGoalDetail;
