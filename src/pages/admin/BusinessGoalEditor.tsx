
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const BusinessGoalEditor = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  const isCreating = !goalSlug;
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">
          {isCreating ? 'Create New Business Goal' : `Edit Business Goal: ${goalSlug}`}
        </h1>
        <p>Business goal editor form will go here.</p>
      </div>
    </Layout>
  );
};

export default BusinessGoalEditor;
