
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BusinessGoalEditorForm from '@/components/admin/business-goal-editor/BusinessGoalEditorForm';

const BusinessGoalEditor = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  
  return (
    <Layout>
      <BusinessGoalEditorForm goalSlug={goalSlug} />
    </Layout>
  );
};

export default BusinessGoalEditor;
